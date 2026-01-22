import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import Title from "../../components/Title";
import { AppContext } from "../../context/AppContext";

const AdminTestimonials = () => {
  const { user } = useContext(AppContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/testimonials/all", {
        withCredentials: true,
      });
      setTestimonials(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials (admin)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchTestimonials();
  }, [user]);

  const del = async (id) => {
    const ok = window.confirm(
      "Delete this testimonial? This action cannot be undone.",
    );
    if (!ok) return;

    try {
      await api.delete(`/api/testimonials/${id}`, { withCredentials: true });
      setTestimonials((t) => t.filter((item) => item._id !== id));
      toast.success("Testimonial deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete testimonial");
    }
  };

  const approve = async (id) => {
    try {
      await api.patch(
        `/api/testimonials/${id}/approve`,
        {},
        { withCredentials: true },
      );
      toast.success("Testimonial approved");
      setTestimonials((t) =>
        t.map((item) => (item._id === id ? { ...item, approved: true } : item)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="py-28 text-center">
        You need admin access to manage testimonials.
      </div>
    );
  }

  return (
    <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="w-full flex items-center justify-between">
        <Title
          title="Testimonials (Admin)"
          subTitle="Review and approve user-submitted testimonials"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTestimonials}
            className="px-3 py-1 rounded border"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-gray-500">No testimonials yet.</div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white p-6 rounded shadow flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">
                  {t.name}{" "}
                  {t.email && (
                    <span className="text-sm text-gray-400">({t.email})</span>
                  )}
                </p>
                <p className="text-gray-500">{t.address}</p>
                <p className="mt-2">{t.review}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {t.rating} stars — {t.approved ? "Approved" : "Pending"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {!t.approved && (
                  <button
                    onClick={() => approve(t._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => del(t._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
