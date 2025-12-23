// utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token valid for 7 days
  });

  res.cookie("token", token, {
    httpOnly: true, // cannot be accessed by JS
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // allows frontend to send cookie cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};
