import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY || "$";

  // ================= AUTH HELPERS =================

  // ✅ Restore token from localStorage and check if still valid
  const restoreAuthFromToken = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return null;
      }

      console.log("🔄 Restoring auth from token...");

      // Try to fetch current user with the stored token
      const res = await api.get("/api/auth/me");
      console.log("✅ Auth restored successfully");
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      console.warn("⚠️ Token invalid or expired, clearing storage");
      localStorage.removeItem("authToken");
      setUser(null);
      setLoading(false);
      return null;
    }
  };

  // ✅ Fetch logged-in user
  const refreshUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setUser(null);
      localStorage.removeItem("authToken");
      return null;
    }
  };

  // Run once on app mount
  useEffect(() => {
    restoreAuthFromToken();
  }, []);

  // ================= ACTIONS =================

  const login = async (email, password) => {
    try {
      toast.loading("Logging in...", { id: "auth" });

      const res = await api.post("/api/auth/login", { email, password });

      // Save token to localStorage for persistence
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }

      setUser(res.data.user);
      toast.success("Welcome back 👋", { id: "auth" });

      navigate("/admin");
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        id: "auth",
      });
      throw err;
    }
  };

  const signup = async (username, email, password) => {
    try {
      toast.loading("Creating account...", { id: "auth" });

      const res = await api.post("/api/auth/signup", {
        username,
        email,
        password,
      });

      // Save token to localStorage for persistence
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }

      setUser(res.data.user);
      toast.success("Account created 🎉", { id: "auth" });

      navigate("/admin");
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed", {
        id: "auth",
      });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
      localStorage.removeItem("authToken");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      // Even if logout endpoint fails, clear local data
      localStorage.removeItem("authToken");
      setUser(null);
      toast.error("Logout failed");
      console.error(err);
    }
  };

  // ================= PROVIDER =================

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        loading,
        login,
        logout,
        signup,
        currency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
