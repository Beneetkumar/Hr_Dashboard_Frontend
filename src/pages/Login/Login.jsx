import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email.trim().toLowerCase(), password);

      if (success === false) {
        setError("Login failed. Please check credentials.");
        return;
      }

      // ✅ Extra role check (optional)
      if (success.role !== "HR") {
        setError("Access denied: This dashboard is for HR only.");
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error, please try again later");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">HRMS Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
        </form>

        <p className="switch-text">
          Don’t have an account?{" "}
          <Link to="/register" className="switch-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
