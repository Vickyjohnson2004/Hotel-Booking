import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fs from "fs";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import path from "path";

// Initialize dotenv - Vercel handles this automatically in production,
// but this keeps it working locally.
dotenv.config();

// Import routes
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import utilRoutes from "./routes/utilRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";

const app = express();

// Connect to MongoDB
connectDB();

// ================= MIDDLEWARES =================

const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-eight-ashen.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const isVercelPreview = origin.endsWith(".vercel.app");

      if (allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        console.error(`CORS Error: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Handle preflight requests globally
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/utils", utilRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/newsletter", newsletterRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => res.send("API is working 🚀"));
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running" });
});

// ================= ERROR HANDLING =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  // If CORS error, handle it gracefully
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

export default app; // Required for Vercel
