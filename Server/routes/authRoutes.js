import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  getMe, // ✅ import getMe
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);

router.get("/logout", logout);

// ✅ new route to get current logged-in user
router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", protect, updatePassword);

export default router;
