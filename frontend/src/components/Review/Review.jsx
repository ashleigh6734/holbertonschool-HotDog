import './Review.css';

/**
 * Review Component - Displays a single review with user name, text, and star rating
 * @param {Object} props
 * @param {string} props.userName - Name of the reviewer
 * @param {string} props.review - Review text content
 * @param {number} props.rating - Rating from 1-5
 */
const Review = ({ userName, review, rating }) => {
  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <h4 className="reviewer-name">{userName}</h4>
      </div>
      <p className="review-text">{review}</p>
      <div className="review-rating">
        {renderStars(rating)}
      </div>
    </div>
  );
};

export default Review;
