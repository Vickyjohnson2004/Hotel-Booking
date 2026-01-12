import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import Title from "../../components/Title";
import { getImageUrl } from "../../utils/media";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageFile: null,
    priceOff: "",
    expiryDate: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    imageFile: null,
    priceOff: "",
    expiryDate: "",
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/offers", { withCredentials: true });
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error("Failed tao fetch offers", err);
      toast.error("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") return setForm({ ...form, imageFile: files[0] });
    setForm({ ...form, [name]: value });
  };

  const onEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile")
      return setEditForm({ ...editForm, imageFile: files[0] });
    setEditForm({ ...editForm, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description)
      return toast.error("Title and description are required");
    if (!form.imageFile) return toast.error("Offer image is required");

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("image", form.imageFile);
      if (form.priceOff) payload.append("priceOff", String(form.priceOff));
      if (form.expiryDate) payload.append("expiryDate", form.expiryDate);

      const res = await api.post("/api/offers", payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setOffers([res.data.offer, ...offers]);
      toast.success("Offer created");
      setForm({
        title: "",
        description: "",
        imageFile: null,
        priceOff: "",
        expiryDate: "",
      });
    } catch (err) {
      console.error("CREATE OFFER ERROR:", err);
      toast.error(err.response?.data?.message || "Failed to create offer");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (offer) => {
    setEditingId(offer._id);
    setEditForm({
      title: offer.title || "",
      description: offer.description || "",
      imageFile: null,
      priceOff: offer.priceOff || "",
      expiryDate: offer.expiryDate
        ? new Date(offer.expiryDate).toISOString().slice(0, 10)
        : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      imageFile: null,
      priceOff: "",
      expiryDate: "",
    });
  };

  const submitEdit = async (id) => {
    try {
      setLoading(true);
      const payload = new FormData();
      if (editForm.title) payload.append("title", editForm.title);
      if (editForm.description)
        payload.append("description", editForm.description);
      if (editForm.imageFile) payload.append("image", editForm.imageFile);
      if (editForm.priceOff)
        payload.append("priceOff", String(editForm.priceOff));
      if (editForm.expiryDate)
        payload.append("expiryDate", editForm.expiryDate);

      const res = await api.patch(`/api/offers/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setOffers((prev) => prev.map((o) => (o._id === id ? res.data.offer : o)));
      toast.success("Offer updated");
      cancelEdit();
    } catch (err) {
      console.error("UPDATE OFFER ERROR:", err);
      toast.error(err.response?.data?.message || "Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    try {
      setLoading(true);
      await api.delete(`/api/offers/${id}`, { withCredentials: true });
      setOffers((prev) => prev.filter((o) => o._id !== id));
      toast.success("Offer deleted");
    } catch (err) {
      console.error("DELETE OFFER ERROR:", err);
      toast.error(err.response?.data?.message || "Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title
        title="Exclusive Offers"
        subTitle="Manage exclusive offers and promotions"
      />

      <div className="w-full mt-6 p-6 border border-gray-200 rounded">
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Offer title"
            className="border px-3 py-2 rounded"
          />

          <input
            name="priceOff"
            value={form.priceOff}
            onChange={onChange}
            placeholder="Price off (e.g., 20 for 20%)"
            className="border px-3 py-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Short description"
            className="border px-3 py-2 rounded md:col-span-2"
          />

          <input
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={onChange}
            className="border px-3 py-2 rounded"
          />

          <input
            name="expiryDate"
            value={form.expiryDate}
            onChange={onChange}
            type="date"
            className="border px-3 py-2 rounded"
          />

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Offer"}
            </button>
          </div>
        </form>

        <h4 className="text-md font-medium mb-2">Existing Offers</h4>

        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.length === 0 && <p className="text-sm">No offers yet.</p>}
          {offers.map((o) => (
            <div
              key={o._id}
              className="border p-3 rounded flex gap-3 items-start"
            >
              {o.image ? (
                <img
                  src={getImageUrl(o.image)}
                  alt="offer image"
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{o.title}</h5>
                  <span className="text-sm text-gray-500">
                    {o.priceOff ? `${o.priceOff}%` : ""}
                  </span>
                </div>
                {editingId === o._id ? (
                  <div className="mt-2">
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={onEditChange}
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={onEditChange}
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <input
                      name="priceOff"
                      value={editForm.priceOff}
                      onChange={onEditChange}
                      className="border px-2 py-1 rounded mb-2"
                      placeholder="Price off"
                    />
                    <input
                      name="expiryDate"
                      type="date"
                      value={editForm.expiryDate}
                      onChange={onEditChange}
                      className="border px-2 py-1 rounded mb-2"
                    />
                    <input
                      name="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={onEditChange}
                      className="border px-2 py-1 rounded mb-2"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => submitEdit(o._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-200 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">{o.description}</p>
                    {o.expiryDate && (
                      <p className="text-xs text-gray-400">
                        Expires: {new Date(o.expiryDate).toDateString()}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-2">
                <button
                  onClick={() => startEdit(o)}
                  className="text-sm text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteOffer(o._id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
