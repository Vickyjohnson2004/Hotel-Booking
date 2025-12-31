import axios from "axios";

const api = axios.create({
  // This ensures that even if you forget the /api in the env, it adds it
  baseURL: import.meta.env.VITE_BACKEND_URL.endsWith("/api")
    ? import.meta.env.VITE_BACKEND_URL
    : `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

export default api;
