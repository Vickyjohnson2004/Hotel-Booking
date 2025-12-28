import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

/* ================= CREATE ROOM ================= */
export const createRoom = async (req, res) => {
  try {
    // 🔐 Find the hotel owned by the logged-in user
    const ownedHotel = await Hotel.findOne({ owner: req.user._id });

    if (!ownedHotel) {
      return res.status(403).json({ message: "You don't own a hotel yet" });
    }

    const { roomType, pricePerNight, maxGuests, amenities } = req.body;

    // 🖼️ Extract uploaded image paths
    const images = req.files
      ? req.files.map((file) => `/uploads/rooms/${file.filename}`)
      : [];

    // Require at least one image for a room
    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one room image is required" });
    }

    const room = await Room.create({
      hotel: ownedHotel._id, // use backend-found hotel
      title: roomType,
      price: pricePerNight,
      maxGuests,
      images,
      amenities: amenities ? JSON.parse(amenities) : [],
      isAvailable: true,
    });

    res.status(201).json({ status: "success", room });
  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    res.status(500).json({ message: "Failed to create room" });
  }
};

/* ================= GET ALL ROOMS ================= */
export const getAllRooms = async (req, res) => {
  try {
    // Support optional query params: limit, city, sort
    const { limit, city, sort } = req.query;

    let query = { isAvailable: true };
    if (city) query["city"] = city;

    let q = Room.find(query).populate("hotel", "name city images");

    if (sort === "price_asc") q = q.sort("price");
    else if (sort === "price_desc") q = q.sort("-price");
    else q = q.sort("-createdAt");

    if (limit) q = q.limit(Number(limit));

    const rooms = await q.exec();

    res.json({
      status: "success",
      results: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("GET ALL ROOMS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

/* ================= ROOM DETAILS ================= */
export const getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel");

    if (!room) {
      // Add success: false here
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    res.json({
      success: true, // <--- CHANGE THIS FROM status: "success"
      room,
    });
  } catch (error) {
    console.error("GET ROOM DETAILS ERROR:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch room details" });
  }
};

/* ================= HOTEL ROOMS (OWNER) ================= */
export const getHotelRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId });

    res.json({
      status: "success",
      results: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("GET HOTEL ROOMS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hotel rooms" });
  }
};

/* ================= CHECK ROOM AVAILABILITY ================= */
export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "roomId, checkIn and checkOut are required",
      });
    }

    const overlappingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: "cancelled" },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    res.json({
      success: true, // <--- CHANGE THIS FROM status: "success"
      available: !overlappingBooking,
    });
  } catch (error) {
    console.error("CHECK AVAILABILITY ERROR:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to check room availability" });
  }
};
