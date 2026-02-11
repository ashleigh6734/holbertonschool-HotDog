import unittest
from datetime import time
from flask import Flask
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet 
from app.models.appointment import Appointment
from app.models.review import Review
from app.models.service_provider import ServiceProvider, ServiceType, ProviderService

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

    def test_create_provider_with_services(self):
        """Test creating a provider and adding services to it"""
        with self.app.app_context():
            # 1. Create Provider
            provider = ServiceProvider(
                user_id=self.user_id,
                name="Ash's Vet Clinic",
                description="Expert vet care"
            )
            db.session.add(provider)
            db.session.flush() # Get ID

            # 2. Add a Service (Using the new table)
            service = ProviderService(
                provider_id=provider.id,
                service_type=ServiceType.VET_CONSULTATIONS
            )
            db.session.add(service)
            db.session.commit()

            # 3. Verify it saved
            saved = ServiceProvider.query.first()
            self.assertEqual(saved.name, "Ash's Vet Clinic")
            
            # 4. Check the relationship (It should be a LIST now)
            self.assertEqual(len(saved.services), 1)
            self.assertEqual(saved.services[0].service_type, ServiceType.VET_CONSULTATIONS)

    def test_availability_defaults(self):
        """Test that opening times default to 9am-5pm"""
        with self.app.app_context():
            provider = ServiceProvider(
                user_id=self.user_id,
                name="Default Time Spa"
            )
            db.session.add(provider)
            db.session.commit()

            saved = ServiceProvider.query.first()
            self.assertEqual(saved.opening_time, time(9, 0))
            self.assertEqual(saved.closing_time, time(17, 0))
            self.assertEqual(saved.slot_duration, 30)

    def test_availability_custom(self):
        """Test setting custom opening hours"""
        with self.app.app_context():
            provider = ServiceProvider(
                user_id=self.user_id,
                name="Late Night Vets",
                opening_time=time(12, 0),
                closing_time=time(22, 0),
                slot_duration=60
            )
            db.session.add(provider)
            db.session.commit()

            saved = ServiceProvider.query.first()
            self.assertEqual(saved.opening_time, time(12, 0))
            self.assertEqual(saved.slot_duration, 60)

    def test_invalid_slot_duration(self):
        """Test validation for slot duration limits"""
        with self.app.app_context():
            # Too short
            with self.assertRaises(ValueError):
                ServiceProvider(
                    user_id=self.user_id,
                    name="Fast Spa",
                    slot_duration=5 
                )
            
            # Too long
            with self.assertRaises(ValueError):
                ServiceProvider(
                    user_id=self.user_id,
                    name="Slow Spa",
                    slot_duration=300 
                )
            

    def test_invalid_enum(self):
        """Test that we cannot pass a random string to the ProviderService model"""
        with self.app.app_context():
            # Create a valid provider first
            provider = ServiceProvider(user_id=self.user_id, name="Test Spa")
            db.session.add(provider)
            db.session.flush()

            with self.assertRaises(ValueError): 
                ProviderService(
                    provider_id=provider.id,
                    service_type="Underwater Basket Weaving"
                )

if __name__ == '__main__':
    unittest.main()