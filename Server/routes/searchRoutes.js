import express from "express";
import {
  addSearchedCity,
  searchRooms,
} from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/search-city", protect, addSearchedCity);
router.get("/", searchRooms);

export default router;
