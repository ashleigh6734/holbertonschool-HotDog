from app.extensions import db
from datetime import datetime
from sqlalchemy.orm import validates, relationship

class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    
    # 1. LINK TO USER (The Author)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # 2. LINK TO PROVIDER (The Business being reviewed)
    provider_id = db.Column(db.Integer, db.ForeignKey('service_providers.id'), nullable=False)
    
    # 3. LINK TO APPOINTMENT (The verified booking)
    # unique=True ensures a user can't review the same appointment twice
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False, unique=True)

    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # =====================
    # RELATIONSHIPS
    # =====================
    
    # Link to User
    user = relationship('User', backref=db.backref('reviews_written', lazy=True))
    
    # Link to ServiceProvider
    service_provider = relationship('ServiceProvider', back_populates='reviews')
    
    # Link to Appointment
    appointment = relationship('Appointment', backref=db.backref('review', uselist=False))

    # =====================
    # VALIDATORS
    # =====================
    
    @validates('rating')
    def validate_rating(self, key, value):
        # Ensure it's an integer and between 1-5
        if not isinstance(value, int):
             raise TypeError("Rating must be an integer")
        if not (1 <= value <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return value

    @validates('comment')
    def validate_comment(self, key, value):
        if value is None:
            return value
        if not isinstance(value, str):
             raise TypeError("Comment must be a string")
        value = value.strip()
        if len(value) > 500:
             raise ValueError("Comment cannot exceed 500 characters")
        return value