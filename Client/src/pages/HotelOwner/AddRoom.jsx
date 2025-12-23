import React, { useState, useContext, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import api from "../../services/api";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const AddRoom = () => {
  const { user, setUser, refreshUser } = useContext(AppContext);

  // Ensure we have the latest user object (including hotel) — useful if user logged in earlier
  useEffect(() => {
    const ensureUserHasHotel = async () => {
      try {
        if (user && !user.hotel) {
          const refreshed = await refreshUser();
          if (refreshed) setUser(refreshed);
        }
      } catch (err) {
        // silent fail — we'll show server response when attempting to add room
        console.warn("Failed to refresh user in AddRoom", err);
      }
    };

    ensureUserHasHotel();
  }, [user, setUser, refreshUser]);

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [input, setInput] = useState({
    roomType: "",
    pricePerNight: 0,
    maxGuests: 1,
    amenities: {
      "Free Wifi": false,
      "Free BreakFast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.hotel) {
      toast.error("You must own a hotel first!");
      return;
    }

    try {
      // Require at least one image
      const hasImage = Object.values(images).some((img) => img != null);
      if (!hasImage)
        return toast.error("Please upload at least one room image");

      toast.loading("Adding room...", { id: "room" });

      const formData = new FormData();
      formData.append("roomType", input.roomType);
      formData.append("pricePerNight", Number(input.pricePerNight));
      formData.append("maxGuests", Number(input.maxGuests));

      // Convert amenities object to array of selected amenities
      const selectedAmenities = Object.entries(input.amenities)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      formData.append("amenities", JSON.stringify(selectedAmenities));

      // Append images
      Object.values(images).forEach((img) => {
        if (img) formData.append("images", img);
      });

      await api.post("/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Room added successfully 🎉", { id: "room" });

      // Reset form
      setInput({
        roomType: "",
        pricePerNight: 0,
        maxGuests: 1,
        amenities: {
          "Free Wifi": false,
          "Free BreakFast": false,
          "Room Service": false,
          "Mountain View": false,
          "Pool Access": false,
        },
      });
      setImages({ 1: null, 2: null, 3: null, 4: null });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add room", {
        id: "room",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience"
      />

      {/* Upload Area for Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`roomImage${key}`}>
            <img
              className="max-h-13 cursor-pointer opacity-80"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.uploadArea
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={input.roomType}
            onChange={(e) => setInput({ ...input, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Suites">Luxury Suites</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className="mt-4">
            Price <span className="text-xs text-gray-500">/ Night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={input.pricePerNight}
            onChange={(e) =>
              setInput({ ...input, pricePerNight: e.target.value })
            }
          />
        </div>

        <div>
          <p className="mt-4">Max Guests</p>
          <input
            type="number"
            placeholder="1"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={input.maxGuests}
            onChange={(e) => setInput({ ...input, maxGuests: e.target.value })}
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
        {Object.keys(input.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={input.amenities[amenity]}
              onChange={() =>
                setInput({
                  ...input,
                  amenities: {
                    ...input.amenities,
                    [amenity]: !input.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>

      <button className="bg-primary bg-blue-500 hover:bg-blue-800 text-white px-8 py-2 rounded mt-8 cursor-pointer">
        Add Room
      </button>
    </form>
  );
};

export default AddRoom;
