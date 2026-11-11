
import express from "express";

import {
  addReview,
  getReviews,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a review (login required)
router.post("/", authMiddleware, addReview);

// Get reviews for a restaurant (public)
router.get("/:restaurantId", getReviews);

// Update your review (login required)
router.put("/:id", authMiddleware, updateReview);

// Delete your review (login required)
router.delete("/:id", authMiddleware, deleteReview);

export default router;
