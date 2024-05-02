import React, { useState } from 'react';
import '../App.css';
import RatingModal from './RatingModal';
import ReviewsModal from './ReviewsModal';

const DishItem = ({ item, onClick}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReviewed, setUserReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);

  const createApiUrl = (dishId) => {
    const baseUrl = "http://localhost:5000/menu";
    const encodedDishName = encodeURIComponent(dishId);
    return `${baseUrl}/${encodedDishName}/reviews`;
  }

  const formatRating = (rating) => {
    return (rating / 2).toFixed(1);
  };

  const handleRateClick = (e) => {
    setModalOpen(true);
  };

  const handleCloseModal = (e) => {
    setModalOpen(false);
  };

  const handleOnSubmit = (rating, comment) => {
    try {
      setUserReviewed(true);
      setUserReview({ rating: rating, comment: comment });
    } catch (error) {
      console.error("Failed to get latest user review", error);
    }
  };

  const handleCloseReviewModal = (e) => {
    setReviewsModalOpen(false);
  };

  const handleUserReviews = async (e) => {
    try {
      const response = await fetch(`${createApiUrl(item.id)}`);
      const data = await response.json();
      setReviews(data);
      setReviewsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  return (
    <div className="custom-dish-item" styleonClick={onClick}>
      <h3 onClick={onClick}>{item.name ? item.name: item.dish.id}</h3>
      {userReviewed && <p> Your Review: {userReview.comment} & Rating: {userReview.rating} ★</p>}
      <div style={{"marginBottom": "10px"}}>
        <p>{item.avg_rating ? `Rated ${formatRating(item.avg_rating)}★ by other users` : null}</p>
        <p>{item.dish ? `Rated ${formatRating(item.dish.avg_rating)}★ by other users` : null}</p>
        <p onClick={handleUserReviews}>View Reviews</p>
      </div>
      <button onClick={handleRateClick}>Rate This Dish</button>
      <RatingModal
        isOpen={modalOpen}
        dishId={item ? item.id: item.dish.id}
        onClose={handleCloseModal}
        onSubmit={handleOnSubmit}
      />
      <ReviewsModal
        isOpen={reviewsModalOpen}
        reviews={reviews}
        onClose={handleCloseReviewModal}
      />
    </div>
  );
};

export default DishItem;