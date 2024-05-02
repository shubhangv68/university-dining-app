from typing import Optional

from flask import Blueprint, abort, session

from backend.db_types import Dish, Preferences
from backend.extensions import get_neo4j, mongo

menu_api = Blueprint("menu_api", __name__)


def _filter_dish_from_prefs(dish: Dish, prefs: Optional[Preferences]) -> bool:
    if prefs is None:
        return True
    return len(set(dish["allergens"]).intersection(set(prefs["allergens"]))) == 0


@menu_api.get("/menu/<int:location_id>")
def menu(location_id: int):
    menu = mongo.db.menus.find_one_or_404({"location_id": location_id})["menu"]
    user_email = session.get("user_email")
    prefs = None
    if user_email:
        user = mongo.db.users.find_one_or_404(
            {"email": user_email}, projection={"_id": False}
        )
        prefs = user["preferences"]
    for meal_name, meal in menu.items():
        for section, dishes in meal["sections"].items():
            new_dishes = []
            for dish in dishes:
                if _filter_dish_from_prefs(dish, prefs):
                    new_dishes.append(dish)
                else:
                    continue
                if user_email:
                    # we are logged in; update menu with our reviews for current dishes
                    my_fields = {"my_rating": None, "my_comment": None}
                    my_reviews = list(
                        mongo.db.reviews.find(
                            {"dish_id": dish["id"], "user_email": user_email}
                        )
                    )
                    if len(my_reviews) > 0:
                        review = my_reviews[0]
                        my_fields["my_rating"] = review["rating"]
                        my_fields["my_comment"] = review.get("comment")
                    dish.update(my_fields)
                # update dish with avg_rating
                avg_rating = None
                d = list(mongo.db.dishes.find({"id": dish["id"]}))
                if len(d) > 0:
                    avg_rating = d[0].get("avg_rating", None)
                dish["avg_rating"] = avg_rating
            meal["sections"][section] = new_dishes
    return menu

@menu_api.get("/menu/<string:dish_id>/reviews")
def get_reviews(dish_id: str):
    reviews = list(
        mongo.db.reviews.find(
            {"dish_id": dish_id}, projection={"_id": False, "user_email": False}
        )
    )
    return reviews


@menu_api.get("/menu/<int:location_id>/<string:meal_name>/recommended")
def recommended(location_id: int, meal_name: str):
    if "user_email" not in session:
        abort(403)
    user_email = session["user_email"]
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            # find k users with most similar taste using Pearson similarity
            # return top n rated dishes which user is not allergic to and is being served currently
            # parameters: k, n, user_email, meal_id
            result = tx.run(
                "MATCH (u1:User {email: $user_email})-[r:RATED]->(d:Dish) "
                "WITH u1, avg(r.rating) AS u1_mean "
                "MATCH (u1)-[r1:RATED]->(d:Dish)<-[r2:RATED]-(u2:User) "
                "WITH u1, u1_mean, u2, COLLECT({r1: r1, r2: r2}) AS ratings "
                "MATCH (u2)-[r:RATED]->(d:Dish) "
                "WITH u1, u1_mean, u2, avg(r.rating) AS u2_mean, ratings "
                "UNWIND ratings AS r "
                "WITH sum( (r.r1.rating-u1_mean) * (r.r2.rating-u2_mean) ) AS nom, "
                "sqrt( sum( (r.r1.rating - u1_mean)^2) * sum( (r.r2.rating - u2_mean) ^2)) AS denom, "
                "u1, u2 WHERE denom <> 0 "
                "WITH u1, u2, nom/denom AS pearson "
                "ORDER BY pearson DESC LIMIT $k "
                "MATCH (u2)-[r:RATED]->(d:Dish) WHERE NOT EXISTS( (u1)-[:RATED]->(d) ) "
                "AND NOT EXISTS( (u1)-[:ALLERGIC_TO]->(:Allergen)<-[:HAS_ALLERGEN]-(d) ) "
                "AND EXISTS( (d)-[:SERVED_AT]->(:Meal {id: $meal_id}) ) "
                "RETURN d.id AS id, sum(pearson * r.rating) AS score "
                "ORDER BY score DESC LIMIT $n",
                {
                    "user_email": user_email,
                    "k": 10,
                    "n": 5,
                    "meal_id": f"{location_id}-{meal_name}",
                },
            )
            res = result.data()
            tx.commit()
    ret = []
    for obj in res:
        dish = mongo.db.dishes.find_one_or_404(
            {"id": obj["id"]}, projection={"_id": False}
        )
        ret.append({"dish": dish, "score": obj["score"]})
    return ret
