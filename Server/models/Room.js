// models/Room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
    images: [String],
    amenities: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
