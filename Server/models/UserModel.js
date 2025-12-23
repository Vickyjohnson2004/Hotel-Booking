import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    image: { type: String, required: true },
    password: { type: String, minlength: 8, select: false },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    recentSearchedCities: [
      {
        city: {
          type: String,
          required: true,
          trim: true,
        },
        searchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

/* ================= HASH PASSWORD ================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ================= COMPARE PASSWORD ================= */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

/* ================= CREATE PASSWORD RESET TOKEN ================= */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
