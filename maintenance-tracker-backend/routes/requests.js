const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware);

const allowed = [
  "tenantName",
  "property",
  "issueDescription",
  "priority",
  "status",
  "assignedTo",
  "notes",
];
function validateBody(req, res, next) {
  if (!req.body || Object.keys(req.body).some((k) => !allowed.includes(k)))
    return res.status(400).json({ message: "Unsupported request field" });
  for (const [key, value] of Object.entries(req.body)) {
    if (key === "notes") {
      if (
        !Array.isArray(value) ||
        value.length > 100 ||
        value.some((n) => typeof n !== "string" || n.length > 2000)
      )
        return res.status(400).json({ message: "Invalid notes" });
    } else if (typeof value !== "string" || value.length > 2000)
      return res.status(400).json({ message: "Invalid request field" });
  }
  next();
}
router.post("/", validateBody, async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: "Invalid maintenance request" });
  }
});

router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 }).limit(500);
    res.json(requests);
  } catch (err) {
    res.status(400).json({ message: "Invalid maintenance request" });
  }
});

router.put("/:id", validateBody, async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Invalid maintenance request" });
  }
});

module.exports = router;
