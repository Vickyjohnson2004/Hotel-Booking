import React, { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import api from "../../services/api";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import ManageOffers from "./Offers";

const Dashboard = () => {
  const { user } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user || !user.hotel) {
        setDashboardData({ totalBookings: 0, totalRevenue: 0, bookings: [] });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/api/bookings/hotel/${user.hotel}`, {
          withCredentials: true,
        });

        const data = {
          totalBookings: res.data.results || 0,
          totalRevenue: res.data.totalRevenue || 0,
          bookings: (res.data.bookings || []).slice(0, 5),
        };

        // If admin, also fetch pending testimonial count
        if (user?.role === "admin") {
          try {
            const tRes = await api.get("/api/testimonials/all", {
              withCredentials: true,
            });
            const pendingCount = (tRes.data.data || []).filter(
              (t) => !t.approved,
            ).length;
            data.pendingTestimonials = pendingCount;
          } catch (err) {
            console.warn("Failed to fetch testimonials for dashboard", err);
          }
        }

        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track booking and analiyze revenue-all in one place. Stay updated with real with real time insight's to ensure smooth operations."
      />
      <div className="flex gap-4 my-8">
        {/* Total Bookings */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />

          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Booking</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>
        {/* Total Revenue */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="max-sm:hidden h-10"
          />

          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">
              $ {dashboardData.totalRevenue}
            </p>
          </div>
        </div>

        {/* Pending Testimonials (admin only) */}
        {user?.role === "admin" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded flex flex-col md:flex-row gap-6 items-center pt-0 p-4 pr-8 ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h4l2 2 2-2h4a2 2 0 002-2zM7 7a1 1 0 112 0 1 1 0 01-2 0zm4 0a1 1 0 112 0 1 1 0 01-2 0z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col sm:ml-4 font-medium">
              <p className="text-yellow-600 text-lg">Pending Testimonials</p>
              <p className="text-neutral-400 text-base">
                {dashboardData.pendingTestimonials || 0}
              </p>
            </div>
            <div className="ml-auto">
              <a
                href="/owner/testimonials"
                className="text-sm text-black underline"
              >
                Review
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Recent Booking */}
      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Bookings
      </h2>
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Room Name
              </th>
              <th className="py-3 px-4 text-center text-gray-800 font-medium">
                Total Amount
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dashboardData.bookings.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.user.username}
                </td>

                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.room.roomType}
                </td>

                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  $ {item.totalPrice}
                </td>

                <td className="py-3 px-4 border-t border-gray-300 flex">
                  <button
                    className={`py-1 px-3 test-xs rounded-full mx-auto ${
                      item.isPaid
                        ? "bg-gray-200 text-green-600"
                        : "bg-amber-200 text-yellow-600"
                    }`}
                  >
                    {item.isPaid ? "Completed" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
