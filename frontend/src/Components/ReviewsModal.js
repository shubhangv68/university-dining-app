import React from "react";
import "../App.css";

const ReviewsModal = ({ isOpen, reviews, onClose }) => {
  if (!isOpen) return null;

  const ratingStars = (rating) => {
    let starString = "★";
    for (let i = 0; i < Math.floor(rating/2) - 1; i++) {
      starString += '★';
    }

    return starString;
  }
  

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          <ul style={{ maxHeight: "300px", overflowY: "scroll" }}>
            {reviews.map((review, index) => (
              <li key={index} style={{ margin: "10px 0", borderBottom: "1px solid #ccc", paddingBottom: "10px", listStyleType: "none" }}>
                <p>{ratingStars(review.rating)}</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p>
        )}
        <div className="button-section">
          <button onClick={onClose} style={{ float: "right" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
