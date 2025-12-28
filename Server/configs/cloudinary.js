// import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;
import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_URL) {
  console.error("❌ CLOUDINARY_URL missing in .env");
  throw new Error("Cloudinary environment variables missing");
}

cloudinary.config(); // no params needed, CLOUDINARY_URL is enough
console.log("Cloudinary initialized successfully");

export default cloudinary;
