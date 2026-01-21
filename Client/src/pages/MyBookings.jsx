import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import api from "../services/api";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/api/bookings/me", {
          withCredentials: true,
        });

        setBookings(res.data.bookings);
      } catch (err) {
        toast.error("Failed to load bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="py-28 text-center text-gray-500">
        Loading your bookings...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="py-28 text-center text-gray-500">
        You have no bookings yet.
      </div>
    );
  }

  return (
    <div className="py-28 md:pb-35 md:pt-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations"
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] border-b border-gray-300 font-medium py-3">
          <div>Hotels</div>
          <div>Date and Timing</div>
          <div>Payments</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b border-gray-300 py-6"
          >
            {/* Hotel Details */}
            <div className="flex flex-col md:flex-row">
              <img
                src={booking.room.images?.[0]}
                alt="hotel"
                className="md:w-44 rounded shadow object-cover"
              />

              <div className="flex flex-col gap-1.5 md:ml-4">
                <p className="font-playfair text-2xl">
                  {booking.hotel.name}{" "}
                  <span className="text-sm">({booking.room.roomType})</span>
                </p>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.locationIcon} alt="" />
                  <span>{booking.hotel.address}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.guestsIcon} alt="" />
                  <span>Guest: {booking.guests}</span>
                </div>

                <p>Total: ${booking.totalPrice}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex md:items-center md:gap-12 mt-3 gap-8">
              <div>
                <p>Check-In</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.checkIn).toDateString()}
                </p>
              </div>
              <div>
                <p>Check-Out</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.checkOut).toDateString()}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex flex-col justify-center p-3">
              <div className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p
                  className={`text-sm ${
                    booking.isPaid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "Unpaid"}
                </p>
              </div>

              {!booking.isPaid && (
                <button className="mt-4 px-4 py-1.5 text-xs border rounded-full hover:bg-gray-100">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
