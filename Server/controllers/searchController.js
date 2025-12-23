import User from "../models/UserModel.js";
// controllers/searchController.js
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

/* ================= ADD SEARCHED CITY ================= */
export const addSearchedCity = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          recentSearchedCities: {
            $each: [{ city }],
            $slice: -5, // keep last 5 searches
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (error) {
    console.error("Add searched city error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SEARCH ROOMS BY CITY ================= */
export const searchRooms = async (req, res) => {
  const { city, checkIn, checkOut } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

  const hotels = await Hotel.find({ city });

  const hotelIds = hotels.map((h) => h._id);

  let rooms = await Room.find({ hotel: { $in: hotelIds }, isAvailable: true });

  // Filter by availability if dates provided
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const bookings = await Booking.find({
      room: { $in: rooms.map((r) => r._id) },
      status: "confirmed",
      $or: [{ checkIn: { $lt: end }, checkOut: { $gt: start } }],
    });

    const bookedRoomIds = bookings.map((b) => b.room.toString());
    rooms = rooms.filter((r) => !bookedRoomIds.includes(r._id.toString()));
  }

  res.json({
    status: "success",
    results: rooms.length,
    rooms,
  });
};
