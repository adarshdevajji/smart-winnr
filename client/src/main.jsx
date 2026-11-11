
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Auth from "./Auth.jsx";
import RestaurantDetails from "./pages/RestaurantDetails.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
