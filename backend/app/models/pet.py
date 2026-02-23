from app.extensions import db
from datetime import date, datetime
from sqlalchemy.orm import validates, relationship
from sqlalchemy import Enum
import enum
import uuid

# =====================
# ENUMS
# =====================

class SpeciesEnum(enum.Enum):
    dog = "dog"
    cat = "cat"

class DogBreedEnum(enum.Enum):
    labrador = "labrador"
    golden_retriever = "golden_retriever"
    german_shepherd = "german_shepherd"
    bulldog = "bulldog"
    mixed = "mixed"

class CatBreedEnum(enum.Enum):
    domestic_shorthair = "domestic_shorthair"
    domestic_longhair = "domestic_longhair"
    bengal = "bengal"
    siamese = "siamese"
    mixed = "mixed"

class GenderEnum(enum.Enum):
    male = "male"
    female = "female"
    unknown = "unknown"


# =====================
# MODEL
# =====================

class Pet(db.Model):
    __tablename__ = "pets"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    species = db.Column(Enum(SpeciesEnum), nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    gender = db.Column(Enum(GenderEnum), nullable=False)
    desexed = db.Column(db.Boolean, nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    weight = db.Column(db.Float, nullable=True)
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    # =====================
    # RELATIONSHIPS
    # =====================
    
    owner = relationship("User", back_populates='pets')
    appointments = relationship("Appointment", back_populates="pet", cascade="all,delete-orphan")

    # =====================
    # VALIDATORS
    # =====================
    @validates('name')
    def validate_name(self, key, value):
        """ Name validations """
        if not isinstance(value, str):
            raise TypeError(f"{key.title()} must be a string")
        value = value.strip()
        if len(value) > 50:
            raise ValueError(f"{key.title()} cannot exceed 50 characters")

        return value

    @validates('breed')
    def validate_breed(self, key, value):
        """ Breed type validation"""
        if not isinstance(value, str):
            raise TypeError(f"{key.title()} must be a string")
        value = value.strip()
        if len(value) > 100:
            raise ValueError("Breed cannot exceed 100 characters")

        return value

    @validates('date_of_birth')
    def validate_dob(self, key, value):
        """ DOB validation """
        if value and value > date.today():
            raise ValueError("Date of birth cannot be in the future")

        return value

    @validates('weight')
    def validate_weight(self, key, value):
        """ Weight validation """
        if value is None:
            return value # due optional attr
        
        if value <= 0:
            raise ValueError("Weight must be more than 0")
        
        return float(value)

    @validates('notes')
    def validate_notes(self, key, value):
        """Medical notes validation """
        if value is None:
            return value
        if not isinstance(value, str):
            raise TypeError("Notes must be a string")
        value = value.strip()
        if len(value) > 500:
            raise ValueError("Notes cannot exceed 500 characters")

        return value
    
    # =====================
    # COMPUTED PROPERTIES
    # =====================
    @property
    def age_years_months(self):
        """ Calculate pet age in years, months based of DOB"""
        if not self.date_of_birth:
            return None
        
        today = date.today()

        years = today.year - self.date_of_birth.year
        months = today.month - self.date_of_birth.month

        if today.day < self.date_of_birth.day:
            months -= 1

        if months < 0:
            years -= 1
            months += 12
        
        return years, months
    
    @property
    def age_display(self):
        """ Display age formatting for UI side """
        age = self.age_years_months
        if not age:
            return "Unknown"
        
        years, months = age

        if years and months:
            return f"{years} year{'s' if years != 1 else ''} {months} month{'s' if months != 1 else ''}"
        if years:
            return f"{years} year{'s' if years != 1 else ''}"
        return f"{months} month{'s' if months != 1 else ''}"