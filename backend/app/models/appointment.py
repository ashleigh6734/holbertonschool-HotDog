import uuid
import enum
from datetime import datetime, timezone
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
class Appointment (db.Model):
    __tablename__ = "appointments"
    
    id = db.Column(db.String(36), primary_key = True, default=lambda: str(uuid.uuid4()))
    pet_id = db.Column(db.String(36), db.ForeignKey("pets.id"), nullable=False)
    provider_id = db.Column(db.String(36), db.ForeignKey("service_providers.id"), nullable=False)
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

    # =====================
    # RELATIONSHIPS
    # =====================
    pet = db.relationship(
        "Pet",
        back_populates="appointments",
    )

    provider = db.relationship(
        "ServiceProvider",
        back_populates="appointments",
    )

    # =====================
    # VALIDATORS
    # =====================
    # Check 1: appointment time is valid
    @validates("date_time")
    def validate_date_time(self, _key, value):
        if value is None:
            raise ValueError("Appointment time can't be empty")
        
        if value.tzinfo is None or value.tzinfo.utcoffset(value) is None:
            raise ValueError("Appointment time must include timezone info")
        
        return value
    
    # Check 2: status is valid
    @validates("status")
    def validate_status(self, _key, value):
        if value is None:
            raise ValueError("Status can't be empty")
        
        # allow strings like "confirmed"
        if isinstance(value, str):
            try:
                value = AppointmentStatus[value.strip().upper()]
            except KeyError as exc:
                raise ValueError("Status is invalid") from exc
            
        if not isinstance(value, AppointmentStatus):
            raise ValueError("Status is invalid")
        return value
    
    def __repr__(self):
        return (
            f"Appointment ID ={self.id} "
            f"Date ={self.date_time} "
            f"Status ={self.status.value}>"
        )
