from flask import Blueprint, abort, request, session

from backend.db_types import Preferences, Review, User
from backend.extensions import get_neo4j, mongo

user_api = Blueprint("user_api", __name__)

MAX_REVIEW_LENGTH = 1000
MAX_RATING = 10


def validate_review(review: Review) -> Review:
    if review.get("comment") is not None and not isinstance(review["comment"], str):
        abort(400)
    if review.get("comment") is not None and len(review["comment"]) > MAX_REVIEW_LENGTH:
        abort(400)
    if not isinstance(review.get("rating"), int):
        abort(400)
    if not (0 <= review["rating"] <= MAX_RATING):
        abort(400)
    if not isinstance(review.get("dish_id"), str):
        abort(400)
    if mongo.db.dishes.find_one({"id": review["dish_id"]}) is None:
        abort(400)
    return {
        "dish_id": review["dish_id"],
        "user_email": review["user_email"],
        "rating": review["rating"],
        "comment": review.get("comment"),
    }


def validate_preferences(preferences: Preferences) -> Preferences:
    if not isinstance(preferences.get("allergens"), list):
        abort(400)
    if len(preferences["allergens"]) > 20:
        abort(400)
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            for allergen in preferences["allergens"]:
                result = tx.run(
                    "MATCH (a:Allergen {id: $allergen_id}) RETURN a",
                    {"allergen_id": allergen},
                )
                if not result.single():
                    abort(400)
            tx.commit()
    return {"allergens": preferences["allergens"]}


def _rate_dish(review: Review):
    user_email = review["user_email"]
    mongo.db.reviews.replace_one(
        {"dish_id": review["dish_id"], "user_email": user_email},
        review,
        upsert=True,
    )
    # get new avg_rating for dish
    avg = list(
        mongo.db.reviews.aggregate(
            [
                {"$match": {"dish_id": review["dish_id"]}},
                {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}},
            ]
        )
    )[0]["avg_rating"]
    # update avg_rating
    mongo.db.dishes.update_one({"id": review["dish_id"]}, {"$set": {"avg_rating": avg}})

    # update rating relationship
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            tx.run(
                "MATCH (u:User {email: $user_email}), (d:Dish {id: $dish_id})"
                "MERGE (u)-[r:RATED]->(d)"
                "SET r.rating = $rating",
                {
                    "user_email": user_email,
                    "dish_id": review["dish_id"],
                    "rating": review["rating"],
                },
            )
            tx.commit()


@user_api.post("/user/rate_dish")
def rate_dish():
    if "user_email" not in session:
        abort(403)
    review = request.get_json()
    review = validate_review(review)
    if review["user_email"] != session["user_email"]:
        abort(403)
    _rate_dish(review)
    return {}


@user_api.get("/user/get_reviews")
def get_user_reviews():
    if "user_email" not in session:
        abort(403)
    user_email = session["user_email"]
    reviews = list(
        mongo.db.reviews.find({"user_email": user_email}, projection={"_id": False})
    )
    return reviews


@user_api.get("/user/me")
def get_me():
    if "user_email" not in session:
        abort(403)
    user_email = session["user_email"]
    user = mongo.db.users.find_one_or_404(
        {"email": user_email}, projection={"_id": False}
    )
    return user


@user_api.post("/user/update_preferences")
def update_preferences():
    if "user_email" not in session:
        abort(403)
    user_email = session["user_email"]
    preferences = request.get_json()
    preferences = validate_preferences(preferences)
    mongo.db.users.update_one(
        {"email": user_email}, {"$set": {"preferences": preferences}}
    )
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            # delete all allergen relationships for user
            tx.run(
                "MATCH (u:User {email: $user_email})-[r:ALLERGIC_TO]->(:Allergen) DELETE r",
                {"user_email": user_email},
            )
            # update allergen relationships for user
            for allergen in preferences["allergens"]:
                tx.run(
                    "MATCH (u:User {email: $user_email}), (a:Allergen {id: $allergen_id})"
                    "MERGE (u)-[:ALLERGIC_TO]->(a)",
                    {"user_email": user_email, "allergen_id": allergen},
                )
            tx.commit()

    return {}
