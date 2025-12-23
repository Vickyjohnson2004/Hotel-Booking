import Newsletter from "../models/Newsletter.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing)
      return res.status(200).json({ message: "Already subscribed" });

    const n = await Newsletter.create({ email });
    res.status(201).json({ status: "success", newsletter: n });
  } catch (error) {
    console.error("NEWSLETTER ERROR:", error);
    res.status(500).json({ message: "Failed to subscribe" });
  }
};
