from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, JWTManager
from .models import User, Account, Transaction, Budget, SavingsGoal, Bill, Investment, Debt
from . import db
from sqlalchemy.exc import IntegrityError
from datetime import datetime

auth = Blueprint('auth', __name__)
#jwt = JWTManager(current_app)


@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    try:
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Username or email already exists"}), 400

@auth.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@auth.route('/logout', methods=['POST'])
def logout():
    pass