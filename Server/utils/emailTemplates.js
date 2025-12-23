export const bookingConfirmationEmail = ({
  name,
  hotelName,
  roomType,
  checkIn,
  checkOut,
  totalPrice,
}) => `
  <div style="font-family: Arial; line-height: 1.6">
    <h2>Booking Confirmed 🎉</h2>
    <p>Hello <b>${name}</b>,</p>

    <p>Your hotel booking has been successfully placed.</p>

    <ul>
      <li><b>Hotel:</b> ${hotelName}</li>
      <li><b>Room:</b> ${roomType}</li>
      <li><b>Check-in:</b> ${new Date(checkIn).toDateString()}</li>
      <li><b>Check-out:</b> ${new Date(checkOut).toDateString()}</li>
      <li><b>Total:</b> ₦${totalPrice}</li>
    </ul>

    <p>Thank you for choosing us.</p>
    <p><b>Hotel Booking Team</b></p>
  </div>
`;
