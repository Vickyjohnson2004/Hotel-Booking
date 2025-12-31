// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import path from "path";

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

app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // 2. Dynamic check: Allow localhost OR any Vercel domain
      const isAllowed =
        origin.includes("localhost") || origin.includes("vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked Origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

/**
 * EXPRESS 5 FIX:
 * Handles browser preflight (OPTIONS) requests.
 * Using regex /(.*)/ for Express 5 compatibility.
 */
app.options(/(.*)/, cors());

app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================

// Health Checks (Useful for Vercel monitoring)
app.get("/", (req, res) => res.send("API is working 🚀"));
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
  });
});

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

// ================= ERROR HANDLING =================

// Catch-all for undefined routes
app.all(/(.*)/, (req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.url} not found on this server.` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
