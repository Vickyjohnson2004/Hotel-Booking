import express from "express";
import {
  getTestimonials,
  createTestimonial,
  getAllTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getTestimonials);
router.post("/", createTestimonial);

// Admin-only
router.get("/all", protect, restrictTo("admin"), getAllTestimonials);
router.patch("/:id/approve", protect, restrictTo("admin"), approveTestimonial);
router.delete("/:id", protect, restrictTo("admin"), deleteTestimonial);

export default router;
