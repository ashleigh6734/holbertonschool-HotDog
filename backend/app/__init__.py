from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt # db instance
from .models import user
from .models import pet
from app.api_routes.users_routes import users_bp
from app.api_routes.auth import auth_bp

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

    return app