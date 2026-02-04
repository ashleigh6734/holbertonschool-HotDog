from flask_jwt_extended import create_access_token
from app.models.user import User

class AuthService():

    @staticmethod
    def login(email, password):
        user = User.query.filter_by(email=email).first()

        if not user:
            raise ValueError("Email not found")
        
        if not user.check_password(password):
            raise ValueError("Invalid password")
        
        # Create a JWT token with the user's if and role flag
        access_token = create_access_token(
            identity=user.id,
            additional_claims={"role": user.role}
        )

        # Return the JWT token to client
        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role
            }
        }