// models/BookingModel.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    guests: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Pay At Hotel",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🚨 Prevent invalid date ranges
bookingSchema.pre("save", function (next) {
  if (this.checkIn >= this.checkOut) {
    return next(new Error("Check-out must be after check-in"));
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);
