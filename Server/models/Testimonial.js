import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    address: String,
    image: String,
    review: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    approved: { type: Boolean, default: false }, // needs admin approval before showing publicly
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
