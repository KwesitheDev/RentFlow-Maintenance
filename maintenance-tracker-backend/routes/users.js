const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// edit user details (name, email)
router.put("/:id", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      const existing = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }
    if (role && !["admin", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    res.json({
      id: user.id,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    if (role && !["admin", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ message: "User already exists" });
    user = new User({ name, email, password, role: role || "manager" });
    await user.save();
    res.status(201).json({
      id: user.id,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
