import unittest
from datetime import date, timedelta
from flask import Flask
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet, SpeciesEnum, GenderEnum


class TestPetModel(unittest.TestCase):

    def setUp(self):
        """Set up a temporary database before each test runs"""
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)

        with self.app.app_context():
            db.create_all()

            # Create dummy user (owner)
            self.user = User(
                first_name="Jane",
                last_name="Doe",
                email="jane@test.com",
                password_hash="fakehash"
            )
            db.session.add(self.user)
            db.session.commit()
            self.user_id = self.user.id

    def tearDown(self):
        """Clean database after each test"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_create_valid_pet(self):
        """Test creating a valid pet"""
        with self.app.app_context():
            pet = Pet(
                owner_id=self.user_id,
                name="Buddy",
                species=SpeciesEnum.dog,
                breed="labrador",
                gender=GenderEnum.male,
                desexed=True,
                date_of_birth=date(2020, 1, 1),
                weight=25.5,
                notes="Healthy dog"
            )

            db.session.add(pet)
            db.session.commit()

            saved = Pet.query.first()
            self.assertEqual(saved.name, "Buddy")
            self.assertEqual(saved.breed, "labrador")
            self.assertEqual(saved.gender, GenderEnum.male)

    def test_future_dob_raises_error(self):
        """DOB cannot be in the future"""
        with self.app.app_context():
            future_date = date.today() + timedelta(days=1)

            with self.assertRaises(ValueError):
                Pet(
                    owner_id=self.user_id,
                    name="FutureDog",
                    species=SpeciesEnum.dog,
                    breed="labrador",
                    gender=GenderEnum.male,
                    desexed=True,
                    date_of_birth=future_date
                )

    def test_invalid_weight_raises_error(self):
        """Weight must be greater than 0"""
        with self.app.app_context():
            with self.assertRaises(ValueError):
                Pet(
                    owner_id=self.user_id,
                    name="Tiny",
                    species=SpeciesEnum.cat,
                    breed="siamese",
                    gender=GenderEnum.female,
                    desexed=False,
                    weight=0
                )

    def test_notes_too_long_raises_error(self):
        """Notes cannot exceed 500 characters"""
        with self.app.app_context():
            with self.assertRaises(ValueError):
                Pet(
                    owner_id=self.user_id,
                    name="LongNotePet",
                    species=SpeciesEnum.dog,
                    breed="bulldog",
                    gender=GenderEnum.male,
                    desexed=True,
                    notes="A" * 501
                )

    def test_breed_must_be_string(self):
        """Breed must be a string"""
        with self.app.app_context():
            with self.assertRaises(TypeError):
                Pet(
                    owner_id=self.user_id,
                    name="WrongBreed",
                    species=SpeciesEnum.dog,
                    breed=123,
                    gender=GenderEnum.male,
                    desexed=True
                )


if __name__ == "__main__":
    unittest.main()
