from app.extensions import db
from datetime import datetime
import re
from sqlalchemy.orm import validates, relationship

class ServiceProvider(db.Model):
    __tablename__ = "service_providers"

    id = db.Column(db.Integer, primary_key=True)
    
    # 1. LINK TO USER (The Business Owner)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    name = db.Column(db.String(100), nullable=False)

    # 2. SERVICE TYPE (Required for Search Filters)
    service_type = db.Column(db.String(50), nullable=False)

    description = db.Column(db.String(500), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(25), nullable=True)
    email = db.Column(db.String(120), nullable=True) # Public contact email
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # =====================
    # RELATIONSHIPS
    # =====================
    
    # Relationship to the User model (Owner)
    # This uses a backref to access 'user.service_provider'
    owner = relationship('User', backref=db.backref('service_provider', uselist=False))

    """reviews = relationship(
        "Review",
        back_populates="service_provider", 
        lazy=True,
        cascade="all, delete-orphan",
    )
"""
    # =====================
    # VALIDATORS
    # =====================

    # Validator for Service Type (Ensures clean data for filters)
    @validates("service_type")
    def validate_service_type(self, key, value):
        valid_services = ["Grooming", "Walking", "Boarding", "Veterinary", "Training"]
        if value not in valid_services:
            raise ValueError(f"Service type must be one of {valid_services}")
        return value

    @validates("name")
    def validate_name(self, key, value):
        if not isinstance(value, str):
            raise TypeError("Name must be a string")
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty")
        if len(value) > 100:
            raise ValueError("Name cannot exceed 100 characters")
        return value

    @validates("description")
    def validate_description(self, key, value):
        if value is None:
            return value
        if not isinstance(value, str):
            raise TypeError("Description must be a string")
        value = value.strip()
        if len(value) > 500:
            raise ValueError("Description cannot exceed 500 characters")
        return value

    @validates("address")
    def validate_address(self, key, value):
        if value is None:
            return value
        if not isinstance(value, str):
            raise TypeError("Address must be a string")
        value = value.strip()
        if len(value) > 255:
            raise ValueError("Address cannot exceed 255 characters")
        return value

    @validates("phone")
    def validate_phone(self, key, value):
        if value is None:
            return value
        if not isinstance(value, str):
            raise TypeError("Phone must be a string")
        value = value.strip()
        if len(value) > 25:
            raise ValueError("Phone cannot exceed 25 characters")
        return value

    @validates("email")
    def validate_email(self, key, value):
        if value is None:
            return value
        if not isinstance(value, str):
            raise TypeError("Email must be a string")
        value = value.strip().lower()
        email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_regex, value):
            raise ValueError("Invalid email address format")
        return value