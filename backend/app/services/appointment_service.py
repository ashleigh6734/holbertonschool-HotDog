from datetime import datetime, timezone
from app.extensions import db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.pet import Pet
from app.models.service_provider import ServiceProvider


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
