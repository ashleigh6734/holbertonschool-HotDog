import os
from pathlib import Path
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

# make the imports optional to avoid local seed issue
try:
    import certifi
except ImportError:
    certifi = None

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv(*args, **kwargs):
        return False

def create_app():
    # Load env vars from both backend/.env and backend/app/.env.
    app_dir = Path(__file__).resolve().parent
    load_dotenv(app_dir.parent / ".env")
    load_dotenv(app_dir / ".env")
    load_dotenv() # fallback default discovery
    if certifi:
        os.environ["SSL_CERT_FILE"] = certifi.where()

    # initialise flask app
    app = Flask(__name__,
        static_folder="../static",
        static_url_path="/static")
    
    # enable CORS: allow Vite site to access API with CORS -- Deployment
    CORS(app, resources={r"/*": {"origins": [
        "http://localhost:5173",
        "https://holbertonschool-hotdog-frontend.onrender.com"
    ]}})
    # CORS(
    #     app,
    #     origins=[
    #         "http://localhost:5173", # local development URL
    #         "https://holbertonschool-hotdog-frontend.onrender.com", # replace with your actual frontend URL
    #     ],
    #     supports_credentials=True,
    # )

    # load configurations
    app.config.from_object(Config)

    #Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
        print(f"✅ Instance Path: {app.instance_path}")
    except OSError:
        print(f"✅ Instance Path exists: {app.instance_path}")

    #FORCE the database to use this specific folder
    db_name = 'database.db' 
    db_path = os.path.join(app.instance_path, db_name)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    print(f"✅ Database URI:  {app.config['SQLALCHEMY_DATABASE_URI']}")

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

    @app.after_request
    def add_cors_headers(response):
        origin = response.request.headers.get("Origin") if hasattr(response, "request") else None
        allowed_origins = {
            "http://localhost:5173",
            "https://holbertonschool-hotdog-frontend.onrender.com",
        }

        if origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Vary"] = "Origin"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, PUT, DELETE, OPTIONS"

        return response

    return app
