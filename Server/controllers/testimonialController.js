import Testimonial from "../models/Testimonial.js";
import { sendEmail } from "../utils/email.js";

export const getTestimonials = async (req, res) => {
  try {
    // Only show approved testimonials to public
    const testimonials = await Testimonial.find({ approved: true })
      .sort("-createdAt")
      .limit(10);
    res.json({ status: "success", results: testimonials.length, testimonials });
  } catch (error) {
    console.error("GET /api/offers ERROR:", error); // log full error on Vercel
    res.status(500).json({
      message: "Failed to fetch offers",
      error: error.message, // send actual error to frontend for debugging
    });
  }
};

// Public submission endpoint - testimonial will be created as `approved: false`
export const createTestimonial = async (req, res) => {
  try {
    const { name, email, address, image, review, rating } = req.body;

    // Basic validation
    if (!name || !review) {
      return res.status(400).json({ message: "Name and review are required" });
    }

    const t = await Testimonial.create({
      name,
      email,
      address,
      image,
      review,
      rating: rating ? Number(rating) : 5,
      approved: false,
    });

    // Notify admin by email (non-blocking)
    (async () => {
      try {
        const adminEmail =
          process.env.TESTIMONIAL_ADMIN_EMAIL || process.env.EMAIL_TEST_TO;
        if (!adminEmail)
          return console.info(
            "No admin email configured for testimonial notifications"
          );

        const frontend = (
          process.env.FRONTEND_URL || "http://localhost:3000"
        ).replace(/\/$/, "");
        const approveLink = `${frontend}/admin/testimonials`;

        const html = `
          <p>New testimonial submitted by <strong>${t.name}</strong> (${
          t.email || "no email"
        })</p>
          <p>Rating: ${t.rating}</p>
          <p>Review: ${t.review}</p>
          <p><a href="${approveLink}">Open admin testimonials page</a> to approve or delete.</p>
        `;

        const { preview } = await sendEmail({
          to: adminEmail,
          subject: "New Testimonial Submitted - Action Required",
          html,
        });

        if (preview) console.info("Testimonial email preview:", preview);
      } catch (err) {
        console.warn("Failed to send testimonial notification", err.message);
      }
    })();

    console.info("New testimonial submitted for review:", t._id);

    res.status(201).json({
      status: "success",
      message: "Testimonial submitted and pending approval",
    });
  } catch (error) {
    console.error("CREATE TESTIMONIAL ERROR:", error);
    res.status(500).json({ message: "Failed to create testimonial" });
  }
};

// Admin: list all testimonials (including pending)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort("-createdAt");
    res.json({ status: "success", results: testimonials.length, testimonials });
  } catch (error) {
    console.error("GET ALL TESTIMONIALS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

// Admin: approve a testimonial
export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });

    testimonial.approved = true;
    await testimonial.save();

    res.json({ status: "success", testimonial });
  } catch (error) {
    console.error("APPROVE TESTIMONIAL ERROR:", error);
    res.status(500).json({ message: "Failed to approve testimonial" });
  }
};

// Admin: delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });

    await testimonial.remove();
    res.json({ status: "success", message: "Testimonial deleted" });
  } catch (error) {
    console.error("DELETE TESTIMONIAL ERROR:", error);
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
};
