from flask import Blueprint, jsonify, request
from app.services.user_service import UserService
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """ Fetch a single user by ID """
    user = UserService.get_user_by_id(user_id)

    if user is None:
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "image_url": user.image_url,
        "role": user.role
    }), 200

@users_bp.route('/', methods=['POST'])
def create_user():
    """ Create a new user """
    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400
    
    data = request.get_json()

    required_fields = {"first_name", "last_name", "email", "password"}
    missing_fields = required_fields - data.keys()

    if missing_fields:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing_fields)}"
        }), 400

    try:
        user = UserService.create_user(data)
        return jsonify({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@users_bp.route('/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current_user = get_jwt_identity() # logged in user

    if current_user != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    user = UserService.update_user(user_id, data)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "User successfully updated"}), 200

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user = get_jwt_identity() # logged in user

    if current_user != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = UserService.delete_user(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "User successfully deleted"}), 200