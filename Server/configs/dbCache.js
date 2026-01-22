// MongoDB connection cache for Vercel serverless functions
let cachedConnection = null;

const connectWithRetry = async () => {
  try {
    // Use cached connection if available (speeds up subsequent requests)
    if (cachedConnection && cachedConnection.readyState === 1) {
      console.info("♻️ Using cached MongoDB connection");
      return cachedConnection;
    }

    console.info("🔄 Establishing MongoDB connection...");

    const mongoose = (await import("mongoose")).default;

    if (!process.env.MONGODB_URL) {
      throw new Error("❌ MONGODB_URL not set in environment variables");
    }

    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 1,
      retryWrites: true,
      w: "majority",
      family: 4, // Force IPv4 (sometimes IPv6 causes issues on Vercel)
    });

    cachedConnection = connection;
    console.info("✅ MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", {
      message: error.message,
      code: error.code,
      mongoURL: process.env.MONGODB_URL ? "[SET]" : "[NOT SET]",
    });
    throw error;
  }
};

export default connectWithRetry;
