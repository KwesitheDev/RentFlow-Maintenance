const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded.id !== "string") throw new Error("Invalid identity");
    const user = await require("../models/User")
      .findById(decoded.id)
      .select("name role");
    if (!user) return res.status(401).json({ message: "Account unavailable" });
    req.user = { id: user.id, role: user.role, name: user.name };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
