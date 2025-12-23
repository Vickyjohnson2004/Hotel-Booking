import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: String, // UUID string from your auth system
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

export default mongoose.model("Hotel", hotelSchema);
