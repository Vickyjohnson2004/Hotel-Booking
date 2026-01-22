import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    console.log("🔄 Connecting to MongoDB...");

    // Connect to MongoDB with extended timeout settings for Vercel cold starts
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000, // 30 seconds for Vercel cold start
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 1,
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected successfully");

    // Optional: log disconnections
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("MONGODB_URL:", process.env.MONGODB_URL ? "Set" : "Not set");
    // Don't exit on Vercel - let functions handle the error
    if (process.env.VERCEL !== "1") {
      process.exit(1); // Stop the server if DB fails locally
    }
  }
};

export default connectDB;
