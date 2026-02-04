from flask import Blueprint, jsonify, request
from app.services.user_service import UserService

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """ Fetch a single user by ID """
    try:
        user = UserService.get_user_by_id(user_id)        
        return jsonify({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "image_url": user.image_url,
            "role": user.role
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

@users_bp.route('/', methods=['POST'])
def create_user():
    """ Create a new user """
    if not request.is_json:
        return jsonify({"error": "Invalid JSON"}), 400
    
    data = request.get_json()

    required_fields = {"first_name", "last_name", "email", "password"}
    if not required_fields:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        user = UserService.create_user(data)
        return jsonify({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }), 201
    except ValueError as e:
        return jsonify({"error: str(e)"}), 400

@users_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        UserService.delete_user(user_id)
        return jsonify({"message": "User successfully deleted"})
    except ValueError as e:
        return jsonify({"error": str(e)}), 404