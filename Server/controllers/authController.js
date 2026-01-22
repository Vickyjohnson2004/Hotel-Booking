import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import Hotel from "../models/Hotel.js";

/* ================= TOKEN HELPER ================= */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);

  // Attach cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Prepare user object and include hotel if exists
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  const hotel = await Hotel.findOne({ owner: user._id }).select("_id name");
  userObj.hotel = hotel ? hotel._id : null;

  res.status(statusCode).json({
    status: "success",
    token: token, // ✅ Send token in response for localStorage
    user: userObj,
  });
};

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  const user = await User.create({
    _id: crypto.randomUUID(),
    username,
    email,
    password,
    role: role || "user",
    image: "default.png",
    authProvider: "local",
  });

  await sendToken(user, 201, res);
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  await sendToken(user, 200, res);
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
};

/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  try {
    // req.user is set by the 'protect' middleware
    if (!req.user) {
      return res.status(401).json({ status: "fail", message: "Not logged in" });
    }

    // Attach the user's hotel (if any) so the client can check ownership
    const hotel = await Hotel.findOne({ owner: req.user._id }).select(
      "_id name",
    );

    const userObj = req.user.toObject();
    userObj.hotel = hotel ? hotel._id : null;

    res.status(200).json({
      status: "success",
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // 🔥 Hook this to Nodemailer later
  console.log("Reset URL:", resetURL);

  res.json({ message: "Password reset link sent" });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  await sendToken(user, 200, res);
};

/* ================= UPDATE PASSWORD ================= */
export const updatePassword = async (req, res) => {
  const user = req.user; // assumes protect middleware attaches req.user

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password required" });
  }

  // Verify current password
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Send updated token
  await sendToken(user, 200, res);
};
