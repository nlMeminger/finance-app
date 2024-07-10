from flask import Blueprint, request, jsonify, current_app, render_template, redirect, url_for, flash, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, JWTManager
from .models import User, Account, Transaction, Budget, SavingsGoal, Bill, Investment, Debt
from . import db
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)
#jwt = JWTManager(current_app)


@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        try:
            db.session.commit()
            return redirect(url_for('auth.login'))
        except IntegrityError:
            db.session.rollback()
            flash ("message: Username or email already exists")
            return(render_template('auth/register.html'))
    if request.method == 'GET':
        return render_template('auth/register.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if not username or not password:
            return jsonify({"message": "Missing username or password"}), 400

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            response = make_response(redirect(url_for('main.index')))
            response.set_cookie('access_token_cookie', access_token, httponly=True, secure=True)
            print("{} has logged in".format(username))
            return redirect(url_for('main.index'))
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    if request.method == 'GET':
        return render_template('auth/login.html')


@auth.route('/logout', methods=['POST'])
def logout():
    response = make_response(redirect(url_for('auth.login')))
    response.delete_cookie('access_token_cookie')
    return response