
import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch restaurants and remove duplicate records
  const fetchRestaurants = async (query = "") => {
    try {
      const response = await API.get("/restaurants", {
        params: query ? { search: query } : {}
      });

      const restaurantList = response.data.restaurants || [];

      // Display only one restaurant for the same name,
      // location and cuisine
      const uniqueRestaurants = restaurantList.filter(
        (restaurant, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.name.trim().toLowerCase() ===
                restaurant.name.trim().toLowerCase() &&
              item.location.trim().toLowerCase() ===
                restaurant.location.trim().toLowerCase() &&
              item.cuisine.trim().toLowerCase() ===
                restaurant.cuisine.trim().toLowerCase()
          )
      );

      setRestaurants(uniqueRestaurants);

    } catch (error) {
      console.error("Failed to load restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load restaurants when the page opens
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Search restaurants
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchRestaurants(search);
  };

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <h2>
          Smart <span>Winnr</span>
        </h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#restaurants">Restaurants</a>
          <a href="#about">About</a>
          <a href="/login" className="login-btn">
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" id="home">
        <div className="hero-content">

          <p className="tagline">
            DISCOVER • TASTE • REVIEW
          </p>

          <h1 style={{ color: "#ffffff" }}>Find the Best Food</h1>

          <p>
            Discover amazing restaurants, explore delicious cuisines
            and share your dining experiences.
          </p>

          {/* Search */}
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">
              Search
            </button>
          </form>

        </div>
      </header>

      {/* Restaurant Section */}
      <main className="restaurant-section" id="restaurants">

        <div className="section-heading">
          <p className="tagline">
            EXPLORE YOUR OPTIONS
          </p>

          <h2>Popular Restaurants</h2>

          <p>
            Find your next favourite dining destination.
          </p>
        </div>

        {loading ? (
          <p className="status">
            Loading restaurants...
          </p>
        ) : restaurants.length === 0 ? (
          <p className="status">
            No restaurants found. Try another search.
          </p>
        ) : (
          <div className="restaurant-grid">

            {restaurants.map((restaurant) => (
              <div
                className="restaurant-card"
                key={restaurant._id}
              >

                <div className="food-image">
                  🍽️
                </div>

                <div className="card-content">

                  <h3>{restaurant.name}</h3>

                  <p>📍 {restaurant.location}</p>

                  <p>🍴 {restaurant.cuisine}</p>

                  <p>{restaurant.description}</p>

                  <button
                    onClick={() =>
                      navigate(`/restaurants/${restaurant._id}`)
                    }
                  >
                    View Restaurant
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer id="about">
        <h2>Smart Winnr</h2>

        <p>
          Discover great food. Share great experiences.
        </p>

        <p>
          © 2026 Smart Winnr. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default App;
