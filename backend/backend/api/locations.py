from flask import Blueprint

from backend.extensions import mongo

location_api = Blueprint("location_api", __name__)


@location_api.get("/locations")
def locations():
    return list(mongo.db.locations.find(projection={"_id": False}))
