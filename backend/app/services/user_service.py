from app.models.user import User
from app import db
from app.extensions import bcrypt

class UserService():

    @staticmethod
    def create_user(data):
        # Check if email already exists
        existing_email = User.query.filter_by(email=data['email'].first())
        if existing_email:
            raise ValueError("Email already registered")

        # User instance
        user = User(
            first_name=data['first_name'],
            last_name=data["last_name"],
            email=data["email"],
            image_url=data.get("image_url")
        )

        # Model handles hashing of ps
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        return user
    
    @staticmethod
    def get_user_id(user_id):
        user = User.query.get(user_id)
        if not user:
            return ValueError("404: User not found")
        return user
    
    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    