from datetime import datetime, timezone
from app import db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.pet import Pet
from app.models.service_provider import ServiceProvider


def utccurrent():
    return datetime.now(timezone.utc)

class AppointmentService:
    @staticmethod
    def _get_or_404(model_cls, entity_id, field_name: str):
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
        return entity_id
    
    def _check_double_booking(self):
    """
    Check two CONFIRMED appoinments for the same provider at the same time
    """
    if not self.provider_id or not self.date_time:
        return
    if self.status != AppointmentStatus.CONFIRMED:
        return
    
    conflicting_appointment_query = Appointment.query.filter(
        Appointment.provider_id == self.provider_id,
        Appointment.date_time == self.date_time,
        Appointment.status == AppointmentStatus.CONFIRMED,
    )
    if conflicting_appointment_query.first() is not None:
        raise ValueError("This time slot is no longer available. Please choose a different time.")
    