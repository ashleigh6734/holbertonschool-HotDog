from datetime import datetime, timezone
import enum
from app.extensions import db
from sqlalchemy.orm import validates

# get the current date and time
def utccurrent():
    return datetime.now(timezone.utc)

# =====================
# ENUM FOR STATUS
# =====================
class AppointmentStatus(enum.Enum):
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

# =====================
# APPOINTMENT MODEL
# =====================
class Appointment (db.model):
    __tablename__ = "appointments"
    
    id = db.Column(db.Integer, primary_key = True)
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey("service_providers.id"), nullable=False)  #todo (Dana): check service_provider table reference after its model is done
    date_time = db.Column(db.DateTime, nullable=False, index=True)
    status = db.Column(
        db.Enum(AppointmentStatus, name="appointment_status"),
        nullable=False,
        default=AppointmentStatus.CONFIRMED,
        index=True
    )
    
    notes = db.Column(db.Text)
    
    created_at = db.Column(
        db.DateTime,
        default=utccurrent,
        nullable=False,
    )

    # Email tracking
    confirmation_sent_at = db.Column(db.DateTime, nullable=True)
    reminder_24h_sent_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return (
            f"<Appointment id={self.id}"
            f"date_time={self.date_time}"
            f"status={self.status.value}>"
        )
    

    # =====================
    # VALIDATORS
    # =====================
    # Validation helpers
    def check_entity_exists(self, model_cls, entity_id, field_name):
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
    
    def check_double_booking(self):
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
        
    # Validation checks
    # Check 1: ensure appointment time is valid
    
    
    # =====================
    # RELATIONSHIPS
    # =====================
    
