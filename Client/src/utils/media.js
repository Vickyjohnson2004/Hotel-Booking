import { assets } from "../assets/assets";

export const getImageUrl = (img) => {
  const apiBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
  const backendOrigin = apiBase.replace(/\/api\/?$/, "");
  if (!img) return assets.uploadArea;
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  return `${backendOrigin}${img}`;
};
