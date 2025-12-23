import express from "express";
import { createHotel, getOwnerHotels } from "../controllers/hotelController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { uploadHotelImages } from "../middleware/uploadHotelImages.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

// Multer parses FormData
router.post("/", uploadHotelImages.array("images", 4), createHotel);
router.get("/my-hotels", getOwnerHotels);

export default router;
