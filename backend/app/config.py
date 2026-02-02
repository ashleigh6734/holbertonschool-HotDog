import os

# Full absolute path to this file
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    SQLALCHEMY_DATABASE_URI = (
        # /backend/database/app.db
        "sqlite:///" + os.path.join(BASE_DIR, "..", "database", "app.db")
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False