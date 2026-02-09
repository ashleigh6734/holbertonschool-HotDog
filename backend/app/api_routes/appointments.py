from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.appointment import Appointment, AppointmentStatus

appointments_bp = Blueprint("appointments", __name__, url_prefix='api/appointments/')

# -------------------------
# Helpers
# -------------------------

def parse_iso_utc_datetime(value: str) -> datetime:
    """
    Accept ISO datetime string and return tz-aware UTC datetime.
    Examples accepted:
      - "2026-02-10T09:30:00+00:00"
      - "2026-02-10T09:30:00Z"
    """
    if not value or not isinstance(value, str):
        raise ValueError("date_time is required")

    v = value.strip()
    if v.endswith("Z"):
        v = v[:-1] + "+00:00"

    dt = datetime.fromisoformat(v)  # can raise ValueError
    if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
        raise ValueError("Appointment time is invalid")  # aligns with your validator wording

    # Normalize to UTC (your model expects tz-aware; validator compares to utccurrent())
    return dt.astimezone(timezone.utc)


def appointment_to_dict(appt: Appointment) -> dict:
    return {
        "id": appt.id,
        "pet_id": appt.pet_id,
        "provider_id": appt.provider_id,
        "date_time": appt.date_time.isoformat() if appt.date_time else None,
        "status": appt.status.value if appt.status else None,
        "notes": appt.notes,
        "created_at": appt.created_at.isoformat() if appt.created_at else None,
        "confirmation_sent_at": appt.confirmation_sent_at.isoformat() if appt.confirmation_sent_at else None,
        "reminder_24h_sent_at": appt.reminder_24h_sent_at.isoformat() if appt.reminder_24h_sent_at else None,
    }


def error_response(message: str, status_code: int = 400, extra: dict | None = None):
    payload = {"error": message}
    if extra:
        payload.update(extra)
    return jsonify(payload), status_code


# -------------------------
# Routes (match your table)
# -------------------------

@appointments_bp.route("/bookings", methods=["POST"])
def create_booking():
    """
    POST /bookings
    Input: { pet_id, provider_id, date_time, notes? }
    Output: booking confirmation
    """
    data = request.get_json(silent=True) or {}

    # quick presence check to give nice "missing fields" errors
    required = ["pet_id", "provider_id", "date_time"]
    missing = [k for k in required if data.get(k) in (None, "")]
    if missing:
        return error_response("Missing required fields", 400, {"missing": missing})

    try:
        dt_utc = parse_iso_utc_datetime(data["date_time"])

        appt = Appointment(
            pet_id=data["pet_id"],              # your validators will check exists
            provider_id=data["provider_id"],    # your validators will check exists + double booking
            date_time=dt_utc,                   # your validator checks tz-aware + future
            notes=data.get("notes"),
            # status defaults to CONFIRMED in model
        )

        db.session.add(appt)
        db.session.commit()

    except ValueError as e:
        db.session.rollback()
        return error_response(str(e), 400)
    except Exception:
        db.session.rollback()
        return error_response("Internal server error", 500)

    return jsonify({
        "message": "Booking confirmed",
        "booking": appointment_to_dict(appt)
    }), 201


@appointments_bp.route("/bookings/list", methods=["GET"])
def list_bookings():
    """
    GET /bookings/list
    query params (per your table): date, service

    Your model does NOT have a 'service' field.
    - We'll filter by date (day window in UTC).
    - If 'service' is provided, we return 400 explaining it's unsupported for now.
      (Or you can later join via provider/services relationship.)
    """
    q_date = request.args.get("date")       # expected "YYYY-MM-DD"
    q_service = request.args.get("service") # not supported with current model

    if q_service:
        return error_response(
            "Filtering by 'service' is not supported yet because Appointment has no service field. "
            "Use provider_id for now or implement a join via ServiceProvider/services.",
            400
        )

    query = Appointment.query

    if q_date:
        try:
            day = datetime.strptime(q_date.strip(), "%Y-%m-%d").date()
        except ValueError:
            return error_response("Invalid date format. Use YYYY-MM-DD.", 400)

        # Filter by UTC day window: [00:00, next day 00:00)
        start = datetime(day.year, day.month, day.day, tzinfo=timezone.utc)
        end = start.replace() + (datetime(day.year, day.month, day.day, tzinfo=timezone.utc) - start)
        # The line above is a no-op in some envs; do it safely:
        end = start + (datetime(day.year, day.month, day.day, tzinfo=timezone.utc) - start)
        # Better: just use timedelta
        from datetime import timedelta
        end = start + timedelta(days=1)

        query = query.filter(Appointment.date_time >= start, Appointment.date_time < end)

    # Optional: exclude cancelled by default (common for "list bookings")
    query = query.filter(Appointment.status != AppointmentStatus.CANCELLED)

    appts = query.order_by(Appointment.date_time.asc()).all()

    return jsonify({
        "count": len(appts),
        "bookings": [appointment_to_dict(a) for a in appts]
    }), 200


@appointments_bp.route("/bookings/<int:booking_id>", methods=["GET"])
def get_booking(booking_id: int):
    """
    GET /bookings/<booking_id>
    Output: booking details
    """
    appt = db.session.get(Appointment, booking_id)
    if not appt:
        return error_response("Booking not found", 404)

    return jsonify({"booking": appointment_to_dict(appt)}), 200


@appointments_bp.route("/bookings/<int:booking_id>/cancel", methods=["DELETE"])
def cancel_booking(booking_id: int):
    """
    DELETE /bookings/<booking_id>/cancel
    Output: cancel booking (soft cancel)
    """
    appt = db.session.get(Appointment, booking_id)
    if not appt:
        return error_response("Booking not found", 404)

    # idempotent cancel
    if appt.status == AppointmentStatus.CANCELLED:
        return jsonify({
            "message": "Booking already cancelled",
            "booking": appointment_to_dict(appt)
        }), 200

    try:
        appt.status = AppointmentStatus.CANCELLED
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return error_response(str(e), 400)
    except Exception:
        db.session.rollback()
        return error_response("Internal server error", 500)

    return jsonify({
        "message": "Booking cancelled",
        "booking": appointment_to_dict(appt)
    }), 200
