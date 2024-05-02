import axios from "axios";
import React, { useState } from "react";
import "../App.css";

axios.defaults.withCredentials = true;

const RatingModal = ({ dishId, isOpen, onClose, onSubmit}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitRating = async () => {
    try {
      const email = localStorage.getItem("user_email");

      const response = await axios.post(
        "http://localhost:5000/user/rate_dish",
        {
          dish_id: dishId,
          user_email: email,
          rating: parseInt(rating),
          comment: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onClose();
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  async function updateAndSubmit() {
    try {
      handleSubmitRating();
      onSubmit(rating, comment);
    } catch (error) {
      console.log(error);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{dishId}</h2>
        <div className="rating-section">
          <label>
            Rating: {rating}
            <input
              type="range"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              max="10"
              min="0"
              step="1"
              style={{ width: "100%", accentColor: "rgb(136,28,27)" }}
            />
          </label>
        </div>
        <div className="comment-section">
          <label>
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength="200" // Maximum length of 200 characters
              style={{ width: "100%", fontSize: "16px", height: "70px", resize: "none", borderColor: "rgb(136,28,27)" }} // Increased font size and fixed height
            />
          </label>
        </div>
        <div className="button-section">
          <button onClick={onClose} style={{ float: "left" }}>
            Close
          </button>
          <button onClick={updateAndSubmit} style={{ float: "right" }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;