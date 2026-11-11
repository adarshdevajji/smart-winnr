
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./services/api";

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const restaurantResponse = await API.get("/restaurants");
      const selected = restaurantResponse.data.restaurants.find(
        (item) => item._id === id
      );

      setRestaurant(selected);

      const reviewResponse = await API.get(`/reviews/${id}`);
      setReviews(reviewResponse.data.reviews);
    } catch (error) {
      setMessage("Unable to load restaurant details.");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await API.post(
        "/reviews",
        { restaurant: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComment("");
      setRating(5);
      setMessage("Review submitted successfully!");
      await loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not submit review."
      );
    }
  };

  if (!restaurant) {
    return <p className="status">{message || "Loading restaurant..."}</p>;
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate("/")}>← Back to Home</button>

      <div className="details-card">
        <h1>{restaurant.name}</h1>
        <p>📍 {restaurant.location}</p>
        <p>🍴 {restaurant.cuisine}</p>
        <p>{restaurant.description}</p>
      </div>

      <h2>Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div className="review-card" key={review._id}>
            <h3>{review.customer?.name || "Customer"}</h3>
            <p className="stars">{"⭐".repeat(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}

      <form className="review-form" onSubmit={submitReview}>
        <h2>Write a Review</h2>

        <label>Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Average</option>
          <option value={1}>1 - Poor</option>
        </select>

        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button type="submit">Submit Review</button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default RestaurantDetails;
