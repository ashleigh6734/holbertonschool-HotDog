from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.provider_service import ServiceProviderService

providers_bp = Blueprint('providers', __name__, url_prefix='/api/providers')

# =====================
# CREATE PROVIDER
# =====================
@providers_bp.route("/", methods=["POST"])
@jwt_required()
def create_provider():
    user_id = get_jwt_identity() # The logged-in user becomes the owner
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        provider = ServiceProviderService.create_provider(user_id, data)
        return jsonify({
            "id": provider.id,
            "name": provider.name,
            "services": [s.service_type.value for s in provider.services],
            "message": "Provider profile created successfully!"
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# =====================
# GET ALL PROVIDERS (SEARCH)
# =====================
@providers_bp.route("/", methods=["GET"])
def get_providers():
    # Capture query params: /api/providers?service_type=Dog Walking
    filters = {
        "service_type": request.args.get("service_type"),
        "name": request.args.get("name")
    }
    
    providers = ServiceProviderService.get_all_providers(filters)

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "services": [s.service_type.value for s in p.services],
            "address": p.address,
            "opening_time": p.opening_time.strftime("%H:%M"),
            "closing_time": p.closing_time.strftime("%H:%M"),
            "slot_duration": p.slot_duration
        }
        for p in providers
    ]), 200


# =====================
# GET SINGLE PROVIDER
# =====================
@providers_bp.route("/<string:provider_id>", methods=["GET"])
def get_provider(provider_id):
    # Public route - View Profile Page
    provider = ServiceProviderService.get_provider_by_id(provider_id)

    if not provider:
        return jsonify({"error": "Provider not found"}), 404

    return jsonify({
        "id": provider.id,
        "name": provider.name,
        "services": [s.service_type.value for s in provider.services],
        "description": provider.description,
        "address": provider.address,
        "phone": provider.phone,
        "email": provider.email,
        "opening_time": provider.opening_time.strftime("%H:%M"),
        "closing_time": provider.closing_time.strftime("%H:%M"),
        "slot_duration": provider.slot_duration,
        "owner_id": provider.user_id
    }), 200


# =====================
# UPDATE PROVIDER
# =====================
@providers_bp.route("/<string:provider_id>", methods=["PATCH"])
@jwt_required()
def update_provider(provider_id):
    current_user_id = get_jwt_identity()
    provider = ServiceProviderService.get_provider_by_id(provider_id)

    if not provider:
        return jsonify({"error": "Provider not found"}), 404

    # Strict Check: Only the OWNER can edit their page
    if provider.user_id != current_user_id:
        return jsonify({"error": "Unauthorised"}), 403

    data = request.get_json()
    
    try:
        updated = ServiceProviderService.update_provider(provider, data)
        return jsonify({"message": "Provider updated successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400