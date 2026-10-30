const { test } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
test("public registration and reset-secret issuance are disabled without querying customer data", async () => {
  const app = express();
  app.use(express.json());
  app.use("/auth", require("./auth"));
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  try {
    const base = `http://127.0.0.1:${server.address().port}/auth`;
    const register = await fetch(base + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Attacker",
        email: "attacker@example.test",
        password: "unsafe",
        role: "admin",
      }),
    });
    assert.equal(register.status, 403);
    const reset = await fetch(base + "/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "owner@example.test" }),
    });
    assert.equal(reset.status, 503);
    assert.equal((await reset.json()).resetToken, undefined);
  } finally {
    server.close();
  }
});
