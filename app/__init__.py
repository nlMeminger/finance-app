from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from celery import Celery
from werkzeug.security import generate_password_hash, check_password_hash
import yaml
import os

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
celery = Celery()

def read_secret(secret_name):
    try:
        with open(f'/run/secrets/{secret_name}', 'r') as secret_file:
            return secret_file.read().strip()
    except IOError:
        return None

def create_app(config_name=None):
    app = Flask(__name__)

    # Load configuration
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    # Load config.yaml
    with open('config.yaml', 'r') as config_file:
        config = yaml.safe_load(config_file)

    app.config.update(config.get(config_name, {}))

    # Override with environment variables and secrets
    app.config['SECRET_KEY'] = read_secret('secret_key') or os.getenv('SECRET_KEY') or app.config.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = read_secret('database_url') or os.getenv('DATABASE_URL') or app.config.get('SQLALCHEMY_DATABASE_URI')
    app.config['JWT_SECRET_KEY'] = read_secret('jwt_secret_key') or os.getenv('JWT_SECRET_KEY') or app.config.get('JWT_SECRET_KEY')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    # Configure Celery
    celery.conf.update(app.config['CELERY_CONFIG'])

    # Import and register blueprints
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app