import atexit

from flask_pymongo import PyMongo
from neo4j import Auth, Driver, GraphDatabase

mongo = PyMongo()
neo4j_driver = None


def init_neo4j(uri: str, auth: Auth):
    global neo4j_driver
    neo4j_driver = GraphDatabase.driver(uri, auth=auth)

    def close_neo4j():
        neo4j_driver.close()

    atexit.register(close_neo4j)

    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            tx.run(
                "CREATE CONSTRAINT IF NOT EXISTS FOR (d:Dish) REQUIRE (d.id) IS UNIQUE;"
            )
            tx.run("CREATE INDEX IF NOT EXISTS FOR (d:Dish) ON (d.id);")
            tx.run(
                "CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE (u.email) IS UNIQUE;"
            )
            tx.run("CREATE INDEX IF NOT EXISTS FOR (u:User) ON (u.email);")
            tx.run(
                "CREATE CONSTRAINT IF NOT EXISTS FOR (a:Allergen) REQUIRE (a.id) IS UNIQUE;"
            )
            tx.run("CREATE INDEX IF NOT EXISTS FOR (a:Allergen) ON (a.id);")
            tx.run(
                "CREATE CONSTRAINT IF NOT EXISTS FOR (m:Meal) REQUIRE (m.id) IS UNIQUE;"
            )
            tx.run("CREATE INDEX IF NOT EXISTS FOR (m:Meal) ON (m.id);")
            tx.commit()


def get_neo4j() -> Driver:
    return neo4j_driver
