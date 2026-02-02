from app.extensions import db, bcrypt
from datetime import datetime
import re
from sqlalchemy.orm import validates

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="user")
    image_url = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # =====================
    # RELATIONSHIPS
    # =====================
    
    #  to be implemented when other models have setup otherwise conflicts will arise

    # =====================
    # VALIDATORS
    # =====================
    @validates('first_name', 'last_name')
    def validate_name(self, key, value):
        """ First and last name validations """
        if not isinstance(value, str):
            raise TypeError(f"{key.replace('_',' ').title()} must be a string")
        value = value.strip()
        if len(value) > 50:
            raise ValueError(f"{key.replace('_', ' ').title()} cannot exceed 50 characters")
        return value
    

    @validates('email')
    def validate_email(self, key, value):
        """ Email validation with email format using regex """
        if not isinstance(value, str):
            raise TypeError("Email must be a string")
        value = value.strip().lower()
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise ValueError("Invalid email address format")
        return value
    
    @validates('role')
    def validate_role(self, key, value):
        allowed_roles = ["user", "provider_employee"]
        if value not in allowed_roles:
            raise ValueError(f"Role must be one of {allowed_roles}")
        return value
    
    # =====================
    # PASSWORD HASHING
    # =====================
    def set_password(self, password):
        """Hash and store password """
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        """Verify a password against the stored hash"""
        return bcrypt.check_password_hash(self.password_hash, password)