import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/media";
import { assets } from "../assets/assets";

const UserDashboard = () => {
  const { user, logout, currency } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const res = await api.get("/bookings/me", { withCredentials: true });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        toast.error("Failed to load your bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await api.get("/rooms");
        setRooms((res.data.rooms || []).slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch rooms", err);
        toast.error("Failed to load rooms");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchBookings();
    fetchRooms();
  }, []);

  const submitTestimonial = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value || user?.username,
      email: form.email.value || user?.email,
      review: form.review.value,
      rating: Number(form.rating.value || 5),
    };

    try {
      await api.post("/testimonials", payload);
      toast.success("Testimonial submitted and pending approval");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit testimonial");
    }
  };

  return (
    <div className="py-8 px-4 md:px-12 lg:px-20">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center gap-4">
            <img
              src={getImageUrl(user?.image) || assets.userIcon}
              alt={user?.username}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {/* <p className="text-sm text-gray-500">Role: {user?.role}</p> */}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link to="/my-bookings" className="px-3 py-2 rounded border">
              View All Bookings
            </Link>
            <Link to="/rooms" className="px-3 py-2 rounded border">
              Browse Rooms
            </Link>
            <button
              onClick={logout}
              className="px-3 py-2 rounded border bg-red-50 text-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Bookings / Recent Bookings */}
        <div className="md:col-span-2 bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-3">My Recent Bookings</h3>

          {loadingBookings ? (
            <div className="text-gray-500">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-gray-500">You have no bookings yet.</div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between border rounded p-3"
                >
                  <div>
                    <p className="font-medium">{b.room.roomType}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(b.checkIn).toLocaleDateString()} -{" "}
                      {new Date(b.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {currency} {b.totalPrice}
                    </p>
                    <p className="text-sm text-gray-500">
                      {b.isPaid ? "Paid" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Quick Browse: Rooms</h4>
            {loadingRooms ? (
              <div className="text-gray-500">Loading rooms...</div>
            ) : rooms.length === 0 ? (
              <div className="text-gray-500">No rooms available.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {rooms.map((r) => (
                  <div
                    key={r._id}
                    className="border rounded p-3 flex gap-3 items-center"
                  >
                    <img
                      src={getImageUrl(r.images?.[0])}
                      className="h-16 w-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{r.roomType}</p>
                      <p className="text-sm text-gray-500">
                        {currency} {r.pricePerNight} / night
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/rooms/${r._id}`}
                        className="text-sm text-blue-600"
                      >
                        View
                      </Link>
                      <Link
                        to={`/rooms/${r._id}`}
                        className="px-2 py-1 text-sm rounded bg-blue-50 text-blue-700"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Testimonial quick submit */}
        <div className="md:col-span-3 bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Share your experience</h3>
          <form onSubmit={submitTestimonial} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                name="name"
                defaultValue={user?.username}
                className="p-2 border rounded"
                placeholder="Your name"
              />
              <input
                name="email"
                defaultValue={user?.email}
                className="p-2 border rounded"
                placeholder="Email (optional)"
              />
            </div>
            <div>
              <textarea
                name="review"
                className="p-2 border rounded w-full"
                rows={4}
                placeholder="Write a short review"
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm">Rating</label>
              <select name="rating" className="p-2 border rounded">
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
              <button className="ml-auto px-3 py-2 bg-blue-600 text-white rounded">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
