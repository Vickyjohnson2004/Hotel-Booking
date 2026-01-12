import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // ✅ required for cookies (auth)
});

export default api;
