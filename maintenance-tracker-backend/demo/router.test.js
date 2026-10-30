const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const { createDemoRouter } = require("./router");
let server,
  base,
  now = Date.now();
before(async () => {
  const app = express();
  app.use(express.json());
  app.use("/demo", createDemoRouter({ clock: () => now }));
  server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  base = `http://127.0.0.1:${server.address().port}/demo`;
});
after(() => server.close());
async function call(path, method = "GET", body, token) {
  const res = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return {
    status: res.status,
    body: res.status === 204 ? null : await res.json(),
  };
}
async function launch(role) {
  const r = await call("/sessions", "POST", { role });
  assert.equal(r.status, 201);
  return r.body.token;
}
test("complete tenant-manager-contractor lifecycle, scope, notifications, audit, concurrency and isolation", async () => {
  const token = await launch("tenant");
  const other = await launch("admin");
  let workspace = (await call("/workspace", "GET", undefined, token)).body;
  assert.ok(workspace.requests.every((r) => r.tenant === "tenant"));
  assert.equal(workspace.report, null);
  assert.equal(
    (
      await call(
        "/requests",
        "POST",
        {
          title: "Bad access",
          description: "A sufficiently long description",
          unit: "u2",
          category: "Plumbing",
          priority: "high",
        },
        token,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await call(
        "/organization",
        "POST",
        { name: "Unauthorized change" },
        token,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await call(
        "/properties",
        "POST",
        { name: "Unauthorized property", unitName: "1" },
        token,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await call(
        "/requests/r2",
        "PATCH",
        { version: 1, note: "Private access" },
        token,
      )
    ).status,
    404,
  );
  assert.equal(
    (
      await call(
        "/requests/r1",
        "PATCH",
        { version: 1, status: "reviewed" },
        token,
      )
    ).status,
    403,
  );
  const created = await call(
    "/requests",
    "POST",
    {
      title: "Leaking kitchen pipe",
      description: "Water dripping under the kitchen sink.",
      unit: "u1",
      category: "Plumbing",
      priority: "high",
    },
    token,
  );
  assert.equal(created.status, 201);
  const id = created.body.id;
  async function role(role) {
    assert.equal((await call("/role", "POST", { role }, token)).status, 200);
  }
  async function patch(payload, status = 200) {
    const result = await call(`/requests/${id}`, "PATCH", payload, token);
    assert.equal(result.status, status, JSON.stringify(result.body));
    return result;
  }
  await role("manager");
  const property = await call(
    "/properties",
    "POST",
    { name: "Fictional Sunset Court", unitName: "C-101" },
    token,
  );
  assert.equal(property.status, 201);
  workspace = (await call("/workspace", "GET", undefined, token)).body;
  assert.ok(
    workspace.requests.every((r) =>
      ["p1", property.body.id].includes(r.property),
    ),
  );
  await patch(
    {
      version: 1,
      status: "resolved",
      resolution: "Repair completed correctly.",
    },
    409,
  );
  await patch({ version: 1, status: "reviewed" });
  await patch({ version: 1, note: "Stale update" }, 409);
  await patch({ version: 2, assignedTo: "contractor", status: "assigned" });
  await patch({ version: 3, note: "Internal purchasing cost", internal: true });
  await role("tenant");
  workspace = (await call("/workspace", "GET", undefined, token)).body;
  assert.ok(
    !workspace.requests
      .find((r) => r.id === id)
      .activity.some((a) => a.internal),
  );
  assert.ok(workspace.notifications.length > 0);
  await patch(
    { version: 4, note: "Hidden malicious note", internal: true },
    403,
  );
  await role("contractor");
  workspace = (await call("/workspace", "GET", undefined, token)).body;
  assert.ok(workspace.requests.every((r) => r.assignedTo === "contractor"));
  assert.equal((await call("/requests", "POST", {}, token)).status, 403);
  await patch({ version: 4, assignedTo: "contractor2" }, 403);
  await patch({ version: 4, status: "inProgress" });
  await patch({ version: 5, status: "resolved" }, 400);
  await patch({
    version: 5,
    status: "onHold",
    note: "Waiting for replacement valve.",
  });
  await patch({ version: 6, status: "inProgress" });
  await patch({
    version: 7,
    status: "resolved",
    resolution: "Replaced valve and verified no leaks.",
  });
  await patch({ version: 8, status: "closed" }, 403);
  await role("tenant");
  await patch({ version: 8, status: "closed" });
  await patch({
    version: 9,
    status: "reopened",
    note: "Leak returned this morning.",
  });
  await role("admin");
  workspace = (await call("/workspace", "GET", undefined, token)).body;
  assert.ok(workspace.audit.some((a) => a.request === id));
  assert.equal(workspace.requests.find((r) => r.id === id).resolvedAt, null);
  assert.ok(workspace.report.completionRate >= 0);
  const isolated = (await call("/workspace", "GET", undefined, other)).body;
  assert.ok(!isolated.requests.some((r) => r.id === id));
  assert.equal(isolated.requests.length, 8);
  assert.equal(isolated.report.total, 8);
  assert.equal(isolated.report.open, 5);
  assert.equal(isolated.report.completionRate, 1 / 7);
  assert.equal(isolated.report.averageResolutionHours, 131);
  assert.equal(
    (
      await call(
        "/organization",
        "POST",
        { name: "Fictional Demo Portfolio" },
        other,
      )
    ).status,
    204,
  );
  assert.equal(
    (
      await call(
        "/requests/r8",
        "PATCH",
        { version: 1, note: "Private Cedar Gardens update" },
        token,
      )
    ).status,
    200,
  );
  await role("manager");
  const managerView = (await call("/workspace", "GET", undefined, token)).body;
  assert.ok(
    !managerView.notifications.some(
      (n) => n.text === "Private Cedar Gardens update",
    ),
  );
  await role("admin");
  const results = await Promise.all([
    patch({ version: 10, note: "Concurrent A" }),
    call(
      `/requests/${id}`,
      "PATCH",
      { version: 10, note: "Concurrent B" },
      token,
    ),
  ]);
  assert.equal(results[1].status, 409);
  await call("/reset", "POST", {}, token);
  assert.equal(
    (await call("/workspace", "GET", undefined, token)).body.requests.length,
    8,
  );
  await call("/session", "DELETE", undefined, other);
  assert.equal((await call("/workspace", "GET", undefined, other)).status, 401);
});
test("server-managed opaque sessions reject forgery, invalid roles, expired access and abusive creation", async () => {
  assert.equal((await call("/workspace")).status, 401);
  assert.equal(
    (await call("/workspace", "GET", undefined, "forged-token")).status,
    401,
  );
  assert.equal(
    (await call("/sessions", "POST", { role: "superuser" })).status,
    400,
  );
  const token = await launch("manager");
  now += 3600001;
  assert.equal((await call("/workspace", "GET", undefined, token)).status, 401);
  for (let i = 0; i < 10; i++)
    await call("/sessions", "POST", { role: "admin" });
  assert.equal(
    (await call("/sessions", "POST", { role: "admin" })).status,
    429,
  );
});
