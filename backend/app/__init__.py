from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt # db instance
from .models import user
from .models import pet
from app.api_routes.users_routes import users_bp
from app.api_routes.auth import auth_bp
from app.api_routes.pets import pets_bp
from app.api_routes.providers import providers_bp
from app.api_routes.reviews import reviews_bp
from app.api_routes.appointments import appointments_bp

def create_app():
    # initialise flask app
    app = Flask(__name__)

    # load configurations
    app.config.from_object(Config)

    # enable CORS
    CORS(app)

    # initialise extensions
    db.init_app(app)
    jwt.init_app(app)

    # ========================
    # Create database tables
    # ========================
    with app.app_context():
        db.create_all()  # automatically creates tables if they don't exist

    # ========================
    # Register Blueprints
    # ========================
    app.register_blueprint(users_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(pets_bp)
    app.register_blueprint(providers_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(appointments_bp)

    return app
