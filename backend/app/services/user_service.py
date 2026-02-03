from app.models.user import User
from app import db

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
            image_url=data.get("image_url"),
            # role defaults to "user" in model
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

    @staticmethod
    def update_user(user_id, data):
        # Get user
        user = User.query.get(user_id)
        if not user:
            return None
        
        # Email update with uniqueness checking
        if "email" in data and data["email"]:
            new_email = data["email"].strip()
            if new_email != user.email:
                existing = User.query.filter_by(email=new_email).first()
                if existing and existing.id != user.id:
                    raise ValueError("Email already in use")
                user.email = new_email

        # Password change
        if "password" in data and data["password"]:
            user.set_password(data["password"])

        # Other updatable fields
        if "first_name" in data:
            user.first_name = data["first_name"]

        if "last_name" in data:
            user.last_name = data["last_name"]

        if "image_url" in data:
            user.image_url = data["image_url"]

        db.session.commit()
        return user
    
    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return None
        
        db.session.delete(user)
        db.session.commit()
        return user
    
    @staticmethod
    def get_all_users():
        return User.query.all()