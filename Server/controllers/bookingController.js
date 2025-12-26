import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import { bookingConfirmationEmail } from "../utils/emailTemplates.js";
import { sendBookingConfirmation } from "../utils/email.js";

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    // Server-side availability check to prevent double-booking
    const { room, checkIn, checkOut } = req.body;
    const conflict = await Booking.findOne({
      room,
      status: { $ne: "cancelled" },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "Selected dates are not available" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: req.body.room,
      hotel: req.body.hotel,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests,
      totalPrice: req.body.totalPrice,
    });

    // populate for email
    const populatedBooking = await booking.populate([
      { path: "hotel", select: "name" },
      { path: "room", select: "title" },
    ]);

    // Send email (DO NOT block booking if it fails)
    try {
      await sendBookingConfirmation({
        userEmail: req.user.email,
        bookingId: booking._id,
        name: req.user.username || req.user.email,
        hotelName: populatedBooking.hotel?.name,
        roomType: populatedBooking.room?.title,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
      });
    } catch (err) {
      console.warn("Booking created but email failed:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Booking failed",
    });
  }
};

/* ================= USER BOOKINGS ================= */
export const getMyBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({ user: req.user._id })
      .populate("room", "title price images")
      .populate("hotel", "name city address")
      .sort("-createdAt");

    // Provide a convenient alias the frontend expects: `room.roomType` -> map from `title`
    bookings = bookings.map((b) => {
      const obj = b.toObject();
      if (obj.room) obj.room.roomType = obj.room.title;
      return obj;
    });

    res.json({
      status: "success",
      results: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET USER BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/* ================= HOTEL BOOKINGS (OWNER) ================= */
export const getHotelBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({ hotel: req.params.hotelId })
      .populate("room", "title price")
      .populate("user", "username email")
      .sort("-createdAt");

    // map room.title to roomType for frontend compatibility
    bookings = bookings.map((b) => {
      const obj = b.toObject();
      if (obj.room) obj.room.roomType = obj.room.title;
      return obj;
    });

    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );

    res.json({
      status: "success",
      results: bookings.length,
      totalRevenue,
      bookings,
    });
  } catch (error) {
    console.error("GET HOTEL BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hotel bookings" });
  }
};

/* ================= UPDATE BOOKING STATUS ================= */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["confirm", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      status: "success",
      booking,
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update booking" });
  }
};

// // stripe payment
// export const stripePayment = async (req, res) => {
//   try {
//     const { bookingId } = req.body;
//     const booking = await Booking.findById(bookingId);
//     const roomData = await Room.findById(booking.room).populate("hotel");
//     const totalPrice = booking.totalPrice;
//     const { origin } = req.headers;
//   } catch (error) {}
// };
