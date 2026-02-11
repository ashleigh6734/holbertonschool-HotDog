from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.review_service import ReviewService

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')

# =====================
# CREATE REVIEW
# =====================
@reviews_bp.route("/", methods=["POST"])
@jwt_required()
def create_review():
    """
    User submits a review for a completed appointment.
    Expected JSON: { "appointment_id": 1, "rating": 5, "comment": "Great!" }
    """
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        review = ReviewService.create_review(user_id, data)
        return jsonify({
            "id": review.id,
            "rating": review.rating,
            "message": "Review submitted successfully!"
        }), 201
        
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403 # Forbidden
    except ValueError as e:
        return jsonify({"error": str(e)}), 400 # Bad Request


# =====================
# GET PROVIDER REVIEWS
# =====================
@reviews_bp.route("/provider/<string:provider_id>", methods=["GET"])
def get_provider_reviews(provider_id):
    """
    Public route to fetch all reviews for a specific provider/clinic.
    Used to populate the 'Average Rating' and review list on the profile.
    """
    reviews = ReviewService.get_reviews_for_provider(provider_id)

    return jsonify([
        {
            "id": r.id,
            "author_name": f"{r.user.first_name} {r.user.last_name[0]}.", # "Ash L."
            "rating": r.rating,
            "comment": r.comment,
            "date": r.created_at.strftime("%Y-%m-%d"),
        }
        for r in reviews
    ]), 200