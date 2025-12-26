import Hotel from "../models/Hotel.js";
import cloudinary from "../configs/cloudinary.js";

/* ================= CREATE HOTEL ================= */
export const createHotel = async (req, res) => {
  try {
    const { name, city, address, description, amenities } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !city || !address) {
      return res
        .status(400)
        .json({ message: "Name, city, and address are required" });
    }

    // 2️⃣ Parse amenities safely
    const hotelAmenities = amenities ? JSON.parse(amenities) : [];

    // 3️⃣ Validate images
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one hotel image is required" });
    }

    // 4️⃣ Upload images to Cloudinary
    const hotelImages = [];

    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "hotels",
        }
      );

      hotelImages.push(uploadResult.secure_url);
    }

    // 5️⃣ Create hotel
    const hotel = await Hotel.create({
      owner: req.user._id,
      name,
      city,
      address,
      description: description || "",
      amenities: hotelAmenities,
      images: hotelImages,
    });

    res.status(201).json({ status: "success", hotel });
  } catch (error) {
    console.error("CREATE HOTEL ERROR:", error);
    res.status(500).json({ message: "Failed to create hotel" });
  }
};

/* ================= GET OWNER HOTELS ================= */
export const getOwnerHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id });
    res.json({ status: "success", results: hotels.length, hotels });
  } catch (error) {
    console.error("GET OWNER HOTELS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};
