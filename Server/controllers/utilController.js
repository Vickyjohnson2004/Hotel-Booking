import { sendEmail } from "../utils/email.js";

export const sendTestEmail = async (req, res) => {
  try {
    const to = req.body.to || process.env.EMAIL_TEST_TO || req.user?.email;
    if (!to)
      return res.status(400).json({ message: "Recipient email required" });

    const { info, preview } = await sendEmail({
      to,
      subject: "Test Email from Hotel Booking",
      html: `<p>This is a test email sent at ${new Date().toISOString()}</p>`,
    });

    res.json({ status: "success", messageId: info?.messageId, preview });
  } catch (err) {
    console.error("SEND TEST EMAIL ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to send test email", error: err.message });
  }
};
