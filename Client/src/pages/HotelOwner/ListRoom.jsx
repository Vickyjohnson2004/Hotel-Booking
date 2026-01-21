import React, { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import api from "../../services/api";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const ListRoom = () => {
  const { user } = useContext(AppContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user || !user.hotel) {
        setRooms([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/api/rooms/hotel/${user.hotel}`, {
          withCredentials: true,
        });

        setRooms(res.data.rooms || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  const apiBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
  const backendOrigin = apiBase.replace(/\/api\/?$/, "");
  const getImageUrl = (img) => {
    if (!img) return assets.uploadArea;
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    return `${backendOrigin}${img}`;
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit or manage all listed rooms. Keep the information Up-to-date to provide the best experience for users."
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-4xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto mt-4">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No rooms found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xl">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
                <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                  Facility
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium">
                  Price / Night
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="text-lg">
              {rooms.map((item) => (
                <tr key={item._id}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 flex items-center gap-3">
                    <img
                      src={getImageUrl(item.images?.[0])}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.uploadArea;
                      }}
                      alt={item.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">
                        {item.maxGuests} guests
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.amenities?.join(", ")}
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    ${item.price}
                  </td>

                  <td className="py-3 px-4 border-t border-gray-300 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        item.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListRoom;
