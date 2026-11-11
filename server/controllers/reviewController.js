
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

// Add a review
export const addReview = async (req, res) => {
  try {
    const { restaurant, rating, comment } = req.body;

    if (!restaurant || !rating || !comment) {
      return res.status(400).json({
        message: "Restaurant, rating and comment are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurant)) {
      return res.status(400).json({
        message: "Invalid restaurant ID"
      });
    }

    if (
      !Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const restaurantExists = await Restaurant.findById(restaurant);

    if (!restaurantExists) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    const review = await Review.create({
      customer: req.user.id,
      restaurant,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this restaurant"
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a restaurant
export const getReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID"
      });
    }

    const reviews = await Review.find({
      restaurant: restaurantId
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update your own review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid review ID"
      });
    }

    if (
      rating !== undefined &&
      (!Number.isInteger(Number(rating)) ||
        Number(rating) < 1 ||
        Number(rating) > 5)
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own review"
      });
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete your own review
export const deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid review ID"
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own review"
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
