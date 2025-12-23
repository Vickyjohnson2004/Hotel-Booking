import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, cities } from "../assets/assets";
import api from "../services/api";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { user, setUser, refreshUser } = useContext(AppContext);
  const [ShowReg, setShowReg] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    description: "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login first to register a hotel!");

    try {
      const payload = new FormData();
      payload.append("name", formData.name || "");
      payload.append("address", formData.address || "");
      payload.append("city", formData.city || "");
      payload.append("description", formData.description || "");
      payload.append("amenities", JSON.stringify([])); // optional default empty array

      // validate images
      if (!images || images.length === 0) {
        return toast.error("Please upload at least one hotel image");
      }

      images.forEach((img) => payload.append("images", img));

      // send request
      await api.post("/hotels", payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Refresh current user so `user.hotel` is available immediately
      try {
        const refreshed = await refreshUser();
        if (refreshed) setUser(refreshed);
      } catch (err) {
        console.warn("Failed to refresh user after hotel registration", err);
      }

      toast.success("Hotel registered successfully!");
      setFormData({ name: "", address: "", city: "", description: "" });
      setShowReg(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to register hotel");
    }
  };

  if (!user)
    return (
      <p className="text-center mt-10 text-red-500">
        Please log in to register a hotel.
      </p>
    );

  return (
    ShowReg && (
      <div className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/80">
        <form
          onSubmit={handleSubmit}
          className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
        >
          <img
            src={assets.regImage}
            alt="reg-image"
            className="w-1/2 rounded-xl hidden md:block"
          />
          <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
            <img
              src={assets.closeIcon}
              alt="close-image"
              className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
              onClick={() => setShowReg(false)}
            />
            <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

            {/* Name and Address Inputs */}
            {["name", "address", "description"].map((field) => (
              <div key={field} className="w-full mt-4">
                <label className="font-medium text-gray-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                  required={field !== "description"}
                />
              </div>
            ))}

            {/* Image upload (required) */}
            <div className="w-full mt-4">
              <label className="font-medium text-gray-500">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                required
              />
            </div>

            {/* City Dropdown */}
            <div className="w-full mt-4 max-w-60 mr-auto">
              <label className="font-medium text-gray-500">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default HotelReg;
