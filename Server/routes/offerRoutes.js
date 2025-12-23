import express from "express";
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../controllers/offerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { uploadOfferImage } from "../middleware/uploadOfferImage.js";

const router = express.Router();

// Public list
router.get("/", getOffers);
// Only admins can create offers (single image upload required)
router.post(
  "/",
  protect,
  restrictTo("admin"),
  uploadOfferImage.single("image"),
  createOffer
);

// Edit offer (admin) - image optional
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  uploadOfferImage.single("image"),
  updateOffer
);

// Delete offer (admin)
router.delete("/:id", protect, restrictTo("admin"), deleteOffer);

export default router;
