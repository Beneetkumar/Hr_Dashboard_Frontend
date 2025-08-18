// src/hooks/useAuth.js (or AuthContext.js)
import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();

// Use environment variable or fallback to localhost (for dev)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://hr-dashboard-backend-99kv.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setLoading(false);
      } catch {
        localStorage.removeItem("user");
        fetchUserFromServer();
      }
    } else {
      fetchUserFromServer();
    }
  }, []);

  // Fetch user from backend if session cookie exists
  const fetchUserFromServer = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Session restore failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
