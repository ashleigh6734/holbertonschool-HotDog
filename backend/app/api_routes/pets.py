from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.pet_service import PetService
from app.services.user_service import UserService
from app.extensions import db

pets_bp = Blueprint("pets", __name__, url_prefix="/api/pets")


def format_text(value):
    """Ensure first letter uppercase, rest lowercase."""
    if not value:
        return None
    return value.strip().capitalize()


# =====================
# CREATE PET
# =====================
@pets_bp.route("/", methods=["POST"])
@jwt_required()
def create_pet():
    owner_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        pet = PetService.create_pet(owner_id, data)
        return jsonify({
            "id": pet.id,
            "name": format_text(pet.name),
            "species": format_text(pet.species.value),
            "breed": format_text(pet.breed),
            "gender": format_text(pet.gender.value),
            "desexed": pet.desexed,
            "date_of_birth": pet.date_of_birth.isoformat() if pet.date_of_birth else None,
            "weight": pet.weight,
            "notes": pet.notes,
            "age": pet.age_display
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# =====================
# GET ALL PETS FOR USER
# =====================
@pets_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_pets():
    owner_id = get_jwt_identity()
    pets = PetService.get_pets_for_user(owner_id)

    return jsonify([
        {
            "id": pet.id,
            "name": format_text(pet.name),
            "species": format_text(pet.species.value),
            "breed": format_text(pet.breed),
            "gender": format_text(pet.gender.value),
            "desexed": pet.desexed,
            "date_of_birth": pet.date_of_birth.isoformat() if pet.date_of_birth else None,
            "weight": pet.weight,
            "notes": pet.notes,
            "age": pet.age_display
        }
        for pet in pets
    ]), 200


# =====================
# GET SINGLE PET
# =====================
@pets_bp.route("/<pet_id>", methods=["GET"])
@jwt_required()
def get_pet(pet_id):
    owner_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")
    pet = PetService.get_pet_by_id(pet_id)
    
    # allow: pet owner & providers to access pets
    if pet.owner_id != owner_id and role != "provider":
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({
        "id": pet.id,
        "name": format_text(pet.name),
        "species": format_text(pet.species.value),
        "breed": format_text(pet.breed),
        "gender": format_text(pet.gender.value),
        "desexed": pet.desexed,
        "date_of_birth": pet.date_of_birth.isoformat() if pet.date_of_birth else None,
        "weight": pet.weight,
        "notes": pet.notes,
        "age": pet.age_display
    }), 200


# =====================
# UPDATE PET
# =====================
@pets_bp.route("/<pet_id>", methods=["PATCH"])
@jwt_required()
def update_pet(pet_id):
    owner_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")
    pet = PetService.get_pet_by_id(pet_id)

    # Allow: pet owner & providers to edit pets
    if pet.owner_id != owner_id and role != "provider":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    try:
        PetService.update_pet(pet, data)
        return jsonify({"message": "Pet successfully updated"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# =====================
# DELETE PET
# =====================
@pets_bp.route("/<pet_id>", methods=["DELETE"])
@jwt_required()
def delete_pet(pet_id):
    owner_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")
    pet = PetService.get_pet_by_id(pet_id)

    # Allow: pet owner & providers to delete pets
    if pet.owner_id != owner_id and role != "provider":
        return jsonify({"error": "Unauthorized"}), 403

    PetService.delete_pet(pet)
    return jsonify({"message": "Pet successfully deleted"}), 200


@pets_bp.route("/provider/search", methods=["GET"])
@jwt_required()
def provider_search_owner_pets():
    user_id = get_jwt_identity()
    user = UserService.get_user_by_id(user_id)

    if not user or user.role != "provider":
        return jsonify({"Provider role required"}), 403

    email = request.args.get("email")
    phone = request.args.get("phone")

    try:
        owner, pets = PetService.search_owner_and_pets(email=email, phone=phone)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    return jsonify({
        "owner": {
            "id": owner.id,
            "first_name": owner.first_name,
            "last_name": owner.last_name,
            "email": owner.email,
            "phone_number": owner.phone_number,
        },
        "pets": [
            {
                "id": pet.id,
                "name": format_text(pet.name),
                "species": format_text(pet.species.value),
                "breed": format_text(pet.breed),
            }
            for pet in pets
        ],
    }), 200


@pets_bp.route("/provider/intake", methods=["POST"])
@jwt_required()
def provider_create_customer_and_pet():
    """
    Provider only route to create a new customer user and one pet in a single transaction (for phone and walk in bookings)
    """
    user_id = get_jwt_identity()
    user = UserService.get_user_by_id(user_id)

    if not user or user.role != "provider":
        return jsonify({"Provider role is required"}), 403

    data = request.get_json(silent=True) or {}
    owner_data = data.get("owner") or {}
    pet_data = data.get("pet") or {}

    owner_required = ["first_name", "last_name", "email"]
    pet_required = ["name", "species", "breed", "gender", "desexed"]

    missing_owner = [f for f in owner_required if owner_data.get(f) in (None, "")]
    missing_pet = [f for f in pet_required if pet_data.get(f) in (None, "")]
    if missing_owner or missing_pet:
        return jsonify({
            "error": "Missing required fields",
            "missing_owner": missing_owner,
            "missing_pet": missing_pet,
        }), 400

    try:
        customer = UserService.build_customer_user_for_provider(owner_data)
        db.session.add(customer)
        db.session.flush()

        pet = PetService.build_pet_for_owner(customer.id, pet_data)
        db.session.add(pet)
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    return jsonify({
        "owner": {
            "id": customer.id,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "email": customer.email,
            "phone_number": customer.phone_number,
        },
        "pet": {
            "id": pet.id,
            "name": format_text(pet.name),
            "species": format_text(pet.species.value),
            "breed": format_text(pet.breed),
            "gender": format_text(pet.gender.value),
            "desexed": pet.desexed,
            "date_of_birth": pet.date_of_birth.isoformat() if pet.date_of_birth else None,
            "weight": pet.weight,
            "notes": pet.notes,
        },
    }), 201
