// routes/userRoutes.js
import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateRole,
} from "../controllers/UserController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // all routes protected

router.get("/", restrictTo("admin"), getUsers); // admin only
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", restrictTo("admin"), deleteUser);

router.patch("/update-role/:id", protect, restrictTo("admin"), updateRole);

export default router;
