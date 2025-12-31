import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://localhost:5000/api",
  withCredentials: true, // required for cookies
});

export default api;
