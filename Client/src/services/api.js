import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // ✅ required for cookies (auth)
});

// ✅ Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  },
);

// ✅ Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(
      `[API] Response ${response.status} from ${response.config.url}`,
    );
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        `[API] Error ${error.response.status}:`,
        error.response.data,
      );
    } else if (error.request) {
      // Request made but no response received
      console.error("[API] No response from server:", error.message);
      console.error("Backend URL:", import.meta.env.VITE_BACKEND_URL);
    } else {
      // Error in request setup
      console.error("[API] Error setting up request:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
