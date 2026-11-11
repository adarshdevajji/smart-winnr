
import { useState } from "react";
import API from "./services/api";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Please wait...");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const data = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await API.post(endpoint, data);

      if (isLogin) {
        localStorage.setItem("token", response.data.token);
        setMessage("Login successful!");
        navigate("/");
      } else {
        setMessage("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p>Smart Winnr - Discover Great Food</p>

        {!isLogin && (
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>

        <p>{message}</p>

        <p className="switch-auth">
          {isLogin ? "New user?" : "Already registered?"}
          <span onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}>
            {isLogin ? " Create Account" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Auth;
