import unittest
import uuid
from datetime import time, datetime, timedelta, timezone
from flask import Flask
from app.extensions import db
from app.models.user import User
from app.models.pet import Pet, SpeciesEnum, DogBreedEnum, GenderEnum
from app.models.service_provider import ServiceProvider, ServiceType, ProviderService
from app.models.appointment import Appointment, AppointmentStatus
from app.services.appointment_service import AppointmentService


# -----------------------------------------
# Helper functions (create data to test)
# -----------------------------------------
def future_datetime(hours_from_now: int = 24):
    """Return a timezone-aware UTC datetime in the future."""
    return datetime.now(timezone.utc) + timedelta(hours=hours_from_now)

def naive_future_dt(hours_from_now: int = 24):
    """Return a naive datetime (NO timezone) in the future."""
    return datetime.now() + timedelta(hours=hours_from_now)

def past_dt(hours_ago: int = 1):
    """Return a timezone-aware UTC datetime in the past."""
    return datetime.now(timezone.utc) - timedelta(hours=hours_ago)

def create_user():
    """Create a User with a unique email"""
    user = User(
        first_name="No",
        last_name="Name",
        email=f"noname_{uuid.uuid4()}@example.com",
    )
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()
    return user

def create_pet(owner_id: str): # str due to uuid set up
    pet = Pet(
        owner_id=owner_id,
        name="Tiger",
        species=SpeciesEnum.dog,
        breed=DogBreedEnum.bulldog.value,  # .value here as Pet model expects breed to be str
        gender=GenderEnum.male,
        desexed=True,
        date_of_birth=None,
        weight=None,
        notes=None,
    )
    db.session.add(pet)
    db.session.commit()
    return pet

def create_provider(user_id: str, service_type: ServiceType = ServiceType.VACCINATIONS):
    service_provider = ServiceProvider(
        user_id=user_id,  # required here as ServiceProvider has FK to User model
        name="Friendly Vet Clinic",
        opening_time=time(9, 0),
        closing_time=time(17, 0),
        slot_duration=30,
        description=None,
        address=None,
        phone=None,
        email=None,
    )
    db.session.add(service_provider)
    db.session.flush()

    # attach at least one offered service to the provider
    svc = ProviderService(provider_id=service_provider.id, service_type=service_type)
    db.session.add(svc)
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
        db.engine.dispose()
        # Pop app context
        self.context.pop()

    # -----------------------------------------
    # Tests
    # -----------------------------------------
    def test_cant_book_in_the_past(self):
        owner = create_user()
        pet = create_pet(owner_id=owner.id)
        provider_owner = create_user()
        provider = create_provider(user_id=provider_owner.id)

        with self.assertRaisesRegex(ValueError, "future"):
            AppointmentService.create_appointment({
                "pet_id": pet.id,
                "provider_id": provider.id,
                "date_time": past_dt(),
                "service_type": ServiceType.VACCINATIONS.value,
            })

    def test_cant_book_without_timezone(self):
        owner = create_user()
        pet = create_pet(owner_id=owner.id)
        provider_owner = create_user()
        provider = create_provider(user_id=provider_owner.id)

        with self.assertRaisesRegex(ValueError, r"(timezone|include timezone)"):
            appt = Appointment(
                pet_id=pet.id,
                provider_id=provider.id,
                date_time=naive_future_dt(),        # validation check should reject
                status=AppointmentStatus.CONFIRMED,
                service_type=ServiceType.VACCINATIONS,
            )
            db.session.add(appt)
            db.session.commit()

    def test_cant_double_book_same_provider_same_time(self):
        owner1 = create_user()
        owner2 = create_user()
        pet1 = create_pet(owner_id=owner1.id)
        pet2 = create_pet(owner_id=owner2.id)
        provider_owner = create_user()
        provider = create_provider(user_id=provider_owner.id)

        slot = future_datetime(24)

        AppointmentService.create_appointment({
            "pet_id": pet1.id,
            "provider_id": provider.id,
            "date_time": slot,
            "service_type": ServiceType.VACCINATIONS.value,
        })

        with self.assertRaisesRegex(ValueError, r"(no longer available|not available|already booked|time slot)"):
            AppointmentService.create_appointment({
                "pet_id": pet2.id,
                "provider_id": provider.id,
                "date_time": slot,
                "service_type": ServiceType.VACCINATIONS.value,
            })

    def test_can_book_same_time_different_provider(self):
        owner = create_user()
        pet = create_pet(owner_id=owner.id)

        provider_owner1 = create_user()
        provider_owner2 = create_user()
        provider1 = create_provider(user_id=provider_owner1.id)
        provider2 = create_provider(user_id=provider_owner2.id)

        slot = future_datetime(24)

        appt1 = AppointmentService.create_appointment({
            "pet_id": pet.id,
            "provider_id": provider1.id,
            "date_time": slot,
            "service_type": ServiceType.VACCINATIONS.value,
        })

        appt2 = AppointmentService.create_appointment({
            "pet_id": pet.id,
            "provider_id": provider2.id,
            "date_time": slot,
            "service_type": ServiceType.VACCINATIONS.value,
        })

        self.assertIsNotNone(appt1.id)
        self.assertIsNotNone(appt2.id)

    def test_can_cancel_appointment(self):
        owner = create_user()
        pet = create_pet(owner_id=owner.id)
        
        provider_owner = create_user()
        provider = create_provider(user_id=provider_owner.id)

        slot = future_datetime(24)

        appt = AppointmentService.create_appointment({
            "pet_id": pet.id,
            "provider_id": provider.id,
            "date_time": slot,
            "service_type": ServiceType.VACCINATIONS.value,
        })

        cancelled = AppointmentService.cancel_appointment(appt.id)
        self.assertIsNotNone(cancelled)
        self.assertEqual(cancelled.status, AppointmentStatus.CANCELLED)

    def test_cancelled_appt_does_not_block_new_appt(self):
        owner1 = create_user()
        owner2 = create_user()
        pet1 = create_pet(owner_id=owner1.id)
        pet2 = create_pet(owner_id=owner2.id)

        provider_owner = create_user()
        provider = create_provider(user_id=provider_owner.id)

        slot = future_datetime(24)

        appt1 = AppointmentService.create_appointment({
            "pet_id": pet1.id,
            "provider_id": provider.id,
            "date_time": slot,
            "service_type": ServiceType.VACCINATIONS.value,
        })

        AppointmentService.cancel_appointment(appt1.id)

        appt2 = AppointmentService.create_appointment({
            "pet_id": pet2.id,
            "provider_id": provider.id,
            "date_time": slot,
            "service_type": ServiceType.VACCINATIONS.value,
        })

        self.assertIsNotNone(appt2.id)

if __name__ == "__main__":
    unittest.main()
