const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  property: { type: String, required: true },
  issueDescription: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  status: {
    type: String,
    enum: ["pending", "inProgress", "resolved"],
    default: "pending",
  },
  assignedTo: { type: String, default: "" },
  notes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
