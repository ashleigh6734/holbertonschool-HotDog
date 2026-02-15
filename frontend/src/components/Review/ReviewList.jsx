import { useState } from 'react';
import Review from './Review';
import AddReviewModal from './AddReviewModal';
import './Review.css';


const ReviewList = ({ title, reviews, hasAppointment = false, onAddReview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddReviewClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (reviewData) => {
    onAddReview(reviewData);
    setIsModalOpen(false);
  };

  return (
    <div className="review-list-container">
      <h2 className="review-title">{title}</h2>
      <div className="reviews-grid">
        {reviews && reviews.length > 0 ? (
          reviews.map((reviewItem, index) => (
            <Review
              key={index}
              userName={reviewItem.userName}
              review={reviewItem.review}
              rating={reviewItem.rating}
            />
          ))
        ) : (
          <p className="no-reviews">No reviews yet</p>
        )}
      </div>
      {hasAppointment && (
        <div className="review-button-wrapper">
          <button className="add-review-btn" onClick={handleAddReviewClick}>
            Add a Review
          </button>
        </div>
      )}
      
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default ReviewList;
