from datetime import datetime, timezone
from app.extensions import db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.pet import Pet
from app.models.service_provider import ServiceProvider, ServiceType


def utccurrent():
    return datetime.now(timezone.utc)

class AppointmentService:
    @staticmethod
    def _check_entity_exists(model_cls, entity_id, field_name: str):
        """
        Check if an ID is provided and if that exists in our db
        
        model_cls: the model to check (Pet, ServiceProvider)
        entity_id: the ID provided (pet_id, provider_id)
        field_name: field name used for error messages
        """
        if entity_id is None:
            raise ValueError(f"{field_name} is required")
        
        record = db.session.get(model_cls, entity_id)
        if record is None:
            raise ValueError(f"{field_name} does not exist")
        return record

    @staticmethod
    def parse_iso_datetime(value: str) -> datetime:
        """
        Parse an ISO datetime string
        Support 'Z' suffix by converting to '+00:00'

        Return a datetime object
        """
        if not value or not isinstance(value, str):
            raise ValueError("date_time is required")

        iso = value.strip()
        if iso.endswith("Z"):
            iso = iso[:-1] + "+00:00"

        try:
            return datetime.fromisoformat(iso)
        except ValueError as exc:
            raise ValueError("Invalid date_time format. Must be ISO") from exc

    @staticmethod
    def _validate_date_time(date_time):
        """
        Check appointment must be in the future and timezone-aware
        """
        if date_time <= utccurrent():
            raise ValueError("Appointment time must be in the future")
        
    @staticmethod
    def _check_double_booking(provider_id, date_time, *, exclude_appointment_id=None):
        """
        Check two CONFIRMED appoinments for the same provider at the same time
        Exclude current appointment id on update to avoid self-conflict.
        """
        if not provider_id or not date_time:
            return

        conflicting_appointment_query = Appointment.query.filter(
            Appointment.provider_id == provider_id,
            Appointment.date_time == date_time,
            Appointment.status == AppointmentStatus.CONFIRMED,
        )

        if exclude_appointment_id is not None:
            conflicting_appointment_query = conflicting_appointment_query.filter(Appointment.id != exclude_appointment_id)

        if conflicting_appointment_query.first() is not None:
            raise ValueError("This time slot is no longer available. Please choose a different time.")

    @staticmethod
    def create_appointment(data: dict) -> Appointment:
        pet_id = data.get("pet_id")
        provider_id = data.get("provider_id")
        raw_datetime= data.get("date_time")
        notes= data.get("notes")
        service_type_str = data.get("service_type")
        # normalize enum input
        if hasattr(service_type_str, "value"):
            service_type_str = service_type_str.value

        if not service_type_str:
            raise ValueError("Service type is required")
        # Allow service to accept either datetime or iso string
        if isinstance(raw_datetime, str):
            date_time = AppointmentService.parse_iso_datetime(raw_datetime)
        else:
            date_time = raw_datetime

        # Existence checks
        AppointmentService._check_entity_exists(Pet, pet_id, "pet_id")
        provider = AppointmentService._check_entity_exists(ServiceProvider, provider_id, "provider_id")

        # Business checks
        AppointmentService._validate_date_time(date_time)
        AppointmentService._check_double_booking(provider_id, date_time)

        offered_services = [s.service_type.value for s in provider.services] if provider.services else []
        if offered_services and service_type_str not in offered_services:
            raise ValueError(f"Provider does not offer service: {service_type_str}")
         
        appointment = Appointment(
            pet_id=pet_id,
            provider_id=provider_id,
            date_time=date_time,
            notes=notes,
            status=AppointmentStatus.CONFIRMED,
            service_type=service_type_str
        )

        db.session.add(appointment)
        db.session.commit()
        return appointment
    
    @staticmethod
    def get_appointment_by_id(appointment_id: str) -> Appointment | None:
        return db.session.get(Appointment, appointment_id)

    @staticmethod
    def cancel_appointment(appointment_id: str) -> Appointment | None:
        appointment = db.session.get(Appointment, appointment_id)
        if not appointment:
            return None

        if appointment.status == AppointmentStatus.CANCELLED:
            raise ValueError("Appointment is already cancelled")

        appointment.status = AppointmentStatus.CANCELLED
        db.session.commit()
        return appointment
