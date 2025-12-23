import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomDetails,
  getHotelRooms,
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { uploadRoomImages } from "../middleware/uploadRoomImages.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getAllRooms);
router.get("/:id", getRoomDetails);

/* ADMIN */
router.post(
  "/",
  protect,
  restrictTo("admin"),
  uploadRoomImages.array("images", 4),
  createRoom
);
router.get("/hotel/:hotelId", protect, restrictTo("admin"), getHotelRooms);

export default router;
