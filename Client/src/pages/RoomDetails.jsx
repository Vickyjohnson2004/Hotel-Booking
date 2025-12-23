import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import api from "../services/api";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/media";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  // Booking form state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoadingRoom(true);
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.room);
        setMainImage(getImageUrl(res.data.room.images?.[0] || null));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load room details");
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchRoom();
  }, [id]);

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>

        {/* Room Rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">200+ reviews</p>
        </div>

        {/* Room Address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="locationIcon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* Room Images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="mainImage room image"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="room image"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>

            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Room Price */}
          <p className="text-2xl font-medium">${room.price}/night</p>
        </div>

        {/* CheckIn CheckOut Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!checkIn || !checkOut)
              return toast.error("Please select check-in and check-out dates");
            const ci = new Date(checkIn);
            const co = new Date(checkOut);
            if (ci >= co)
              return toast.error("Check-out must be after check-in");
            if (Number(guests) < 1)
              return toast.error("Guests must be at least 1");

            try {
              setBookingLoading(true);
              // Check availability
              const avail = await api.get(
                `/bookings/availability?roomId=${id}&checkIn=${checkIn}&checkOut=${checkOut}`
              );

              if (!avail.data.available) {
                toast.error("Room is not available for selected dates");
                return;
              }

              const msPerDay = 1000 * 60 * 60 * 24;
              const nights = Math.round((co - ci) / msPerDay);

              if (nights <= 0) return toast.error("Invalid date range");

              const totalPrice = nights * (room.price || 0);

              // Create booking
              await api.post(
                "/bookings",
                {
                  room: room._id,
                  hotel: room.hotel._id,
                  checkIn,
                  checkOut,
                  guests: Number(guests),
                  totalPrice,
                },
                { withCredentials: true }
              );

              toast.success("Booking successful!");
              navigate("/my-bookings");
            } catch (err) {
              console.error(err);
              if (err.response?.status === 409) {
                toast.error(
                  err.response.data.message ||
                    "Selected dates are not available"
                );
              } else {
                toast.error("Failed to create booking");
              }
            } finally {
              setBookingLoading(false);
            }
          }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* Check Out */}
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="Check-Out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* Guest */}
            <div className="flex flex-col">
              <label htmlFor="guest" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                id="guest"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="0"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>
          <button
            className=" bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
            type="submit"
            disabled={bookingLoading}
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </form>

        {/* Commom Specicification */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div className="flex items-center gap-2" key={index}>
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5 "
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Guest will be allocated on the ground floor according to
            availabilty. you get a comfortable Two bedroom apartment has a true
            city feeling. The price quoted is for two guest, at the guest slot
            please mark the number of guests to get the exact price for two
            groups. The Guests will be allocated ground floor according to
            availability. You get the comfortable two bedroom - apartment that
            has a true city feeling.
          </p>
        </div>

        {/* Hosted By */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={
                getImageUrl(room.hotel.images?.[0] || null) || assets.userIcon
              }
              alt="Host"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full object-cover"
            />
            <div>
              <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2">200+ Reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer ">
            Contact Now
          </button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
