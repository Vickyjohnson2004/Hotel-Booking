import React, { useEffect, useState } from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import api from "../services/api";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/media";

const ExclusiveOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/offers");
        setOffers(res.data.offers || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgetable memories."
        />
        <button className="group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12">
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="group-hover:translate-x-1 transition-all"
          />
        </button>
      </div>

      {/*  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          offers.map((item) => (
            <div
              key={item._id}
              className="group relative flex flex-col items-start justify-center gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
            >
              <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
                {item.priceOff}% OFF
              </p>
              <div>
                <p className="text-2xl font-medium font-playfair">
                  {item.title}
                </p>
                <p>{item.description}</p>
                <p className="text-xs text-white/70 mt-3">
                  Expires {new Date(item.expiryDate).toDateString()}
                </p>
              </div>
              <button className="group flex items-center mt-4 mb-5 gap-2 font-medium cursor-pointer max-md:mt-12">
                View All Offers
                <img
                  src={assets.arrowIcon}
                  alt="arrow-icon"
                  className="group-hover:translate-x-1 transition-all invert brightness-0"
                />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
