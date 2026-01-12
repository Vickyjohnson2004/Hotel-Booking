import Offer from "../models/Offer.js";
import cloudinary from "../configs/cloudinary.js";

/* ================= GET OFFERS ================= */
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort("-createdAt");
    res.json({ status: "success", results: offers.length, offers });
  } catch (error) {
    console.error("GET /api/offers ERROR:", error); // log full error on Vercel
    res.status(500).json({
      message: "Failed to fetch offers",
      error: error.message, // send actual error to frontend for debugging
    });
  }
};

/* ================= CREATE OFFER ================= */
export const createOffer = async (req, res) => {
  try {
    const { title, description, priceOff, expiryDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Offer image is required",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "offers" }
    );

    const offer = await Offer.create({
      title,
      description,
      image: uploadResult.secure_url,
      priceOff: priceOff ? Number(priceOff) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    });

    res.status(201).json({ status: "success", offer });
  } catch (error) {
    console.error("CREATE OFFER ERROR:", error);
    res.status(500).json({ message: "Failed to create offer" });
  }
};

/* ================= UPDATE OFFER ================= */
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    const { title, description, priceOff, expiryDate } = req.body;

    if (title !== undefined) offer.title = title;
    if (description !== undefined) offer.description = description;
    if (priceOff !== undefined)
      offer.priceOff = priceOff ? Number(priceOff) : undefined;
    if (expiryDate !== undefined)
      offer.expiryDate = expiryDate ? new Date(expiryDate) : undefined;

    // Replace image if provided
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        { folder: "offers" }
      );

      offer.image = uploadResult.secure_url;
    }

    await offer.save();
    res.json({ status: "success", offer });
  } catch (error) {
    console.error("UPDATE OFFER ERROR:", error);
    res.status(500).json({ message: "Failed to update offer" });
  }
};

/* ================= DELETE OFFER ================= */
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    await Offer.deleteOne({ _id: req.params.id });

    res.json({ status: "success", message: "Offer deleted" });
  } catch (error) {
    console.error("DELETE OFFER ERROR:", error);
    res.status(500).json({ message: "Failed to delete offer" });
  }
};
