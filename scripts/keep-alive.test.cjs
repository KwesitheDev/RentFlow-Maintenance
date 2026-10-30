const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");
function run(url) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [path.join(__dirname, "keep-alive.mjs")],
      { env: { ...process.env, RENTFLOW_HEALTH_URL: url }, stdio: "pipe" },
    );
    let output = "";
    child.stdout.on("data", (d) => {
      output += d;
    });
    child.stderr.resume();
    child.on("close", (code) => resolve({ code, output }));
  });
}
test("external probe requires both server and database healthy", async () => {
  let requests = 0;
  const server = http.createServer((req, res) => {
    assert.equal(req.url, "/api/health");
    requests++;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ server: "ok", database: "ok" }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const result = await run(
      `http://127.0.0.1:${server.address().port}/api/health`,
    );
    assert.equal(result.code, 0);
    assert.equal(requests, 1);
    assert.match(result.output, /healthy/);
  } finally {
    server.close();
  }
});
test("probe rejects missing and insecure remote configuration", async () => {
  assert.notEqual((await run("")).code, 0);
  assert.notEqual((await run("http://example.test/api/health")).code, 0);
});
