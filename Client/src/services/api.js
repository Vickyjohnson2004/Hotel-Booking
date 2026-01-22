import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

// Request interceptor - Add Authorization header from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API] Error ${error.response.status}:`,
        error.response.data,
      );

      // If 401 Unauthorized, clear token and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("[API] No response from server:", error.message);
    } else {
      console.error("[API] Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
