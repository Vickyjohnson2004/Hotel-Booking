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

router.get("/", getOffers);

router.post(
  "/",
  protect,
  restrictTo("admin"),
  uploadOfferImage.single("image"),
  createOffer
);

router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  uploadOfferImage.single("image"),
  updateOffer
);

router.delete("/:id", protect, restrictTo("admin"), deleteOffer);

export default router;
