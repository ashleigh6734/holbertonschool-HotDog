from flask import Blueprint, jsonify, request
from app.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password required"}), 400

    try:
        result = AuthService.login(
            email=data["email"],
            password=data["password"]
        )
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401