import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { getImageUrl } from "../utils/media";

const HotelCard = ({ room, index }) => {
  // Defensive check: if room doesn't exist yet, return null
  if (!room) return null;

  return (
    <Link
      className="relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] border border-gray-100"
      to={`/rooms/${room._id}`}
      onClick={() => window.scrollTo(0, 0)}
      key={room._id}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={getImageUrl(room.images?.[0])}
          alt={room.hotel?.name || "Hotel Room"}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = assets.uploadArea;
          }}
        />
        {index % 2 === 0 && (
          <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full shadow-sm">
            Best Seller
          </p>
        )}
      </div>

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-playfair text-xl font-medium text-gray-800 truncate">
            {/* Added optional chaining here to prevent crash */}
            {room.hotel?.name || "Hotel Name Loading..."}
          </p>
          <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
            <img src={assets.starIconFilled} alt="star" className="w-3" />
            4.5
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <img src={assets.locationIcon} alt="location" className="w-3" />
          {/* Added optional chaining here to prevent crash */}
          <span className="truncate">
            {room.hotel?.address || "Address Loading..."}
          </span>
        </div>

        <div className="flex items-center justify-between mt-5">
          <p className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">
              ${room.price || room.pricePerNight}
            </span>
            <span className="text-xs">/night</span>
          </p>
          <button className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-all cursor-pointer">
            Book
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
