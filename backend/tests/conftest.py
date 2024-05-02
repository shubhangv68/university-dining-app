import pytest
from flask import Flask

from backend.app import create_app
from backend.extensions import get_neo4j, mongo


@pytest.fixture()
def app():
    app = create_app(testing=True)

    # clear DBs
    mongo.db.users.delete_many({})
    mongo.db.reviews.delete_many({})
    mongo.db.dishes.delete_many({})
    mongo.db.menus.delete_many({})
    mongo.db.locations.delete_many({})
    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            tx.run("MATCH (u) DETACH DELETE u")
            tx.commit()

    yield app
    # clean up here


@pytest.fixture()
def client(app: Flask):
    return app.test_client()


@pytest.fixture()
def runner(app: Flask):
    return app.test_cli_runner()
