import atexit
import os
import random
from datetime import datetime

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_session import Session
from neo4j import Transaction, basic_auth
from pymongo.collection import Collection

from backend.api import *
from backend.api.auth import _create_user
from backend.api.user import _rate_dish
from backend.db_types import Dish, Review, UMassLocationInfo, User, dish_from_umass_dish
from backend.extensions import get_neo4j, init_neo4j, mongo


def update_db_menu_from_response(r: requests.Response, location_id: int):
    db_dishes: Collection[Dish] = mongo.db.dishes
    new_menu = {"menu": {}, "location_id": location_id}
    if not r.text:
        new_menu["closed"] = True
        return new_menu
    new_menu["closed"] = False
    menu = r.json()
    for meal_name, meal in menu.items():
        new_menu["menu"][meal_name] = {}
        new_menu["menu"][meal_name]["sections"] = {}
        for section, dishes in meal.items():
            if section == "meal_period":
                # parse meal start and end time
                open_time, close_time = [
                    datetime.strptime(time_str, "%I:%M %p").time()
                    for time_str in dishes.split(" - ")
                ]
                new_menu["menu"][meal_name]["open_time"] = open_time.isoformat(
                    "minutes"
                )
                new_menu["menu"][meal_name]["close_time"] = close_time.isoformat(
                    "minutes"
                )
            else:
                new_dishes = []
                for dish in dishes:
                    dish = dish_from_umass_dish(dish)
                    # add dish to db if it doesn't exist already
                    db_dishes.update_one(
                        {"id": dish["id"]},
                        {"$set": dish},
                        upsert=True,
                    )
                    new_dishes.append(dish)
                new_menu["menu"][meal_name]["sections"][section] = new_dishes
    return new_menu


def _update_dish_graph(tx: Transaction, dish: Dish, location_id: int, meal_name: str):
    # add dish -> meal relation
    tx.run(
        "MERGE (d:Dish {id: $dish_id})"
        "MERGE (m:Meal {id: $meal_id})"
        "CREATE (d)-[:SERVED_AT]->(m)",
        {
            "dish_id": dish["id"],
            "meal_id": f"{location_id}-{meal_name}",
        },
    )
    # add dish -> allergen relations
    for allergen in dish["allergens"]:
        tx.run(
            "MERGE (d:Dish {id: $dish_id})"
            "MERGE (a:Allergen {id: $allergen_id})"
            "MERGE (d)-[:HAS_ALLERGEN]->(a)",
            {
                "dish_id": dish["id"],
                "allergen_id": allergen,
            },
        )


def update_db_location(location_id: int, tx: Transaction):
    db_menus: Collection = mongo.db.menus
    params = {"tid": location_id, "is_app": 1}
    with requests.get("https://umassdining.com/foodpro-menu-ajax", params=params) as r:
        r.raise_for_status()
        menu = update_db_menu_from_response(r, location_id)
    db_menus.replace_one({"location_id": location_id}, menu, upsert=True)
    # update graph db
    for meal_name, meal in menu["menu"].items():
        for section, dishes in meal["sections"].items():
            for dish in dishes:
                _update_dish_graph(tx, dish, location_id, meal_name)


def update_db():
    """Update our database using data from UMass dining API"""
    db_locations: Collection[UMassLocationInfo] = mongo.db.locations
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        # dining locations
        with requests.get("https://www.umassdining.com/uapp/get_infov2") as r:
            r.raise_for_status()
            locations: list[UMassLocationInfo] = r.json()
            for location in locations:
                db_locations.replace_one(
                    {"location_id": location["location_id"]}, location, upsert=True
                )

        # menus/food items
        with neo4j.begin_transaction() as tx:
            # remove all dish -> meal relations
            tx.run("MATCH (:Dish)-[r:SERVED_AT]->(:Meal) DELETE r")
            for location in db_locations.find(projection={"location_id": True}):
                update_db_location(location["location_id"], tx)
            tx.commit()

    if os.environ.get("IS_DEMO"):
        create_demo_data()
        os.environ["IS_DEMO"] = ""


def create_app(testing: bool = False):
    dotenv_path = os.environ["SECRETS_DOTENV_PATH"]
    load_dotenv(dotenv_path)
    app = Flask(__name__)
    app.secret_key = os.environ["FLASK_SECRET"]

    app.config["MONGO_URI"] = os.environ["MONGO_URI"]
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['CORS_SUPPORTS_CREDENTIALS'] = True
    jwt = JWTManager(app)
    app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']

    app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_COOKIE_NAME"] = "umass-session"

    Session(app)
    CORS(app, supports_credentials=True)

    app.testing = testing

    register_extensions(app)
    register_blueprints(app)

    return app


def register_extensions(app: Flask):
    # MongoDB
    mongo.init_app(app)
    mongo.db.locations.create_index("location_id", unique=True)
    mongo.db.dishes.create_index("id", unique=True)
    mongo.db.menus.create_index("location_id", unique=True)
    mongo.db.users.create_index("email", unique=True)
    mongo.db.reviews.create_index(["dish_id", "user_email"], unique=True)

    # Neo4j
    init_neo4j(
        os.environ["NEO4J_URI"],
        basic_auth(os.environ["NEO4J_USERNAME"], os.environ["NEO4J_PASSWORD"]),
    )

    # APscheduler (must come after both DBs init)
    scheduler = BackgroundScheduler()
    if not app.testing:
        scheduler.add_job(
            func=update_db,
            trigger="interval",
            seconds=60,
            misfire_grace_time=60,
            coalesce=True,
            next_run_time=datetime.now(),
        )
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())


def register_blueprints(app: Flask):
    app.register_blueprint(menu_api)
    app.register_blueprint(location_api)
    app.register_blueprint(auth_api)
    app.register_blueprint(user_api)


def create_demo_data():
    print("Creating demo data!")
    db_dishes: Collection[Dish] = mongo.db.dishes
    db_users: Collection[User] = mongo.db.users
    db_reviews: Collection[Review] = mongo.db.reviews

    print("Removing users and reviews")
    # remove all users and reviews
    db_users.delete_many({})
    db_reviews.delete_many({})
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            tx.run("MATCH (u:User) DETACH DELETE u")
            tx.commit()

    def random_email():
        return f"student{random.randint(0, 99999999):08}@umass.edu"

    def random_name():
        names = ("Gavin", "Greeshma", "Niya", "Shane", "Shubhang")
        return random.choice(names)

    def random_preferences():
        pref_prob = 0.05
        allergens = ("Soy", "Corn", "Milk", "Gluten", "Wheat", "Eggs", "Sesame")
        prefs = {"allergens": []}
        for allergen in allergens:
            if random.random() < pref_prob:
                prefs["allergens"].append(allergen)
        return prefs

    def random_review(dish_id: str, user: User):
        return {
            "dish_id": dish_id,
            "user_email": user["email"],
            "rating": random.randint(0, 10),
            "comment": f"This is a review by {user['name']}",
        }

    print("Creating users")
    # create users with reviews
    with neo4j_driver.session(database="neo4j") as neo4j:
        num_users = 100
        review_prob = 0.05
        users = []
        for _ in range(num_users):
            user = {
                "email": random_email(),
                "token": "",
                "name": random_name(),
                "preferences": random_preferences(),
            }
            _create_user(user)
            with neo4j.begin_transaction() as tx:
                for allergen in user["preferences"]["allergens"]:
                    tx.run(
                        "MATCH (u:User {email: $user_email}), (a:Allergen {id: $allergen_id})"
                        "MERGE (u)-[:ALLERGIC_TO]->(a)",
                        {"user_email": user["email"], "allergen_id": allergen},
                    )
                tx.commit()
            users.append(user)

    print("Creating reviews")
    for dish in db_dishes.find({}):
        for user in users:
            if random.random() < review_prob:
                review = random_review(dish["id"], user)
                _rate_dish(review)

    print("Demo data created!")


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
