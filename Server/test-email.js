// test-email.js
import { sendBookingConfirmation } from "./utils/email.js";

const testBooking = {
  userEmail: "okikevictorodinaka@gmail.com", // Your recipient email
  name: "Victor",
  hotelName: "Luxe Haven Resort",
  roomType: "Deluxe Ocean View",
  checkIn: new Date(),
  checkOut: new Date(Date.now() + 86400000 * 2), // 2 days from now
  totalPrice: 125000,
};

console.log("🚀 Starting email test...");

sendBookingConfirmation(testBooking)
  .then((result) => {
    console.log("✅ SUCCESS! Email sent.");
    console.log("Message ID:", result.info.messageId);
  })
  .catch((err) => {
    console.error("❌ FAILED!");
    console.error("Error Detail:", err.message);
  });
