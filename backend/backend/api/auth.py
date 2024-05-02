import os
from datetime import timedelta

import requests
from flask import Blueprint, jsonify, request, session
from flask_jwt_extended import create_refresh_token

from backend.db_types import User
from backend.extensions import get_neo4j, mongo

auth_api = Blueprint("auth_api", __name__)


def _create_user(user: User):
    users_db = mongo.db.users
    users_db.insert_one(user)

    neo4j_driver = get_neo4j()
    with neo4j_driver.session(database="neo4j") as neo4j:
        with neo4j.begin_transaction() as tx:
            tx.run(
                "CREATE (u:User {email: $user_email})", {"user_email": user["email"]}
            )
            tx.commit()


@auth_api.post("/login")
def login():

    auth_code = request.get_json()['code']

    data = {
        "code": auth_code,
        "client_id": os.environ["GOOGLE_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_SECRET_KEY"],
        "redirect_uri": "postmessage",
        "grant_type": "authorization_code",
    }

    response = requests.post('https://oauth2.googleapis.com/token', data=data).json()
    headers = {
        'Authorization': f'Bearer {response["access_token"]}'
    }
    user_info = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()

    if not user_info['email'].endswith('umass.edu'):
        return jsonify({"error": "Unauthorized - Email domain must be umass.edu"}), 401

    jwt_token = create_refresh_token(identity=user_info['email'], expires_delta=timedelta(days=7))

    users_db = mongo.db.users
    existing_user = users_db.find_one({"email": user_info['email']})

    if existing_user:
        users_db.update_one({"email": user_info['email']}, {"$set": {"token": jwt_token}})
    else:
        default_prefs = {"allergens": []}
        _create_user(
            {
                "email": user_info["email"],
                "token": jwt_token,
                "name": user_info["name"],
                "preferences": default_prefs,
            }
        )

    response = jsonify(user=user_info, refresh_token=jwt_token)

    session["user_email"] = user_info["email"]

    return response, 200

@auth_api.post("/verifyToken")
def verify():
    data = request.json

    if 'email' not in data or 'token' not in data:
        return (
            jsonify({"error": "Email and token are required in the request body"}),
            400,
        )
    email = data['email']
    token = data['token']

    users_db = mongo.db.users

    user = users_db.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 401

    if user.get('token') == token:
        session["user_email"] = email
        return jsonify(logged_in_as=user.get('name')), 200
    else:
        return jsonify({"error": "Token does not match"}), 401
