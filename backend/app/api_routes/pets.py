from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.pet_service import PetService
from app.services.user_service import UserService

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
    pet = PetService.get_pet_by_id(pet_id)

    if pet.owner_id != owner_id:
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
    pet = PetService.get_pet_by_id(pet_id)

    if pet.owner_id != owner_id:
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
    pet = PetService.get_pet_by_id(pet_id)

    if pet.owner_id != owner_id:
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
