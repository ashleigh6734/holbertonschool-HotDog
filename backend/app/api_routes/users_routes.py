from flask import Blueprint, jsonify, request
from app.models.user import User
from app.extensions import db

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/', methods=['GET'])
def get_all_users():
    """ Fetch all users """
    users = User.query.all()
    return jsonify([
        {
            'first_name': u.first_name,
            'last_name': u.last_name,
            'email': u.email
        }
        for u in users
    ])