// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./configs/db.js";

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

/* ================= DATABASE ================= */
connectDB();

/* ================= CORS ================= */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl, mobile, Postman
      // ✅ allow all frontends on vercel
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      return callback(null, false); // block everything else
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= MIDDLEWARES ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.get("/", (req, res) => res.send("API is working 🚀"));
app.get("/api/health", (req, res) =>
  res.status(200).json({ status: "ok", message: "Backend is running" })
);

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

/* ================= 404 HANDLER ================= */
app.all(/(.*)/, (req, res) =>
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
);

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

/* ================= SERVER ================= */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
}

/* ================= EXPORT FOR VERCEL ================= */
export default app;
