import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons } from "../assets/assets";
import StarRating from "../components/StarRating";
import api from "../services/api";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/media";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoadingRoom(true);
        const res = await api.get(`/api/rooms/${id}`);

        if (res.data.success && res.data.room) {
          setRoom(res.data.room);
          // FIX 1: Explicitly set the main image when data arrives
          const firstImg = res.data.room.images?.[0];
          setMainImage(getImageUrl(firstImg));
        } else {
          toast.error("Room not found");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load room details");
      } finally {
        setLoadingRoom(false);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  if (loadingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Room details not available.</p>
      </div>
    );
  }

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800">
          {room.hotel?.name || "The Grand Hotel"}
          <span className="text-lg font-inter font-normal ml-2 text-gray-500">
            ({room.title || "Standard Room"})
          </span>
        </h1>
        <div className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
          20% OFF
        </div>
      </div>

      {/* Ratings & Location */}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <StarRating rating={4.5} />
          <span className="text-sm text-gray-600">(200+ reviews)</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <img src={assets.locationIcon} className="w-4" alt="loc" />
          <span className="text-sm">
            {room.hotel?.address || "Location not specified"}
          </span>
        </div>
      </div>

      {/* FIX 2: Enhanced Image Gallery */}
      <div className="flex flex-col lg:flex-row mt-8 gap-4">
        {/* Large Image Container */}
        <div className="lg:w-2/3 w-full">
          <img
            src={mainImage || assets.placeholderImage}
            alt="Room View"
            className="w-full h-[300px] md:h-[500px] rounded-2xl object-cover shadow-md border"
          />
        </div>

        {/* Thumbnails Grid */}
        <div className="lg:w-1/3 w-full grid grid-cols-2 gap-3 h-fit">
          {room.images?.slice(0, 4).map((img, index) => (
            <div
              key={index}
              onClick={() => setMainImage(getImageUrl(img))}
              className={`relative cursor-pointer rounded-xl overflow-hidden h-32 md:h-40 border-2 transition-all ${
                mainImage === getImageUrl(img)
                  ? "border-orange-500 scale-[0.98]"
                  : "border-transparent opacity-80"
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Room ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Features & Price */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-start border-b pb-10">
        <div className="flex-1">
          <h2 className="text-2xl font-playfair font-semibold mb-4 text-gray-800">
            Room Highlights
          </h2>
          <div className="flex flex-wrap gap-3">
            {room.amenities?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700"
              >
                <img
                  src={facilityIcons[item] || assets.featureIcon}
                  className="w-5 h-5"
                  alt=""
                />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 md:mt-0 text-right">
          <p className="text-3xl font-bold text-blue-600">
            ${room.price}
            <span className="text-sm text-gray-500 font-normal"> / night</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="mt-10">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!checkIn || !checkOut) return toast.error("Select dates");
            const ci = new Date(checkIn);
            const co = new Date(checkOut);
            if (ci >= co)
              return toast.error("Check-out must be after check-in");

            try {
              setBookingLoading(true);
              const avail = await api.get(
                `/api/bookings/availability?roomId=${id}&checkIn=${checkIn}&checkOut=${checkOut}`
              );

              if (!avail.data.available)
                return toast.error("Dates not available");

              const nights = Math.round((co - ci) / (1000 * 60 * 60 * 24));
              const totalPrice = nights * room.price;

              await api.post(
                "/api/bookings",
                {
                  room: room._id,
                  hotel: room.hotel?._id,
                  checkIn,
                  checkOut,
                  guests: Number(guests),
                  totalPrice,
                },
                { withCredentials: true }
              );

              toast.success("Booking successful!");
              navigate("/my-bookings");
            } catch (err) {
              toast.error(err.response?.data?.message || "Booking failed");
            } finally {
              setBookingLoading(false);
            }
          }}
          className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-end gap-6"
        >
          <div className="w-full space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-3 border rounded-xl outline-blue-500"
              required
            />
          </div>
          <div className="w-full space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-3 border rounded-xl outline-blue-500"
              required
            />
          </div>
          <div className="w-full md:w-40 space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Guests
            </label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full p-3 border rounded-xl outline-blue-500"
              min="1"
              required
            />
          </div>
          <button
            className="w-full md:w-auto bg-blue-600 text-white px-12 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap"
            type="submit"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>

      {/* Host Section */}
      <div className="mt-20 p-8 bg-gray-50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img
            src={getImageUrl(room.hotel?.images?.[0]) || assets.userIcon}
            alt="Host"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Hosted by {room.hotel?.name}
            </h3>
            <p className="text-gray-500 text-sm">Verified Professional Host</p>
            <div className="flex items-center mt-1 text-orange-500">
              <StarRating rating={5} />
            </div>
          </div>
        </div>
        <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all">
          Contact Host
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
