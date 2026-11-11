
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./RestaurantDetails.css";

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const restaurantResponse = await API.get("/restaurants");
      const selected = restaurantResponse.data.restaurants.find(
        (item) => item._id === id
      );

      setRestaurant(selected || null);

      const reviewResponse = await API.get(`/reviews/${id}`);
      setReviews(reviewResponse.data.reviews || []);
    } catch (error) {
      console.error("Failed to load details:", error);
      setMessage("Unable to load restaurant details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

 
const handleReview = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    await API.post(
      "/reviews",
      {
        restaurant: id,
        rating: Number(rating),
        comment
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setComment("");
    setRating(5);
    setMessage("Review added successfully!");

    await fetchDetails();

  } catch (error) {
    setMessage(
      error.response?.data?.message || "Failed to submit review."
    );
  }
};


  if (loading) return <h2>Loading...</h2>;

  if (!restaurant) return <h2>Restaurant not found.</h2>;

  return (
    <div className="details-page">
      <h1>{restaurant.name}</h1>
      <p>📍 {restaurant.location}</p>
      <p>🍴 {restaurant.cuisine}</p>
      <p>{restaurant.description}</p>

      <hr />

      <h2>Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div className="review-card" key={review._id}>
            <h3>{review.customer?.name || "Customer"}</h3>
            <p>Rating: {"⭐".repeat(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}

      <hr />

      <h2>Write a Review</h2>

      <form onSubmit={handleReview}>
        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} Stars
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button type="submit">Submit Review</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default RestaurantDetails;
