import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/rooms?limit=4");
        setRooms(res.data.rooms || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load featured destinations");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Featured Destination"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparallel luxury and unforgetable experiences."
      />
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          rooms.map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))
        )}
      </div>

      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View All Destinations
      </button>
    </div>
  );
};

export default FeaturedDestination;
