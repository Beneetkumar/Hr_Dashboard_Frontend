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
      await login(email.trim().toLowerCase(), password); // ✅ call hook
      navigate("/"); // ✅ redirect after login
    } catch (err) {
      setError(err.message || "Login failed");
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
