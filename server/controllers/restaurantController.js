
import Restaurant from "../models/Restaurant.js";

// Escape special characters in search values
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Add a restaurant
export const addRestaurant = async (req, res) => {
  try {
    const { name, location, cuisine, description } = req.body;

    // Validate required fields
    if (
      !name?.trim() ||
      !location?.trim() ||
      !cuisine?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, location and cuisine are required"
      });
    }

    // Check whether the restaurant already exists
    const existingRestaurant = await Restaurant.findOne({
      name: {
        $regex: `^${escapeRegex(name.trim())}$`,
        $options: "i"
      },
      location: {
        $regex: `^${escapeRegex(location.trim())}$`,
        $options: "i"
      },
      cuisine: {
        $regex: `^${escapeRegex(cuisine.trim())}$`,
        $options: "i"
      }
    });

    if (existingRestaurant) {
      return res.status(409).json({
        success: false,
        message: "This restaurant already exists",
        restaurant: existingRestaurant
      });
    }

    // Create restaurant
    const restaurant = await Restaurant.create({
      name: name.trim(),
      location: location.trim(),
      cuisine: cuisine.trim(),
      description: description?.trim() || ""
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      restaurant
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get restaurants
export const getRestaurants = async (req, res) => {
  try {
    const { search, location, cuisine } = req.query;

    const filter = {};

    if (search?.trim()) {
      filter.name = {
        $regex: escapeRegex(search.trim()),
        $options: "i"
      };
    }

    if (location?.trim()) {
      filter.location = {
        $regex: escapeRegex(location.trim()),
        $options: "i"
      };
    }

    if (cuisine?.trim()) {
      filter.cuisine = {
        $regex: escapeRegex(cuisine.trim()),
        $options: "i"
      };
    }

    const restaurants = await Restaurant.find(filter);

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
