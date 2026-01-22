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

// ================= CONNECT TO DATABASE =================
connectDB();

// ================= MIDDLEWARES =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked request from: ${origin}`);
        console.warn(`✅ Allowed origins: ${allowedOrigins.join(", ")}`);
        // In production, uncomment to strictly enforce CORS
        // callback(new Error("Not allowed by CORS"));
        // For debugging, allow the request
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);

app.options(/(.*)/, cors());

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
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API is working 🚀",
    environment: process.env.NODE_ENV,
    frontend: process.env.FRONTEND_URL,
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ================= ERROR HANDLING =================
app.all(/(.*)/, (req, res) => {
  console.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", {
    message: err.message,
    status: err.status || 500,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    message: err.message || "Server error",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// ================= START SERVER LOCALLY =================
// Only start listening if not running on Vercel (serverless)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
}

// ================= EXPORT FOR VERCEL =================
export default app;
