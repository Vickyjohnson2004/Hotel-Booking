// ✅ uploadRoomImages.js
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "uploads/rooms";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    ),
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    cb(new Error("Only images allowed"), false);
  else cb(null, true);
};

export const uploadRoomImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
