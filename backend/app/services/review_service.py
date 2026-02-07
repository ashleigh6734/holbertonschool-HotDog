from app.extensions import db
from app.models.review import Review
from app.models.appointment import Appointment, AppointmentStatus
from app.models.pet import Pet

class ReviewService:
    @staticmethod
    def create_review(user_id, data):
        # 1. Get the Appointment
        appt_id = data.get("appointment_id")
        if not appt_id:
            raise ValueError("Appointment ID is required")
            
        appointment = db.session.get(Appointment, appt_id)
        if not appointment:
            raise ValueError("Appointment not found")

        # 2. VALIDATION: Check Ownership
        pet = db.session.get(Pet, appointment.pet_id)
        if not pet or pet.owner_id != user_id:
            raise PermissionError("You can only review your own appointments")

        # 3. VALIDATION: Check Status
        if appointment.status != AppointmentStatus.COMPLETED:
            raise ValueError("You can only review completed appointments")

        # 4. VALIDATION: Check Duplicate
        existing = Review.query.filter_by(appointment_id=appt_id).first()
        if existing:
            raise ValueError("You have already reviewed this appointment")

        # 5. Create Review
        review = Review(
            user_id=user_id,
            provider_id=appointment.provider_id,
            appointment_id=appointment.id,
            rating=int(data.get("rating")),
            comment=data.get("comment")
        )

        db.session.add(review)
        db.session.commit()
        return review

    @staticmethod
    def get_reviews_for_provider(provider_id):
        # Used for the Public Profile Page
        return Review.query.filter_by(provider_id=provider_id).all()