const express = require("express");
const crypto = require("node:crypto");
const ROLES = ["admin", "manager", "tenant", "contractor"];
const transitions = {
  submitted: ["reviewed", "cancelled"],
  reviewed: ["assigned", "cancelled"],
  assigned: ["inProgress", "onHold"],
  inProgress: ["resolved", "onHold"],
  onHold: ["inProgress", "cancelled"],
  resolved: ["closed", "reopened"],
  closed: ["reopened"],
  reopened: ["reviewed", "inProgress"],
};
const people = [
  { id: "owner", name: "Ama Owusu", role: "admin" },
  { id: "manager", name: "Kwame Mensah", role: "manager", properties: ["p1"] },
  { id: "tenant", name: "Abena Asare", role: "tenant", unit: "u1" },
  { id: "tenant2", name: "Kofi Arthur", role: "tenant", unit: "u2" },
  { id: "tenant3", name: "Yaw Boateng", role: "tenant", unit: "u3" },
  { id: "contractor", name: "Esi Plumbing & Repairs", role: "contractor" },
  { id: "contractor2", name: "Bright Electrical", role: "contractor" },
];
function seed() {
  const now = Date.now();
  return {
    organization: { name: "Akwaaba Living (fictional)" },
    people: structuredClone(people),
    properties: [
      { id: "p1", name: "Palm Court, Accra" },
      { id: "p2", name: "Cedar Gardens, Tema" },
    ],
    units: [
      { id: "u1", property: "p1", name: "A-101" },
      { id: "u2", property: "p1", name: "A-202" },
      { id: "u3", property: "p2", name: "B-101" },
    ],
    requests: [
      "submitted",
      "reviewed",
      "assigned",
      "inProgress",
      "resolved",
      "closed",
      "onHold",
      "cancelled",
    ].map((status, i) => ({
      id: `r${i + 1}`,
      reference: `RF-${1001 + i}`,
      property: i === 7 ? "p2" : "p1",
      unit: i === 7 ? "u3" : i % 2 ? "u2" : "u1",
      tenant: i === 7 ? "tenant3" : i % 2 ? "tenant2" : "tenant",
      title: [
        "Kitchen sink leak",
        "Loose balcony latch",
        "Faulty hallway light",
        "Bathroom tap replacement",
        "Water heater inspection",
        "Bedroom lock repair",
        "Awaiting replacement pump",
        "Duplicate paint request",
      ][i],
      description:
        "Fictional maintenance record for a safe product demonstration.",
      category: i % 2 ? "General repair" : "Plumbing",
      priority: i % 3 === 0 ? "high" : "medium",
      status,
      assignedTo: [
        "assigned",
        "inProgress",
        "resolved",
        "closed",
        "onHold",
      ].includes(status)
        ? "contractor"
        : "",
      createdAt: new Date(now - (i + 1) * 86400000).toISOString(),
      dueAt: new Date(now + (2 - i) * 86400000).toISOString(),
      resolvedAt: ["resolved", "closed"].includes(status)
        ? new Date(now - 3600000).toISOString()
        : null,
      resolution: ["resolved", "closed"].includes(status)
        ? "Replaced worn component and tested operation."
        : "",
      version: 1,
      activity: [
        {
          at: new Date(now - (i + 1) * 86400000).toISOString(),
          actor: "manager",
          text: `Seeded history: ${status}`,
          internal: false,
        },
      ],
    })),
    notifications: people
      .filter((p) =>
        ["owner", "manager", "tenant", "contractor"].includes(p.id),
      )
      .map((p) => ({
        id: crypto.randomUUID(),
        recipient: p.id,
        at: new Date(now - 3600000).toISOString(),
        actor: "manager",
        text:
          p.role === "contractor"
            ? "You have maintenance work awaiting attention."
            : p.role === "tenant"
              ? "Your water heater inspection has been resolved. Please review the repair."
              : "Palm Court has open maintenance requests to review.",
        request: p.role === "tenant" ? "r5" : "r3",
        read: false,
        internal: false,
      })),
    audit: [
      {
        at: new Date(now - 86400000).toISOString(),
        actor: "owner",
        text: "Fictional portfolio initialized",
        internal: true,
      },
    ],
  };
}
function createDemoRouter({
  ttl = 60 * 60 * 1000,
  capacity = 50,
  clock = Date.now,
} = {}) {
  const router = express.Router();
  const sessions = new Map();
  const limits = new Map();
  function prune() {
    const now = clock();
    for (const [key, value] of sessions)
      if (value.expires <= now) sessions.delete(key);
    for (const [key, value] of limits)
      if (value.until <= now) limits.delete(key);
  }
  const timer = setInterval(prune, 60000);
  timer.unref();
  router.use((req, res, next) => {
    prune();
    res.set("Cache-Control", "no-store");
    res.set("X-Robots-Tag", "noindex");
    const key = req.ip;
    const limit = limits.get(key) || {
      count: 0,
      starts: 0,
      until: clock() + 60000,
    };
    if (!limits.has(key) && limits.size >= 10000)
      return res.status(503).json({ message: "Demo busy. Try later." });
    limits.set(key, limit);
    limit.count++;
    if (req.path === "/sessions" && req.method === "POST") limit.starts++;
    if (limit.count > 120 || limit.starts > 10) {
      res.set("Retry-After", "60");
      return res
        .status(429)
        .json({ message: "Please wait before trying again." });
    }
    if (
      ["POST", "PATCH"].includes(req.method) &&
      (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
    ) {
      return res.status(400).json({ message: "A JSON object is required." });
    }
    next();
  });
  router.post("/sessions", (req, res) => {
    if (!ROLES.includes(req.body.role))
      return res.status(400).json({ message: "Choose a supported role." });
    if (sessions.size >= capacity)
      return res
        .status(503)
        .json({ message: "Demo capacity reached. Please try later." });
    const token = crypto.randomBytes(32).toString("base64url");
    const expires = clock() + ttl;
    sessions.set(crypto.createHash("sha256").update(token).digest("hex"), {
      role: req.body.role,
      expires,
      data: seed(),
    });
    res.status(201).json({ token, expiresAt: new Date(expires).toISOString() });
  });
  router.use((req, res, next) => {
    const token = req.get("Authorization")?.replace(/^Bearer /, "") || "";
    const key = crypto.createHash("sha256").update(token).digest("hex");
    const session = sessions.get(key);
    if (!session || session.expires <= clock())
      return res
        .status(401)
        .json({ message: "Demo expired. Launch a fresh workspace." });
    req.demo = session;
    req.demoKey = key;
    req.actor = session.data.people.find((p) => p.role === session.role);
    next();
  });
  const visible = (req, r) =>
    req.demo.role === "admin" ||
    (req.demo.role === "manager" &&
      req.actor.properties.includes(r.property)) ||
    (req.demo.role === "tenant" && r.tenant === req.actor.id) ||
    (req.demo.role === "contractor" && r.assignedTo === req.actor.id);
  const management = (req) => ["admin", "manager"].includes(req.demo.role);
  const record = (req, r, text, internal = false) => {
    const event = {
      at: new Date(clock()).toISOString(),
      actor: req.actor.id,
      text,
      internal,
    };
    r.activity.push(event);
    req.demo.data.audit.push({ ...event, request: r.id });
    if (req.demo.data.audit.length > 500) req.demo.data.audit.shift();
    if (!internal) {
      const recipients = new Set([r.tenant, r.assignedTo, "manager", "owner"]);
      recipients.delete("");
      for (const recipient of recipients)
        req.demo.data.notifications.push({
          ...event,
          id: crypto.randomUUID(),
          recipient,
          request: r.id,
          read: false,
        });
    }
    if (req.demo.data.notifications.length > 500)
      req.demo.data.notifications.splice(
        0,
        req.demo.data.notifications.length - 500,
      );
  };
  router.get("/workspace", (req, res) => {
    const data = req.demo.data;
    const requests = data.requests
      .filter((r) => visible(req, r))
      .map((r) => ({
        ...r,
        activity: r.activity.filter((a) => !a.internal || management(req)),
      }));
    const properties = data.properties.filter(
      (p) =>
        req.demo.role === "admin" ||
        (req.demo.role === "manager"
          ? req.actor.properties.includes(p.id)
          : requests.some((r) => r.property === p.id)),
    );
    const units = data.units.filter((u) =>
      req.demo.role === "tenant"
        ? u.id === req.actor.unit
        : properties.some((p) => p.id === u.property),
    );
    const completed = requests.filter(
      (r) => r.resolvedAt && ["resolved", "closed"].includes(r.status),
    );
    res.json({
      role: req.demo.role,
      actor: req.actor,
      expiresAt: new Date(req.demo.expires).toISOString(),
      organization: data.organization,
      properties,
      units,
      people: data.people
        .filter(
          (p) =>
            req.demo.role === "admin" ||
            (req.demo.role === "manager" &&
              (p.role !== "tenant" ||
                req.actor.properties.includes(
                  data.units.find((u) => u.id === p.unit)?.property,
                ))) ||
            p.id === req.actor.id ||
            p.role === "contractor",
        )
        .map((p) => ({ id: p.id, name: p.name, role: p.role })),
      requests,
      notifications: data.notifications.filter(
        (n) =>
          n.recipient === req.actor.id &&
          data.requests.some((r) => r.id === n.request && visible(req, r)),
      ),
      report: management(req)
        ? {
            total: requests.length,
            open: requests.filter(
              (r) => !["resolved", "closed", "cancelled"].includes(r.status),
            ).length,
            overdue: requests.filter(
              (r) =>
                !["resolved", "closed", "cancelled"].includes(r.status) &&
                Date.parse(r.dueAt) < clock(),
            ).length,
            completionRate:
              requests.filter((r) => r.status === "closed").length /
              Math.max(
                1,
                requests.filter((r) => r.status !== "cancelled").length,
              ),
            averageResolutionHours: completed.length
              ? completed.reduce(
                  (sum, r) =>
                    sum +
                    (Date.parse(r.resolvedAt) - Date.parse(r.createdAt)) /
                      3600000,
                  0,
                ) / completed.length
              : 0,
            byPriority: Object.fromEntries(
              ["low", "medium", "high"].map((p) => [
                p,
                requests.filter((r) => r.priority === p).length,
              ]),
            ),
            byProperty: properties.map((p) => ({
              name: p.name,
              count: requests.filter((r) => r.property === p.id).length,
            })),
            workload: data.people
              .filter((p) => p.role === "contractor")
              .map((p) => ({
                name: p.name,
                count: requests.filter(
                  (r) =>
                    r.assignedTo === p.id &&
                    !["resolved", "closed", "cancelled"].includes(r.status),
                ).length,
              })),
          }
        : null,
      audit: req.demo.role === "admin" ? data.audit : undefined,
    });
  });
  router.post("/role", (req, res) => {
    if (!ROLES.includes(req.body.role))
      return res.status(400).json({ message: "Invalid role." });
    req.demo.role = req.body.role;
    res.json({ role: req.demo.role });
  });
  router.delete("/session", (req, res) => {
    sessions.delete(req.demoKey);
    res.sendStatus(204);
  });
  router.post("/reset", (req, res) => {
    req.demo.data = seed();
    res.json({ message: "Workspace reset." });
  });
  router.post("/requests", (req, res) => {
    if (!management(req) && req.demo.role !== "tenant")
      return res
        .status(403)
        .json({ message: "This role cannot submit requests." });
    const { title, description, unit, priority, category } = req.body;
    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.length > 120 ||
      typeof description !== "string" ||
      description.trim().length < 10 ||
      description.length > 2000 ||
      !["low", "medium", "high"].includes(priority) ||
      !["Plumbing", "Electrical", "General repair"].includes(category)
    )
      return res.status(400).json({
        message: "Provide a title, description, category and valid priority.",
      });
    const u = req.demo.data.units.find((u) => u.id === unit);
    if (
      !u ||
      (req.demo.role === "tenant" && unit !== req.actor.unit) ||
      (req.demo.role === "manager" &&
        !req.actor.properties.includes(u.property))
    )
      return res.status(403).json({ message: "Unit access denied." });
    if (req.demo.data.requests.length >= 100)
      return res
        .status(409)
        .json({ message: "Workspace limit reached. Reset to continue." });
    const r = {
      id: crypto.randomUUID(),
      reference: `RF-${1001 + req.demo.data.requests.length}`,
      property: u.property,
      unit,
      tenant:
        req.demo.data.people.find((p) => p.unit === unit)?.id || req.actor.id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: "submitted",
      assignedTo: "",
      createdAt: new Date(clock()).toISOString(),
      dueAt: new Date(clock() + 3 * 86400000).toISOString(),
      resolvedAt: null,
      resolution: "",
      version: 1,
      activity: [],
    };
    req.demo.data.requests.unshift(r);
    record(req, r, "Request submitted");
    res.status(201).json({ id: r.id });
  });
  router.patch("/requests/:id", (req, res) => {
    const r = req.demo.data.requests.find((r) => r.id === req.params.id);
    if (!r || !visible(req, r))
      return res.status(404).json({ message: "Request not found." });
    if (r.version !== req.body.version)
      return res
        .status(409)
        .json({ message: "Request changed. Refresh and try again." });
    const { status, assignedTo, note, internal, resolution } = req.body;
    if (r.activity.length >= 100)
      return res
        .status(409)
        .json({ message: "Activity limit reached. Reset to continue." });
    if (
      Object.keys(req.body).some(
        (k) =>
          ![
            "version",
            "status",
            "assignedTo",
            "note",
            "internal",
            "resolution",
          ].includes(k),
      )
    )
      return res.status(400).json({ message: "Unsupported field." });
    if (
      note !== undefined &&
      (typeof note !== "string" || !note.trim() || note.length > 2000)
    )
      return res
        .status(400)
        .json({ message: "Notes must contain 1–2000 characters." });
    if (internal !== undefined && typeof internal !== "boolean")
      return res.status(400).json({ message: "Invalid visibility." });
    if (internal && !management(req))
      return res
        .status(403)
        .json({ message: "Internal notes are restricted." });
    if (
      assignedTo !== undefined &&
      (!management(req) ||
        !req.demo.data.people.some(
          (p) => p.id === assignedTo && p.role === "contractor",
        ))
    )
      return res.status(403).json({ message: "Assignment denied." });
    if (
      assignedTo !== undefined &&
      !["reviewed", "assigned", "inProgress", "onHold"].includes(r.status)
    )
      return res
        .status(409)
        .json({ message: "Review this request before assigning work." });
    if (
      resolution !== undefined &&
      (status !== "resolved" ||
        typeof resolution !== "string" ||
        resolution.length < 10 ||
        resolution.length > 2000)
    )
      return res.status(400).json({
        message: "Resolution requires 10–2000 characters and resolved status.",
      });
    if (status !== undefined) {
      const allowed =
        management(req) ||
        (req.demo.role === "tenant" &&
          ["closed", "reopened"].includes(status)) ||
        (req.demo.role === "contractor" &&
          ["inProgress", "onHold", "resolved"].includes(status));
      if (!allowed)
        return res
          .status(403)
          .json({ message: "Status change denied for this role." });
      if (!transitions[r.status]?.includes(status))
        return res.status(409).json({ message: "Invalid state transition." });
      if (
        ["assigned", "inProgress"].includes(status) &&
        !(assignedTo || r.assignedTo)
      )
        return res.status(400).json({ message: "Assign a contractor first." });
      if (status === "resolved" && !resolution)
        return res.status(400).json({ message: "Provide resolution details." });
    }
    if (status === undefined && assignedTo === undefined && note === undefined)
      return res.status(400).json({ message: "No change supplied." });
    // All validation precedes mutation; synchronous operations serialize concurrent updates.
    if (assignedTo !== undefined) {
      r.assignedTo = assignedTo;
      record(req, r, `Assigned to ${assignedTo}`);
    }
    if (status !== undefined) {
      r.status = status;
      if (status === "resolved") {
        r.resolution = resolution;
        r.resolvedAt = new Date(clock()).toISOString();
      }
      if (status === "reopened") r.resolvedAt = null;
      record(req, r, `Status changed to ${status}`);
    }
    if (note !== undefined) record(req, r, note.trim(), internal === true);
    r.version++;
    res.json({ id: r.id, version: r.version });
  });
  router.post("/notifications/read", (req, res) => {
    req.demo.data.notifications
      .filter((n) => n.recipient === req.actor.id)
      .forEach((n) => {
        n.read = true;
      });
    res.sendStatus(204);
  });
  router.post("/properties", (req, res) => {
    if (!management(req))
      return res
        .status(403)
        .json({ message: "Property management is restricted." });
    const { name, unitName } = req.body;
    if (
      typeof name !== "string" ||
      name.trim().length < 3 ||
      name.length > 100 ||
      typeof unitName !== "string" ||
      !unitName.trim() ||
      unitName.length > 40
    )
      return res.status(400).json({
        message:
          "Supply a property name (3–100 characters) and unit name (1–40 characters).",
      });
    if (req.demo.data.properties.length >= 10)
      return res
        .status(409)
        .json({ message: "Property limit reached. Reset to continue." });
    const id = crypto.randomUUID();
    req.demo.data.properties.push({ id, name: name.trim() });
    req.demo.data.units.push({
      id: crypto.randomUUID(),
      property: id,
      name: unitName.trim(),
    });
    if (req.demo.role === "manager") req.actor.properties.push(id);
    req.demo.data.audit.push({
      at: new Date(clock()).toISOString(),
      actor: req.actor.id,
      text: `Created property ${name.trim()} and initial unit`,
      internal: true,
    });
    res.status(201).json({ id });
  });
  router.post("/organization", (req, res) => {
    if (req.demo.role !== "admin")
      return res.status(403).json({ message: "Owner only." });
    if (
      typeof req.body.name !== "string" ||
      req.body.name.trim().length < 3 ||
      req.body.name.length > 100
    )
      return res.status(400).json({ message: "Use 3–100 characters." });
    req.demo.data.organization.name = req.body.name.trim();
    res.sendStatus(204);
  });
  return router;
}
module.exports = { createDemoRouter, seed, transitions };
