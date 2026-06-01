const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { authMiddleware } = require("../middleware/auth");

const sanitizeUser = (user) => ({
  id: user.id,
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userCount = await User.countDocuments();
    user = new User({
      name,
      email,
      password,
      role: userCount === 0 ? "admin" : "manager",
    });
    await user.save();

    const token = signToken(user);

    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    console.error(err.stack);
    res.status(500).json({
      message: "Server error during registration",
      detail: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    console.error(err.stack);
    res
      .status(500)
      .json({ message: "Server error during login", detail: err.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.user.id },
    });
    if (existing) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name;
    user.email = email;
    await user.save();

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error updating profile" });
  }
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error changing password" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({
        message: "If that email exists, a reset code has been created.",
      });
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.json({
      message: "Reset code created. Use it to set a new password.",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error creating reset code" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, reset code and new password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset code is invalid or expired" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error resetting password" });
  }
});

module.exports = router;
