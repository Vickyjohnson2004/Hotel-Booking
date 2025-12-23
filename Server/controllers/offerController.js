import fs from "fs";
import path from "path";
import Offer from "../models/Offer.js";

export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort("-createdAt");
    res.json({ status: "success", results: offers.length, offers });
  } catch (error) {
    console.error("GET OFFERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { title, description, priceOff, expiryDate } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Require an uploaded image
    if (!req.file) {
      return res.status(400).json({ message: "Offer image is required" });
    }

    const imagePath = `/uploads/offers/${req.file.filename}`;

    const offer = await Offer.create({
      title,
      description,
      image: imagePath,
      priceOff: priceOff ? Number(priceOff) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    });

    res.status(201).json({ status: "success", offer });
  } catch (error) {
    console.error("CREATE OFFER ERROR:", error);
    res.status(500).json({ message: "Failed to create offer" });
  }
};

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

    // If a new file uploaded, replace image and delete old
    if (req.file) {
      const newPath = `/uploads/offers/${req.file.filename}`;
      // delete old file if present and in uploads folder
      try {
        if (offer.image && offer.image.startsWith("/uploads/offers/")) {
          const oldFile = path.join(process.cwd(), offer.image);
          if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
        }
      } catch (err) {
        console.warn("Failed to delete old offer image:", err.message || err);
      }
      offer.image = newPath;
    }

    await offer.save();
    res.json({ status: "success", offer });
  } catch (error) {
    console.error("UPDATE OFFER ERROR:", error);
    res.status(500).json({ message: "Failed to update offer" });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    // delete image file
    try {
      if (offer.image && offer.image.startsWith("/uploads/offers/")) {
        const filePath = path.join(process.cwd(), offer.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn(
        "Failed to delete offer image on removal:",
        err.message || err
      );
    }

    await Offer.deleteOne({ _id: req.params.id });
    res.json({ status: "success", message: "Offer deleted" });
  } catch (error) {
    console.error("DELETE OFFER ERROR:", error);
    res.status(500).json({ message: "Failed to delete offer" });
  }
};
