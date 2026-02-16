import { useState } from 'react';
import './AddReviewModal.css';


const AddReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim() === '') {
      setError('Please write a comment');
      return;
    }

    if (comment.length > 500) {
      setError('Comment cannot exceed 500 characters');
      return;
    }

    // Submit the review
    onSubmit({
      rating,
      comment: comment.trim()
    });

    // Reset form
    setComment('');
    setRating(0);
    setHoveredRating(0);
  };

  const handleClose = () => {
    setComment('');
    setRating(0);
    setHoveredRating(0);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add a Review</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* Rating Section */}
          <div className="form-group">
            <label htmlFor="rating">Rating *</label>
            <div className="star-rating" id="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${
                    star <= (hoveredRating || rating) ? 'filled' : 'empty'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  title={`${star} star${star !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-display">{rating} star{rating !== 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Comment Section */}
          <div className="form-group">
            <label htmlFor="comment">Comment *</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows="5"
              maxLength="500"
            />
            <div className="char-count">
              {comment.length}/500
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
