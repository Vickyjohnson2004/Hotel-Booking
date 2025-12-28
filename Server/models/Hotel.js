// models/Hotel.js
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
