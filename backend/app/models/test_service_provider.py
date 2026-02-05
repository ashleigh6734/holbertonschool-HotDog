import unittest
from flask import Flask
from app.extensions import db
from app.models.user import User
from app.models.service_provider import ServiceProvider

class TestServiceProvider(unittest.TestCase):

    def setUp(self):
        """Set up a temporary database before each test runs"""
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)

        with self.app.app_context():
            db.create_all()
            # Create a dummy User first
            self.user = User(
                first_name="Ash",
                last_name="Leigh",
                email="ash@example.com",
                password_hash="fakehash123"
            )
            db.session.add(self.user)
            db.session.commit()
            self.user_id = self.user.id

    def tearDown(self):
        """Clean up"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_create_service_provider(self):
        """Test valid creation"""
        with self.app.app_context():
            # Re-query user to attach to this session
            user = User.query.get(self.user_id)
            
            provider = ServiceProvider(
                user_id=user.id,
                name="Ash's Doggy Daycare",
                service_type="Boarding",
                description="The best daycare in town",
                address="123 Puppy Lane",
                phone="0400123456",
                email="contact@ashdogs.com"
            )
            db.session.add(provider)
            db.session.commit()

            saved_provider = ServiceProvider.query.first()
            
            # 1. Check basic fields
            self.assertEqual(saved_provider.name, "Ash's Doggy Daycare")
            
            # 2. Check Relationship (If this fails, check 'owner' line in models file)
            # We access .owner to verify the relationship works
            self.assertIsNotNone(saved_provider.owner)
            self.assertEqual(saved_provider.owner.email, "ash@example.com")

    def test_validate_service_type(self):
        """Test that invalid service types raise ValueError"""
        with self.app.app_context():
            # We wrap the CREATION in the assertRaises block
            with self.assertRaises(ValueError):
                ServiceProvider(
                    user_id=self.user_id,
                    name="Bad Spa",
                    service_type="Underwater Basket Weaving" # Invalid
                )

    def test_validate_name_length(self):
        """Test that long names raise ValueError"""
        with self.app.app_context():
            long_name = "A" * 101
            # We wrap the CREATION in the assertRaises block
            with self.assertRaises(ValueError):
                ServiceProvider(
                    user_id=self.user_id,
                    name=long_name,
                    service_type="Grooming"
                )

if __name__ == '__main__':
    unittest.main()