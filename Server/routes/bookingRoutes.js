import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkRoomAvailability } from "../controllers/roomController.js";

import {
  createBooking,
  getMyBookings,
  getHotelBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

/* User */
router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);

// Availability check (no auth required so users can check before login)
router.get("/availability", checkRoomAvailability);

/* Hotel Owner */
router.get("/hotel/:hotelId", protect, getHotelBookings);
router.patch("/:id/status", protect, updateBookingStatus);

export default router;
