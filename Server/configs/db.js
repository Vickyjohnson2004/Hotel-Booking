import mongoose, { Mongoose } from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect();
  } catch (error) {}
};
