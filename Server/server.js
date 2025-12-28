// server.js (top)
import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // MUST be first

import express from "express";
import cors from "cors";
import fs from "fs";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import path from "path";

// Load .env: prefer workspace root .env, fallback to Server/.env
const rootEnv = path.resolve(process.cwd(), "..", ".env");
const serverEnv = path.resolve(process.cwd(), ".env");
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
  console.info("Loaded environment variables from root .env");
} else if (fs.existsSync(serverEnv)) {
  dotenv.config({ path: serverEnv });
  console.info("Loaded environment variables from Server/.env");
} else {
  dotenv.config(); // default behavior
  console.info("No .env found in root or Server; loaded defaults if any");
}

// Warn about duplicate .env files that can be confusing. Prefer a single root .env.
const clientEnv = path.resolve(process.cwd(), "..", "Client", ".env");
const duplicates = [];
if (fs.existsSync(rootEnv)) duplicates.push("root .env");
if (fs.existsSync(serverEnv)) duplicates.push("Server/.env");
if (fs.existsSync(clientEnv)) duplicates.push("Client/.env");
if (duplicates.length > 1) {
  console.warn(
    "Multiple .env files detected (",
    duplicates.join(", "),
    "). Recommended: use only one root .env and remove others to avoid confusion. See Client/README.md for details."
  );
}

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
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // important for cookies
  })
);
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
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
  });
});

// ================= ERROR HANDLING =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
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
