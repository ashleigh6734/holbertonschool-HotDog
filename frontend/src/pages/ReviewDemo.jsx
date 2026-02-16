import { useState } from 'react';
import { ReviewList } from '../components/Review';

const ReviewDemo = () => {
  const [hasAppointment] = useState(true); // Set to false to hide the button
  const [reviews, setReviews] = useState([
    {
      userName: 'Anastasie Stevens',
      review: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      rating: 3
    },
    {
      userName: 'Monique Tims',
      review: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      rating: 5
    },
    {
      userName: 'Sandrine Leigh',
      review: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      rating: 2
    }
  ]);

  const handleAddReview = (reviewData) => {
    // TODO: Send to backend API
    console.log('New review submitted:', reviewData);
    
    // For demo purposes, add to local state
    const newReview = {
      userName: 'Current User', // This would come from logged-in user
      review: reviewData.comment,
      rating: reviewData.rating
    };
    
    setReviews([...reviews, newReview]);
    alert('Review added successfully!');
  };

  return (
    <div>
      <ReviewList 
        title="All Things Pets" 
        reviews={reviews}
        hasAppointment={hasAppointment}
        onAddReview={handleAddReview}
      />
    </div>
  );
};

export default ReviewDemo;
