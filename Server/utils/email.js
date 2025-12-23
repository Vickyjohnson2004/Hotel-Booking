import nodemailer from "nodemailer";

// Email configuration
// For Brevo (smtp-relay.brevo.com) set these in your .env:
// SMTP_HOST=smtp-relay.brevo.com
// SMTP_PORT=587
// SMTP_USER=apikey
// SMTP_PASS=<your_brevo_smtp_api_key>
// MAIL_FROM="Hotel Booking" <no-reply@yourdomain.com>
// Optional: SMTP_SECURE=true (for port 465)
// The code will default SMTP_USER to 'apikey' if you provide SMTP_PASS but omit SMTP_USER.
const smtpHost = process.env.SMTP_HOST || "smtp-relay.brevo.com";
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpSecure =
  process.env.SMTP_SECURE === "true" || smtpPort === 465 ? true : false;
let smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

// Brevo often uses username 'apikey' with the API key as password — default if user omitted
if (!smtpUser && smtpPass) smtpUser = "apikey";

const transporterOptions = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
};

if (smtpUser || smtpPass) {
  transporterOptions.auth = { user: smtpUser, pass: smtpPass };
}

const transporter = nodemailer.createTransport(transporterOptions);

// Sanity checks: warn early if credentials are missing and verify transporter
if (!smtpPass) {
  console.warn(
    "[email] SMTP_PASS not set — outgoing emails will fail (Brevo needs an API key as password)."
  );
} else {
  transporter
    .verify()
    .then(() => console.info("[email] SMTP transporter is ready"))
    .catch((err) => {
      console.warn(
        "[email] SMTP transporter verification failed:",
        err && err.message ? err.message : err
      );
      // If using Brevo and you provided an API key, double-check that SMTP_USER is 'apikey' and SMTP_PASS is the API key value
      if ((smtpUser || "") !== "apikey") {
        console.info(
          "[email] Tip: For Brevo, set SMTP_USER=apikey and SMTP_PASS=<your_api_key>"
        );
      }
    });
}

import Booking from "../models/Booking.js";
import { bookingConfirmationEmail } from "./emailTemplates.js";

/**
 * Generic email sender
 * Returns { info, preview } where preview is available for test transports (ethereal)
 */
export const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!to) throw new Error("Recipient 'to' is required");

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
  const preview = nodemailer.getTestMessageUrl
    ? nodemailer.getTestMessageUrl(info)
    : undefined;
  return { info, preview };
};

/* ================= SEND BOOKING EMAIL ================= */
export const sendBookingConfirmation = async ({
  userEmail,
  bookingId,
  name,
  hotelName,
  roomType,
  checkIn,
  checkOut,
  totalPrice,
}) => {
  try {
    // If a bookingId is provided, fetch booking to get missing details
    if (bookingId) {
      const booking = await Booking.findById(bookingId)
        .populate("hotel", "name")
        .populate("room", "title")
        .populate("user", "username email");

      if (booking) {
        name = name || booking.user?.username || "Guest";
        hotelName = hotelName || booking.hotel?.name || "Hotel";
        roomType = roomType || booking.room?.title || "Room";
        checkIn = checkIn || booking.checkIn;
        checkOut = checkOut || booking.checkOut;
        totalPrice = totalPrice || booking.totalPrice;
        userEmail = userEmail || booking.user?.email;
      }
    }

    if (!userEmail) {
      console.warn("[email] No recipient email provided — skipping send");
      return;
    }

    const html = bookingConfirmationEmail({
      name: name || "Guest",
      hotelName: hotelName || "Hotel",
      roomType: roomType || "Room",
      checkIn,
      checkOut,
      totalPrice: totalPrice || 0,
    });

    const { info } = await sendEmail({
      to: userEmail,
      subject: "Booking Confirmation",
      text: `Your booking (${bookingId || ""}) has been confirmed.`,
      html,
    });

    return info;
  } catch (error) {
    console.error(
      "Email send failed:",
      error && error.message ? error.message : error
    );
    throw new Error("Email could not be sent");
  }
};
