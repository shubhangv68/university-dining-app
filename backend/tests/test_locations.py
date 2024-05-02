from typing import get_type_hints

from flask.testing import FlaskClient

from backend.app import update_db
from backend.db_types import UMassLocationInfo


def test_locations(client: FlaskClient):
    update_db()
    res = client.get("/locations")
    assert res.get_json()[0].keys() == get_type_hints(UMassLocationInfo).keys()
