"""Authentication blueprint for the personal finance management application."""

from flask import Blueprint, request, jsonify, render_template, redirect, url_for, flash, make_response, session
from flask_jwt_extended import create_access_token
from .models import User
from . import db
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash

auth = Blueprint('auth', __name__)


@auth.route('/register', methods=['GET', 'POST'])
def register():
    """Handle user registration."""
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
            flash("Username or email already exists")
            return render_template('auth/register.html')
    return render_template('auth/register.html')


@auth.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login."""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if not username or not password:
            return jsonify({"message": "Missing username or password"}), 400

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            session.clear()
            session['user_id'] = user.id
            response = make_response(redirect(url_for('main.index')))
            response.set_cookie('access_token_cookie', access_token, httponly=True, secure=True)
            print(f"{username} has logged in")
            return response
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    return render_template('auth/login.html')


@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    """Handle user logout."""
    session.pop('user_id', None)  # Remove user_id from session
    response = make_response(redirect(url_for('auth.login')))
    response.delete_cookie('access_token_cookie')
    return response