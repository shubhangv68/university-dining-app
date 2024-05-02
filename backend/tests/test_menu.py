from typing import get_type_hints

from flask.testing import FlaskClient

from backend.api.auth import _create_user
from backend.app import update_db
from backend.db_types import Dish
from backend.extensions import mongo


def test_menu(client: FlaskClient):
    update_db()
    res = client.get("/menu/1")
    menu = res.get_json()
    for meal_name, meal in menu.items():
        assert isinstance(meal["open_time"], str)
        assert isinstance(meal["close_time"], str)
        for section, dishes in meal["sections"].items():
            assert all(
                (set(dish.keys()) | {"avg_rating", "my_rating", "my_comment"})
                == set(get_type_hints(Dish).keys())
                for dish in dishes
            )


def test_menu_filter(client: FlaskClient):
    menu = {
        "location_id": 1,
        "menu": {
            "Meal1": {
                "open_time": "",
                "close_time": "",
                "sections": {
                    "Section1": [
                        {"id": "Dish no milk", "allergens": []},
                        {"id": "Dish with milk", "allergens": ["Milk"]},
                    ]
                },
            }
        },
    }
    mongo.db.menus.replace_one(
        {"location_id": menu["location_id"]},
        menu,
        upsert=True,
    )

    # Test user with milk allergy
    user = {
        "email": "tester@umass.edu",
        "token": "",
        "name": "Tester",
        "preferences": {"allergens": ["Milk"]},
    }
    _create_user(user)
    with client.session_transaction() as session:
        session["user_email"] = user["email"]

    res = client.get("/menu/1")
    menu = res.get_json()
    dishes = menu["Meal1"]["sections"]["Section1"]
    assert len(dishes) == 1
    assert dishes[0]["id"] == "Dish no milk"

    # Test user without milk allergy
    user2 = {
        "email": "tester2@umass.edu",
        "token": "",
        "name": "Tester2",
        "preferences": {"allergens": []},
    }
    _create_user(user2)
    with client.session_transaction() as session:
        session["user_email"] = user2["email"]

    res = client.get("/menu/1")
    menu = res.get_json()
    dishes = menu["Meal1"]["sections"]["Section1"]
    assert len(dishes) == 2
