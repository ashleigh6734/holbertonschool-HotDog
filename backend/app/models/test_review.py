import unittest
from datetime import datetime, timedelta, timezone
from flask import Flask
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.user import User
from app.models.pet import Pet, SpeciesEnum, GenderEnum
from app.models.appointment import Appointment
from app.models.review import Review
from app.models.service_provider import ServiceProvider, ServiceType


class TestReviewModel(unittest.TestCase):

    def setUp(self):
        """Set up a temporary database before each test runs"""
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)

        with self.app.app_context():
            db.create_all()

            self.user = User(
                first_name="Taylor",
                last_name="Swift",
                email="taylor@example.com",
                password_hash="hashed"
            )
            db.session.add(self.user)
            db.session.commit()

            self.provider = ServiceProvider(
                user_id=self.user.id,
                name="Happy Paws",
                service_type=ServiceType.VET_CONSULTATIONS,
                description="Friendly vet care"
            )
            db.session.add(self.provider)
            db.session.commit()

            self.pet = Pet(
                owner_id=self.user.id,
                name="Buddy",
                species=SpeciesEnum.dog,
                breed="labrador",
                gender=GenderEnum.male,
                desexed=True
            )
            db.session.add(self.pet)
            db.session.commit()

            self.appointment = Appointment(
                pet_id=self.pet.id,
                provider_id=self.provider.id,
                date_time=datetime.now(timezone.utc) + timedelta(days=1)
            )
            db.session.add(self.appointment)
            db.session.commit()

    def tearDown(self):
        """Clean up the database after each test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_create_review_valid(self):
        """Test creating a valid review"""
        with self.app.app_context():
            review = Review(
                user_id=self.user.id,
                provider_id=self.provider.id,
                appointment_id=self.appointment.id,
                rating=5,
                comment="  Great service! "
            )
            db.session.add(review)
            db.session.commit()

            saved = Review.query.first()
            self.assertEqual(saved.rating, 5)
            self.assertEqual(saved.comment, "Great service!")
            self.assertEqual(saved.user_id, self.user.id)
            self.assertEqual(saved.provider_id, self.provider.id)
            self.assertEqual(saved.appointment_id, self.appointment.id)

    def test_rating_must_be_integer(self):
        """Test rating must be an integer"""
        with self.app.app_context():
            with self.assertRaises(TypeError):
                Review(
                    user_id=self.user.id,
                    provider_id=self.provider.id,
                    appointment_id=self.appointment.id,
                    rating="5"
                )

    def test_rating_out_of_range(self):
        """Test rating must be between 1 and 5"""
        with self.app.app_context():
            with self.assertRaises(ValueError):
                Review(
                    user_id=self.user.id,
                    provider_id=self.provider.id,
                    appointment_id=self.appointment.id,
                    rating=0
                )
            with self.assertRaises(ValueError):
                Review(
                    user_id=self.user.id,
                    provider_id=self.provider.id,
                    appointment_id=self.appointment.id,
                    rating=6
                )

    def test_comment_type_validation(self):
        """Test comment must be a string"""
        with self.app.app_context():
            with self.assertRaises(TypeError):
                Review(
                    user_id=self.user.id,
                    provider_id=self.provider.id,
                    appointment_id=self.appointment.id,
                    rating=4,
                    comment=123
                )

    def test_comment_length_validation(self):
        """Test comment length cannot exceed 500 characters"""
        with self.app.app_context():
            with self.assertRaises(ValueError):
                Review(
                    user_id=self.user.id,
                    provider_id=self.provider.id,
                    appointment_id=self.appointment.id,
                    rating=4,
                    comment="a" * 501
                )

    def test_unique_review_per_appointment(self):
        """Test a review cannot be created twice for the same appointment"""
        with self.app.app_context():
            first_review = Review(
                user_id=self.user.id,
                provider_id=self.provider.id,
                appointment_id=self.appointment.id,
                rating=5
            )
            db.session.add(first_review)
            db.session.commit()

            duplicate_review = Review(
                user_id=self.user.id,
                provider_id=self.provider.id,
                appointment_id=self.appointment.id,
                rating=4
            )
            db.session.add(duplicate_review)
            with self.assertRaises(IntegrityError):
                db.session.commit()
            db.session.rollback()


if __name__ == '__main__':
    unittest.main()