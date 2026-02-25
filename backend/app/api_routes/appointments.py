from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify
from sqlalchemy import func
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.pet import Pet
from app.models.service_provider import ServiceProvider
from app.services.appointment_service import AppointmentService
from app.services.user_service import UserService

appointments_bp = Blueprint("appointments", __name__, url_prefix="/api/appointments")

# -------------------------
# Helpers
# -------------------------
# convert appointment objs into JSON-safe dict
def appointment_to_dict(appt: Appointment) -> dict:
    return {
        "id": appt.id,
        "pet_id": appt.pet_id,
        "provider_id": appt.provider_id,
        "date_time": appt.date_time.isoformat() if appt.date_time else None,
        "status": appt.status.value if appt.status else None,
        "service_type": appt.service_type.value if appt.service_type else None,
        "notes": appt.notes,
        "created_at": appt.created_at.isoformat() if appt.created_at else None,
        "confirmation_sent_at": appt.confirmation_sent_at.isoformat() if appt.confirmation_sent_at else None,
        "reminder_24h_sent_at": appt.reminder_24h_sent_at.isoformat() if appt.reminder_24h_sent_at else None,
        # Add fields needed for front-end ManageAppointments page
        "pet_name": appt.pet.name if appt.pet else None,
        "provider_name": appt.service_provider.name if appt.service_provider else None,
        "provider_address": appt.service_provider.address if appt.service_provider else None,
    }

# standardise error message across routes
def error_response(message: str, status_code: int = 400, extra=None):
    payload = {"error": message}
    if extra:
        payload.update(extra)
    return jsonify(payload), status_code


def _get_current_provider():
    user_id = get_jwt_identity()
    user = UserService.get_user_by_id(user_id)

    if not user:
        return None, error_response("User not found", 404)
    if user.role != "provider":
        return None, error_response("Forbidden: provider role required", 403)

    provider = ServiceProvider.query.filter_by(user_id=user_id).first()
    if not provider:
        return None, error_response("Provider profile not found", 404)

    return provider, None


# -------------------------
# Routes
# -------------------------
@appointments_bp.route("/", methods=["POST"])
def create_appointment():
    """
    Create an appointment
    Input: { pet_id, provider_id, date_time, notes? }
    Output: booking confirmation
    """
    data = request.get_json(silent=True) or {}

    # quick check for required fields
    required_fields = ["pet_id", "provider_id", "date_time", "service_type"]
    missing = [f for f in required_fields if data.get(f) in (None, "")]
    if missing:
        return error_response("Missing required fields", 400, {"missing": missing})

    try:
        # parse ISO str (note: frontend guarantee sending UTC times)
        appointment_time = datetime.fromisoformat(data["date_time"])

        appt = Appointment(
            pet_id=data["pet_id"],
            provider_id=data["provider_id"],
            date_time=appointment_time,
            service_type=data["service_type"],
            notes=data.get("notes"),
            # status defaults to PENDING in model and becomes CONFIRMED once confirmation email is sent
        )

        db.session.add(appt)
        db.session.commit()

    except ValueError as exc:
        db.session.rollback()
        return error_response(str(exc), 400)
    except Exception:
        db.session.rollback()
        return error_response("Internal server error", 500)

    return jsonify({
        "message": "Appointment confirmed",
        "booking": appointment_to_dict(appt)
    }), 201


@appointments_bp.route("/list", methods=["GET"])
def list_appointments():
    """
    Get a list of appointments
    query params: date
    Filter by date or service type (note: frontend send UTC formatted date to backend)
    """
    q_date = request.args.get("date")
    q_service = request.args.get("service")

    query = Appointment.query

    # filter by UTC dates
    if q_date:
        try:
            day = datetime.strptime(q_date, "%Y-%m-%d").date()
        except ValueError:
            return error_response("Invalid date format. Use YYYY-MM-DD.", 400)

        start = datetime(day.year, day.month, day.day, tzinfo=timezone.utc)
        end = start + timedelta(days=1)

        query = query.filter(Appointment.date_time >= start, Appointment.date_time < end)

    # filter by service type (JOIN)
    if q_service:
        service = q_service.strip().lower()
        query = query.filter(func.lower(Appointment.service_type) == service)
        
    # sort appointments by asc
    appointments = query.order_by(Appointment.date_time.asc()).all()
    
    return jsonify({
        "count": len(appointments),
        "appointments": [appointment_to_dict(a) for a in appointments]
    }), 200


@appointments_bp.route("/<string:appointment_id>", methods=["GET"])
def get_appointment(appointment_id: str):
    """
    Get a single appointment by ID
    """
    appointment = db.session.get(Appointment, appointment_id)
    if not appointment:
        return error_response("Appointment not found", 404)

    return jsonify({"appointment": appointment_to_dict(appointment)}), 200

@appointments_bp.route("/<string:appointment_id>/confirm", methods=["PATCH"])
def confirm_booking(appointment_id: str):
    """
    Confirm appointment by ID and send confirmation email once
    """
    try:
        appointment = AppointmentService.confirm_appointment(appointment_id)
        if appointment is None:
            return jsonify({"error": "Appointment not found"}), 404
        return jsonify({
            "message": "Appointment confirmed",
            "appointment": appointment_to_dict(appointment)
            }), 200
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return error_response(f"Internal server error: {e}", 500)

@appointments_bp.route("/<string:appointment_id>/cancel", methods=["DELETE"])
def cancel_appointment(appointment_id: str):
    """
    Cancel an appointment by ID
    """
    appointment = db.session.get(Appointment, appointment_id)
    if not appointment:
        return error_response("Appointment not found", 404)

    # block cancelling twice
    if appointment.status == AppointmentStatus.CANCELLED:
        return error_response("Appointment is already cancelled", 400)

    try:
        appointment.status = AppointmentStatus.CANCELLED
        db.session.commit()
    except ValueError as exc:
        db.session.rollback()
        return error_response(str(exc), 400)
    except Exception:
        db.session.rollback()
        return error_response("Internal server error", 500)

    return jsonify({
        "message": "Appointment cancelled",
        "appointment": appointment_to_dict(appointment)
    }), 200


# =====================
#  Get all appointments for ManageAppointments page
@appointments_bp.route("/user/me", methods=["GET"])
@jwt_required()
def get_user_appointments():
    """Get all appointments for the logged-in user"""
    from app.services.user_service import UserService
    
    user_id = get_jwt_identity()
    user = UserService.get_user_by_id(user_id)
    
    if not user:
        return error_response("User not found", 404)
    
    # Get all appointments for user's pets (excluding CANCELLED)
    user_pets = Pet.query.filter_by(owner_id=user_id).all()
    
    appointments = []
    for pet in user_pets:
        pet_appointments = Appointment.query.filter_by(pet_id=pet.id).filter(
            Appointment.status != AppointmentStatus.CANCELLED
        ).order_by(Appointment.date_time.asc()).all()
        appointments.extend(pet_appointments)
    
    return jsonify({
        "count": len(appointments),
        "appointments": [appointment_to_dict(a) for a in appointments]
    }), 200


@appointments_bp.route("/provider/me", methods=["GET"])
@jwt_required()
def get_provider_appointments():
    """Get all appointments for the logged-in provider"""
    provider, err = _get_current_provider()
    if err:
        return err

    q_date = request.args.get("date")
    q_status = request.args.get("status")

    query = Appointment.query.filter_by(provider_id=provider.id)

    if q_date:
        try:
            day = datetime.strptime(q_date, "%Y-%m-%d").date()
        except ValueError:
            return error_response("Invalid date format. Use YYYY-MM-DD.", 400)

        start = datetime(day.year, day.month, day.day, tzinfo=timezone.utc)
        end = start + timedelta(days=1)
        query = query.filter(Appointment.date_time >= start, Appointment.date_time < end)

    if q_status:
        try:
            status_enum = AppointmentStatus[q_status.strip().upper()]
            query = query.filter(Appointment.status == status_enum)
        except KeyError:
            return error_response("Invalid status", 400)

    appointments = query.order_by(Appointment.date_time.asc()).all()

    return jsonify({
        "count": len(appointments),
        "appointments": [appointment_to_dict(a) for a in appointments]
    }), 200


@appointments_bp.route("/provider/me", methods=["POST"])
@jwt_required()
def create_provider_appointment():
    """Create an appointment scoped to the logged-in provider"""
    provider, err = _get_current_provider()
    if err:
        return err

    data = request.get_json(silent=True) or {}
    required_fields = ["pet_id", "date_time", "service_type"]
    missing = [f for f in required_fields if data.get(f) in (None, "")]
    if missing:
        return error_response("Missing required fields", 400, {"missing": missing})

    payload = {
        "pet_id": data["pet_id"],
        "provider_id": provider.id,
        "date_time": data["date_time"],
        "service_type": data["service_type"],
        "notes": data.get("notes"),
    }

    try:
        appt = AppointmentService.create_appointment(payload)
        return jsonify({
            "message": "Appointment created",
            "booking": appointment_to_dict(appt)
        }), 201
    except ValueError as exc:
        return error_response(str(exc), 400)
    except Exception:
        return error_response("Internal server error", 500)
