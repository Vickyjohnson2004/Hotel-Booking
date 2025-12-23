import Hotel from "../models/Hotel.js";

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

    // 2️⃣ Handle optional fields
    const hotelAmenities = amenities ? JSON.parse(amenities) : [];
    const hotelImages = req.files
      ? req.files.map((f) => `/uploads/hotels/${f.filename}`)
      : [];

    // Require at least one hotel image
    if (!hotelImages || hotelImages.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one hotel image is required" });
    }

    // 3️⃣ Create hotel
    const hotel = await Hotel.create({
      owner: req.user._id, // make sure Hotel model has owner: String if _id is UUID
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

/* ================= GET ADMIN HOTELS ================= */
export const getOwnerHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id });
    res.json({ status: "success", results: hotels.length, hotels });
  } catch (error) {
    console.error("GET OWNER HOTELS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};
