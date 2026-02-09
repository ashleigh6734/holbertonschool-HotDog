from app.extensions import db
from datetime import datetime, time
import re
from sqlalchemy.orm import validates, relationship
import enum
import uuid

class ServiceType(enum.Enum):
    VET_CONSULTATIONS = "Vet Consultations"
    DESEXING = "Desexing"
    DENTAL = "Dental"
    VACCINATIONS = "Vaccinations"
    DOG_WALKING = "Dog Walking"
    NAIL_TRIMMING = "Nail Trimming"
    HAIRCUTS_COAT = "Haircuts and Coat Maintenance"
    PUPPY_TRAINING = "Puppy Training"

class ServiceProvider(db.Model):
    __tablename__ = "service_providers"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # 1. LINK TO USER (The Business Owner)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    
    # 2. SERVICE TYPE (Required for Search Filters)
    service_type = db.Column(db.Enum(ServiceType), nullable=False)

    # 3. AVAILABILITY (For Booking System)
    opening_time = db.Column(db.Time, nullable=False, default=time(9, 0)) 
    closing_time = db.Column(db.Time, nullable=False, default=time(17, 0))
    slot_duration = db.Column(db.Integer, nullable=False, default=30)

    # 4. BUSINESS DETAILS
    description = db.Column(db.String(500), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(25), nullable=True)
    email = db.Column(db.String(120), nullable=True) # Public contact email
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @validates("service_type")
    def validate_service_type(self, key, value):
        # 1. Allow passing the Enum object directly (e.g., ServiceType.GROOMING)
        if isinstance(value, ServiceType):
            return value

        # 2. Allow passing the string value (e.g., "Grooming")
        if isinstance(value, str):
            for member in ServiceType:
                if member.value == value:
                    return member
            
        raise ValueError(f"Invalid service type: '{value}'. Must be one of {[e.value for e in ServiceType]}")

    # =====================
    # RELATIONSHIPS
    # =====================
    
    # Relationship to the User model (Owner)
    user = db.relationship('User', back_populates='service_provider')
    appointments = db.relationship('Appointment', back_populates='service_provider', lazy=True)

    reviews = db.relationship(
        "Review",
        back_populates="service_provider", 
        lazy=True,
        cascade="all, delete-orphan",
    )

    # =====================
    # VALIDATORS
    # =====================

    @validates("slot_duration")
    def validate_slot_duration(self, key, value):
        if not isinstance(value, int):
            raise TypeError("Slot duration must be an integer (minutes)")
        if value < 15:
            raise ValueError("Slot duration must be at least 15 minutes")
        if value > 240:
             raise ValueError("Slot duration cannot exceed 4 hours (240 mins)")
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