import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendTestEmail } from "../controllers/utilController.js";

const router = express.Router();

// Protected test endpoint to verify SMTP settings. If you want it public, remove `protect`.
router.post("/email-test", protect, sendTestEmail);

export default router;
