import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Try to get token from Authorization header first
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("✅ Token from Authorization header");
    }

    // 2️⃣ Fallback to cookie
    if (!token && req.cookies.token) {
      token = req.cookies.token;
      console.log("✅ Token from cookie");
    }

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
