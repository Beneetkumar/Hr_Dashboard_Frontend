import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext();
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://hr-dashboard-backend-99kv.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserFromServer();
  }, []);


  const fetchUserFromServer = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data); 
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Fetch user failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

 
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Login failed");
      }

      await fetchUserFromServer();
    } catch (err) {
      console.error("Login error:", err);
      setUser(null);
      throw err;
    }
  };


  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
