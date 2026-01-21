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

  // ✅ Fetch logged-in user (cookie-based)
  const refreshUser = async () => {
    try {
      const res = await api.get("/api/auth/me"); // ✅ FIXED
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setUser(null);
      return null;
    }
  };

  // Run once on app mount
  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setLoading(false);
    };

    initAuth();
  }, []);

  // ================= ACTIONS =================

  const login = async (email, password) => {
    try {
      toast.loading("Logging in...", { id: "auth" });

      const res = await api.post("/api/auth/login", { email, password }); // ✅ FIXED

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
      }); // ✅ FIXED

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
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
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
