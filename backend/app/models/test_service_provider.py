import unittest
from datetime import time
from flask import Flask
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet 
from app.models.appointment import Appointment
from app.models.review import Review
from app.models.service_provider import ServiceProvider, ServiceType

class TestServiceProvider(unittest.TestCase):

    def setUp(self):
        """Set up a temporary database before each test runs"""
        self.app = Flask(__name__)
        # Use in-memory SQLite database for speed and isolation
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' 
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)

        with self.app.app_context():
            db.create_all()
            # Create a dummy Owner (User) because Provider needs a user_id
            self.user = User(
                first_name="Ash",
                last_name="Leigh",
                email="ash@test.com",
                password_hash="fakehash"
            )
            db.session.add(self.user)
            db.session.commit()
            self.user_id = self.user.id

    def tearDown(self):
        """Clean up the database after each test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_create_provider_with_enum(self):
        """Test creating a provider using the new Enum list"""
        with self.app.app_context():
            provider = ServiceProvider(
                user_id=self.user_id,
                name="Ash's Vet Clinic",
                service_type=ServiceType.VET_CONSULTATIONS,
                description="Expert vet care"
            )
            db.session.add(provider)
            db.session.commit()

            # Verify it saved
            saved = ServiceProvider.query.first()
            self.assertEqual(saved.name, "Ash's Vet Clinic")
            # Check the Enum value is correct
            self.assertEqual(saved.service_type, ServiceType.VET_CONSULTATIONS)
            # Check the string value matches the Enum text
            self.assertEqual(saved.service_type.value, "Vet Consultations")

    def test_availability_defaults(self):
        """Test that opening times default to 9am-5pm if not provided"""
        with self.app.app_context():
            provider = ServiceProvider(
                user_id=self.user_id,
                name="Default Time Spa",
                service_type=ServiceType.DOG_WALKING
            )
            db.session.add(provider)
            db.session.commit()

            saved = ServiceProvider.query.first()
            # Default is 09:00:00
            self.assertEqual(saved.opening_time, time(9, 0))
            # Default is 17:00:00
            self.assertEqual(saved.closing_time, time(17, 0))
            # Default slot is 30 mins
            self.assertEqual(saved.slot_duration, 30)

    def test_availability_custom(self):
        """Test setting custom opening hours and slot duration"""
        with self.app.app_context():
            provider = ServiceProvider(
                user_id=self.user_id,
                name="Late Night Vets",
                service_type=ServiceType.DENTAL,
                opening_time=time(12, 0), # Opens at noon
                closing_time=time(22, 0), # Closes at 10pm
                slot_duration=60          # 1 hour slots
            )
            db.session.add(provider)
            db.session.commit()

            saved = ServiceProvider.query.first()
            self.assertEqual(saved.opening_time, time(12, 0))
            self.assertEqual(saved.closing_time, time(22, 0))
            self.assertEqual(saved.slot_duration, 60)

    def test_invalid_slot_duration(self):
        """Test validation for slot duration limits"""
        with self.app.app_context():
            # Too short (5 mins)
            with self.assertRaises(ValueError):
                ServiceProvider(
                    user_id=self.user_id,
                    name="Fast Spa",
                    service_type=ServiceType.NAIL_TRIMMING,
                    slot_duration=5 
                )
            
            # Too long (5 hours / 300 mins)
            with self.assertRaises(ValueError):
                ServiceProvider(
                    user_id=self.user_id,
                    name="Slow Spa",
                    service_type=ServiceType.NAIL_TRIMMING,
                    slot_duration=300 
                )

    def test_invalid_enum(self):
        """Test that we cannot pass a random string to the Enum column"""
        with self.app.app_context():
            with self.assertRaises(ValueError): 
                ServiceProvider(
                    user_id=self.user_id,
                    name="Bad Type Spa",
                    service_type="Underwater Basket Weaving"
                )

if __name__ == '__main__':
    unittest.main()