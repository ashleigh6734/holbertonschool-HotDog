import unittest
from datetime import time, datetime, timedelta, timezone
from flask import Flask

from app.extensions import db
from app.models.pet import Pet, SpeciesEnum, DogBreedEnum, GenderEnum
from app.models.service_provider import ServiceProvider, ServiceType
from app.models.appointment import Appointment, AppointmentStatus


# -----------------------------------------
# Helper functions (create data to test)
# -----------------------------------------
def future_datetime(hours_from_now: int = 24):
    """Return a timezone-aware UTC datetime in the future."""
    return datetime.now(timezone.utc) + timedelta(hours=hours_from_now)

def naive_future_dt(hours_from_now: int = 24):
    """Return a naive datetime (NO timezone) in the future."""
    return datetime.utcnow() + timedelta(hours=hours_from_now)

def past_dt(hours_ago: int = 1):
    """Return a timezone-aware UTC datetime in the past."""
    return datetime.now(timezone.utc) - timedelta(hours=hours_ago)

def create_pet(owner_id=1):
    pet = Pet(
        owner_id=owner_id,
        name="Tiger",
        species=SpeciesEnum.dog,
        breed=DogBreedEnum.bulldog.value,
        gender=GenderEnum.male,
        desexed=True,
        date_of_birth=None,
        weight=None,
        medical_notes=None,
    )
    db.session.add(pet)
    db.session.commit()
    return pet

def create_provider(user_id=1):
    service_provider = ServiceProvider(
        user_id=user_id,
        name="Friendly Vet Clinic",
        service_type=ServiceType.VACCINATIONS,
        opening_time=time(9, 0),
        closing_time=time(17, 0),
        slot_duration=30,
        description=None,
        address=None,
        phone=None,
        email=None,
    )
    db.session.add(service_provider)
    db.session.commit()
    return service_provider


class TestAppointmentModel(unittest.TestCase):
    def setUp(self):
        """Set up a temporary in-memory db before each test."""
        self.app = Flask(__name__)
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

        # init the db with this test app
        db.init_app(self.app)

        # Push app context so db.session works
        self.context = self.app.app_context()
        self.context.push()

        db.create_all()

    def tearDown(self):
        """Clean up db after each test."""
        db.session.rollback()
        db.session.remove()
        db.drop_all()

        # Pop app context
        self.context.pop()

    # -----------------------------------------
    # Tests
    # -----------------------------------------
    def test_cant_book_in_the_past(self):
        pet = create_pet()
        provider = create_provider()

        with self.assertRaisesRegex(ValueError, "future"):
            appt = Appointment(
                pet_id=pet.id,
                provider_id=provider.id,
                date_time=past_dt(),
                status=AppointmentStatus.CONFIRMED,
            )
            db.session.add(appt)
            db.session.commit()

    def test_cant_book_without_timezone(self):
        pet = create_pet()
        provider = create_provider()

        with self.assertRaisesRegex(ValueError, r"(invalid|timezone)"):
            appt = Appointment(
                pet_id=pet.id,
                provider_id=provider.id,
                date_time=naive_future_dt(),
                status=AppointmentStatus.CONFIRMED,
            )
            db.session.add(appt)
            db.session.commit()

    def test_cant_double_book_same_provider_same_time(self):
        pet1 = create_pet(owner_id=1)
        pet2 = create_pet(owner_id=2)
        provider = create_provider()

        slot = future_datetime(24)

        appt1 = Appointment(
            pet_id=pet1.id,
            provider_id=provider.id,
            date_time=slot,
            status=AppointmentStatus.CONFIRMED,
        )
        db.session.add(appt1)
        db.session.commit()

        with self.assertRaisesRegex(ValueError, r"(not available|already booked)"):
            appt2 = Appointment(
                pet_id=pet2.id,
                provider_id=provider.id,
                date_time=slot,
                status=AppointmentStatus.CONFIRMED,
            )
            db.session.add(appt2)
            db.session.commit()

    def test_can_book_same_time_different_provider(self):
        pet = create_pet()
        provider1 = create_provider(user_id=1)
        provider2 = create_provider(user_id=2)

        slot = future_datetime(24)

        appt1 = Appointment(
            pet_id=pet.id,
            provider_id=provider1.id,
            date_time=slot,
            status=AppointmentStatus.CONFIRMED,
        )
        db.session.add(appt1)
        db.session.commit()

        appt2 = Appointment(
            pet_id=pet.id,
            provider_id=provider2.id,
            date_time=slot,
            status=AppointmentStatus.CONFIRMED,
        )
        db.session.add(appt2)
        db.session.commit()

        self.assertIsNotNone(appt1.id)
        self.assertIsNotNone(appt2.id)

    def test_can_cancel_appointment(self):
        pet = create_pet()
        provider = create_provider()
        slot = future_datetime(24)

        appt = Appointment(
            pet_id=pet.id,
            provider_id=provider.id,
            date_time=slot,
            status=AppointmentStatus.CONFIRMED,
        )
        db.session.add(appt)
        db.session.commit()

        appt.status = AppointmentStatus.CANCELLED
        db.session.commit()

        refreshed = db.session.get(Appointment, appt.id)
        self.assertEqual(refreshed.status, AppointmentStatus.CANCELLED)

    def test_cancelled_appt_does_not_block_new_appt(self):
        pet1 = create_pet(owner_id=1)
        pet2 = create_pet(owner_id=2)
        provider = create_provider()
        slot = future_datetime(24)

        appt1 = Appointment(
            pet_id=pet1.id,
            provider_id=provider.id,
            date_time=slot,
            status=AppointmentStatus.CONFIRMED,
        )
        db.session.add(appt1)
        db.session.commit()

        appt1.status = AppointmentStatus.CANCELLED
        db.session.commit()

        appt2 = Appointment(
            pet_id=pet2.id,
            provider_id=provider.id,
            date_time=slot,
            status=AppointmentStatus.CONFIRMED,
        )
        db.session.add(appt2)
        db.session.commit()

        self.assertIsNotNone(appt2.id)


if __name__ == "__main__":
    unittest.main()
