import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  // ✅ Provide a refresh helper and fetch logged-in user on mount (cookie-based)
  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // call refreshUser on mount
    refreshUser();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      toast.loading("Logging in...", { id: "auth" });

      const res = await api.post("/auth/login", { email, password });
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

  // ✅ Signup
  const signup = async (username, email, password) => {
    try {
      toast.loading("Creating account...", { id: "auth" });

      const res = await api.post("/auth/signup", {
        username,
        email,
        password,
      });

      setUser(res.data.user);
      toast.success("Account created successfully 🎉", { id: "auth" });

      navigate("/admin");
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed", {
        id: "auth",
      });
      throw err;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

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
