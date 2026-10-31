const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      ...(process.env.FRONTEND_ORIGIN ? [process.env.FRONTEND_ORIGIN] : []),
      "http://localhost:3000", //local development
      "https://rentflow-maintenance.vercel.app", //vercel deployement
      "https://rentflow.kwesithedev.com", //kwesithedev deployement
    ],
  }),
);
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "no-referrer");
  res.set("X-Frame-Options", "DENY");
  next();
});
app.use("/api/demo", require("./demo/router").createDemoRouter());
const healthLimits = new Map();
app.get("/api/health", async (req, res) => {
  res.set("Cache-Control", "no-store");
  const now = Date.now();
  for (const [key, until] of healthLimits)
    if (until <= now) healthLimits.delete(key);
  if (healthLimits.has(req.ip))
    return res.status(429).json({ message: "Retry in 30 seconds" });
  if (healthLimits.size >= 10000) return res.sendStatus(503);
  healthLimits.set(req.ip, now + 30000);
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ server: "ok", database: "unavailable" });
    await mongoose.connection.db.command({ ping: 1 }, { timeoutMS: 5000 });
    res.json({ server: "ok", database: "ok" });
  } catch (_) {
    res.status(503).json({ server: "ok", database: "unavailable" });
  }
});

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const authLimits = new Map();
app.use(
  "/api/auth",
  (req, res, next) => {
    const now = Date.now();
    for (const [key, value] of authLimits)
      if (value.until <= now) authLimits.delete(key);
    if (!authLimits.has(req.ip) && authLimits.size >= 10000)
      return res.sendStatus(503);
    const limit = authLimits.get(req.ip) || { count: 0, until: now + 60000 };
    authLimits.set(req.ip, limit);
    if (++limit.count > 30)
      return res
        .status(429)
        .json({ message: "Too many attempts. Retry in one minute." });
    next();
  },
  require("./routes/auth"),
);
app.use("/api/requests", require("./routes/requests"));
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

if (require.main === module)
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );

module.exports = app;
