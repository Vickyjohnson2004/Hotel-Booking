import React, { useState, useEffect } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import api from "../services/api";
import toast from "react-hot-toast";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="SortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "200 to 300"];
  const sortOptions = [
    "Price Low To High",
    "Price High To Low",
    "Newest First",
  ];

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]); // labels like "$ 0 to 500"
  const [sortOption, setSortOption] = useState("");

  const handleToggleRoomType = (checked, label) => {
    setSelectedRoomTypes((prev) =>
      checked ? [...prev, label] : prev.filter((x) => x !== label)
    );
  };

  const handleTogglePriceRange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, label] : prev.filter((x) => x !== label)
    );
  };

  const handleSortChange = (label) => setSortOption(label);

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSortOption("");
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/rooms", { withCredentials: true });
        setRooms(res.data.rooms || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Helper to parse price labels like "$ 0 to 500" or "0 to 500"
  const parsePriceLabel = (label) => {
    const cleaned = label.replace(/^\$\s*/, "");
    const parts = cleaned.split("to").map((s) => s.trim());
    const min = Number(parts[0]) || 0;
    const max = Number(parts[1]) || Number.POSITIVE_INFINITY;
    return { min, max };
  };

  // Apply filters
  const applyFilters = (list) => {
    let out = [...list];

    // room type
    if (selectedRoomTypes.length > 0) {
      out = out.filter((r) =>
        selectedRoomTypes.some((t) =>
          (r.title || "").toLowerCase().includes(t.toLowerCase())
        )
      );
    }

    // price ranges
    if (selectedPriceRanges.length > 0) {
      out = out.filter((r) =>
        selectedPriceRanges.some((rangeLabel) => {
          const { min, max } = parsePriceLabel(rangeLabel);
          return r.price >= min && r.price <= max;
        })
      );
    }

    // sort
    if (sortOption === "Price Low To High") {
      out.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price High To Low") {
      out.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Newest First") {
      out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return out;
  };

  const displayedRooms = applyFilters(rooms);

  const apiBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const backendOrigin = apiBase.replace(/\/api\/?$/, "");
  const getImageUrl = (img) => {
    if (!img) return assets.uploadArea;
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    return `${backendOrigin}${img}`;
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div>
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our unlimited-time offers ans special packages to
            enhance your stay and create unforgetable memories.
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No rooms found.</div>
        ) : (
          displayedRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            >
              <img
                onClick={() => navigate(`/rooms/${room._id}`)}
                src={getImageUrl(room.images?.[0])}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = assets.uploadArea;
                }}
                alt="hotel-img"
                title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-g">{room.hotel?.city}</p>
                <p>{room.hotel?.name}</p>
                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2">200+ Reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="locationIcon" />
                  <span>{room.hotel?.address}</span>
                </div>

                {/* Room Amenities */}
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {(room.amenities || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img
                        src={facilityIcons[item] || assets.uploadArea}
                        alt={item}
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>
                {/* Rooms Per Night */}
                <p className="text-xl font-medium text-gray-700">
                  $ {room.price}/Night
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              className="hidden lg:block cursor-pointer text-sm"
              onClick={clearFilters}
            >
              CLEAR
            </span>
          </div>
        </div>

        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={(checked, label) =>
                  handleToggleRoomType(checked, label)
                }
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`$ ${range}`}
                selected={selectedPriceRanges.includes(`$ ${range}`)}
                onChange={(checked, label) =>
                  handleTogglePriceRange(checked, label)
                }
              />
            ))}
          </div>

          <div className="px-5 pb-7 pt-5">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={sortOption === option}
                onChange={(label) => handleSortChange(label)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
