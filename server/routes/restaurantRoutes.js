
import express from "express";
import {
  addRestaurant,
  getRestaurants
} from "../controllers/restaurantController.js";

const router = express.Router();

router.post("/", addRestaurant);
router.get("/", getRestaurants);

export default router;
