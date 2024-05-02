from typing import get_type_hints

from flask.testing import FlaskClient

from backend.api.auth import _create_user
from backend.app import _update_dish_graph
from backend.db_types import User
from backend.extensions import get_neo4j, mongo


def test_recs_and_reviews(client: FlaskClient):
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        users = []
        for i in range(100):
            user = {
                "email": f"tester{i}@umass.edu",
                "token": "",
                "name": f"Tester {i}",
                "preferences": {"allergens": []},
            }
            # target user has milk allergy
            if i == 0:
                user["preferences"]["allergens"].append("Milk")
            _create_user(user)
            with neo4j.begin_transaction() as tx:
                for allergen in user["preferences"]["allergens"]:
                    tx.run(
                        "MATCH (u:User {email: $user_email}) MERGE (a:Allergen {id: $allergen_id})"
                        "MERGE (u)-[:ALLERGIC_TO]->(a)",
                        {"user_email": user["email"], "allergen_id": allergen},
                    )
                tx.commit()
            users.append(user)

        # insert test dishes
        dishes = [
            {"id": "Similar dish 1", "allergens": []},
            {"id": "Similar dish 2", "allergens": []},
            {"id": "Best dish ever (Milk)", "allergens": ["Milk"]},
            {"id": "Best dish ever (No milk)", "allergens": []},
            {"id": "Worst dish ever", "allergens": []},
        ]
        with neo4j.begin_transaction() as tx:
            for dish in dishes:
                mongo.db.dishes.update_one(
                    {"id": dish["id"]},
                    {"$set": dish},
                    upsert=True,
                )
                _update_dish_graph(tx, dish, 1, "meal")
            tx.commit()

    # insert other user reviews
    # each half of users has the same reviews
    for i, user in enumerate(users):
        with client.session_transaction() as session:
            session["user_email"] = user["email"]
        is_similar = i % 2 == 0
        reviews = [
            {
                "dish_id": "Best dish ever (Milk)",
                "user_email": user["email"],
                "rating": 10,
                "comment": None,
            },
            {
                "dish_id": "Best dish ever (No milk)",
                "user_email": user["email"],
                "rating": 9 if is_similar else 1,
                "comment": None,
            },
            {
                "dish_id": "Worst dish ever",
                "user_email": user["email"],
                "rating": 1 if is_similar else 9,
                "comment": None,
            },
            {
                "dish_id": "Similar dish 1",
                "user_email": user["email"],
                "rating": 8 if is_similar else 1,
                "comment": None,
            },
            {
                "dish_id": "Similar dish 2",
                "user_email": user["email"],
                "rating": 3 if is_similar else 7,
                "comment": None,
            },
        ]
        if i == 0:
            # recommendation only returns dishes we haven't rates
            # so only rate the last two dishes
            reviews = reviews[3:]
        for review in reviews:
            client.post("/user/rate_dish", json=review)

    # test recommendation
    with client.session_transaction() as session:
        session["user_email"] = users[0]["email"]
    res = client.get("/menu/1/meal/recommended")
    data = res.get_json()

    # since user is allergic to highest rated dish
    # we shouldn't return it
    assert data[0]["dish"]["id"] == "Best dish ever (No milk)"
    assert data[1]["dish"]["id"] == "Worst dish ever"


def test_preferences(client: FlaskClient):
    user = {
        "email": "tester@umass.edu",
        "token": "",
        "name": "Tester",
        "preferences": {"allergens": []},
    }
    _create_user(user)
    with client.session_transaction() as session:
        session["user_email"] = user["email"]

    res = client.get("/user/me")
    data = res.get_json()
    assert data.keys() == get_type_hints(User).keys()
    assert data["email"] == "tester@umass.edu"

    dish = {"id": "Milk Dish", "allergens": ["Milk"]}
    mongo.db.dishes.update_one(
        {"id": dish["id"]},
        {"$set": dish},
        upsert=True,
    )
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            _update_dish_graph(tx, dish, 1, "meal")
            tx.commit()

    new_prefs = {"allergens": ["Milk"]}
    res = client.post("/user/update_preferences", json=new_prefs)

    res = client.get("/user/me")
    data = res.get_json()
    assert data["preferences"]["allergens"] == ["Milk"]


def test_user_reviews(client: FlaskClient):
    user = {
        "email": "tester@umass.edu",
        "token": "",
        "name": "Tester",
        "preferences": {"allergens": []},
    }
    _create_user(user)
    with client.session_transaction() as session:
        session["user_email"] = user["email"]

    dish = {"id": "My dish", "allergens": []}
    mongo.db.dishes.update_one(
        {"id": dish["id"]},
        {"$set": dish},
        upsert=True,
    )
    mongo.db.menus.insert_one(
        {
            "menu": {
                "meal": {
                    "start_time": "",
                    "end_time": "",
                    "sections": {"section": [dish]},
                }
            },
            "location_id": 1,
            "closed": False,
        }
    )
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            _update_dish_graph(tx, dish, 1, "meal")
            tx.commit()

    review = {
        "dish_id": "My dish",
        "user_email": user["email"],
        "rating": 10,
        "comment": "This is my dish",
    }
    client.post("/user/rate_dish", json=review)
    res = client.get("/menu/1")
    menu = res.get_json()
    assert menu["meal"]["sections"]["section"][0]["my_rating"] == 10
    assert menu["meal"]["sections"]["section"][0]["my_comment"] == "This is my dish"
