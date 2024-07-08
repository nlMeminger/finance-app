import os
import yaml
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from celery import Celery

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

    # Update app config with the appropriate environment settings
    app.config.update(config.get(config_name, {}))

    # Construct database URL
    db_url = "postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}".format(**app.config)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url

    # Override with environment variables and secrets
    app.config['SECRET_KEY'] = read_secret('secret_key') or os.getenv('SECRET_KEY') or app.config.get('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = read_secret('jwt_secret_key') or os.getenv('JWT_SECRET_KEY') or app.config.get('JWT_SECRET_KEY')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    # Configure Celery
    celery.conf.update(
        broker_url=app.config['CELERY_BROKER_URL'],
        result_backend=app.config['CELERY_RESULT_BACKEND']
    )

    # Import and register blueprints
    from .routes import main as main_blueprint
    from .auth import auth
    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app