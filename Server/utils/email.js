import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- FIX FOR ENVIRONMENT LOADING ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// This tells Node to look for .env in the folder ABOVE 'utils'
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const getTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || "smtp-relay.brevo.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpPass = process.env.SMTP_PASS;
  const smtpUser = process.env.SMTP_USER || "apikey";

  // Debugging log - you can remove this after it works
  if (!smtpPass) {
    console.error("DEBUG: Current Folder:", process.cwd());
    throw new Error("SMTP_PASS is not defined in environment variables.");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // Brevo uses STARTTLS on 587, so secure must be false
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!to) throw new Error("Recipient 'to' is required");

  const transporter = getTransporter();

  const mailOptions = {
    from:
      from ||
      process.env.MAIL_FROM ||
      '"Hotel Booking" <no-reply@yourdomain.com>',
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { info };
};

export const sendBookingConfirmation = async ({
  userEmail,
  name,
  hotelName,
  roomType,
  checkIn,
  checkOut,
  totalPrice,
}) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1a73e8;">Booking Confirmed 🎉</h2>
        <p>Hello <b>${name || "Guest"}</b>,</p>
        <p>Your hotel booking has been successfully placed.</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 5px;"><b>Hotel:</b> ${
              hotelName || "Our Resort"
            }</li>
            <li style="margin-bottom: 5px;"><b>Room:</b> ${
              roomType || "Standard Room"
            }</li>
            <li style="margin-bottom: 5px;"><b>Check-in:</b> ${new Date(
              checkIn
            ).toDateString()}</li>
            <li style="margin-bottom: 5px;"><b>Check-out:</b> ${new Date(
              checkOut
            ).toDateString()}</li>
            <li style="margin-bottom: 5px;"><b>Total Price:</b> ₦${
              totalPrice?.toLocaleString() || 0
            }</li>
          </ul>
        </div>
        <p>Thank you for choosing us!</p>
        <p><b>The Hotel Team</b></p>
      </div>
    `;

    return await sendEmail({
      to: userEmail,
      subject: `Booking Confirmation: ${hotelName}`,
      text: `Hi ${name}, your booking at ${hotelName} is confirmed!`,
      html,
    });
  } catch (error) {
    console.error("Email Service Error:", error.message);
    throw new Error(`Could not send confirmation email: ${error.message}`);
  }
};
