import React, { useEffect, useState } from "react";
import Title from "./Title";
import StarRating from "./StarRating";
import api from "../services/api";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/media";
import { assets } from "../assets/assets";

const Testimonia = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    address: "",
    rating: 5,
    review: "",
    image: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/testimonials");
        setTestimonials(res.data.testimonials || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.review)
      return toast.error("Name and review are required");

    try {
      setSubmitting(true);
      const res = await api.post("/api/testimonials", form);

      // Optimistic UI: insert the new testimonial locally as pending so the submitter sees it immediately
      const pending = {
        _id: `pending-${Date.now()}`,
        name: form.name,
        email: form.email,
        address: form.address,
        image: form.image,
        review: form.review,
        rating: form.rating,
        approved: false,
        pending: true,
      };

      setTestimonials((t) => [pending, ...(t || [])]);

      toast.success(
        res.data?.message ||
          "Thanks! Your testimonial is submitted and pending approval."
      );
      setShowModal(false);
      setForm({
        name: "",
        email: "",
        address: "",
        rating: 5,
        review: "",
        image: "",
      });

      // background refresh to pick up any newly-approved items (supports auto-approve scenarios)
      setTimeout(async () => {
        try {
          const refreshed = await api.get("/api/testimonials");
          setTestimonials((existing) => {
            const pendingItems = (existing || []).filter((i) => i.pending);
            return [...pendingItems, ...(refreshed.data.testimonials || [])];
          });
        } catch (err) {
          // ignore
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30">
      <div className="w-full flex items-center justify-between max-w-6xl">
        <Title
          title="What Our Guest Say"
          subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accomodations around the world."
        />
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Share your experience
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap items-center gap-6 mt-20">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className={`bg-white p-8 rounded-xl shadow ${
                !testimonial.approved ? "opacity-80 ring-1 ring-yellow-200" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full invert"
                  src={assets.userIcon || getImageUrl(testimonial.image)}
                  alt={testimonial.name}
                />
                <div>
                  <p className="font-playfair text-xl flex items-center gap-3">
                    {testimonial.name}
                    {!testimonial.approved && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Pending approval
                      </span>
                    )}
                  </p>
                  <p className="text-gray-500">{testimonial.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                <StarRating />
              </div>
              <p className="text-gray-500 max-w-90 mt-4">
                "{testimonial.review}"
              </p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Share your experience</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="border px-3 py-2 rounded"
                required
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email (optional)"
                className="border px-3 py-2 rounded"
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="City (optional)"
                className="border px-3 py-2 rounded"
              />
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL (optional)"
                className="border px-3 py-2 rounded"
              />
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} stars
                  </option>
                ))}
              </select>
              <textarea
                name="review"
                value={form.review}
                onChange={handleChange}
                placeholder="Write your review"
                className="border px-3 py-2 rounded h-24"
                required
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Testimonia;
