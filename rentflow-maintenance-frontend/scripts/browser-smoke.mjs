// Optional QA: Node 22 and an existing Chrome installation. All API traffic is intercepted.
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backendRequire = createRequire(
  path.join(root, "../maintenance-tracker-backend/package.json"),
);
const express = backendRequire("express");
const app = express();
app.use(backendRequire("cors")());
app.use(express.json());
const user = {
  id: "fixture-admin",
  _id: "fixture-admin",
  name: "Ama Owusu",
  email: "ama@example.test",
  role: "admin",
};
const records = [
  {
    _id: "fixture-r1",
    tenantName: "Abena Asare",
    property: "Palm Court",
    issueDescription: "Kitchen sink leak",
    priority: "high",
    status: "pending",
    assignedTo: "",
    createdAt: "2026-10-01T12:00:00Z",
    notes: [],
  },
];
app.get("/api/auth/me", (req, res) => res.json({ user }));
app.get("/api/requests", (req, res) => res.json(records));
app.put("/api/requests/:id", (req, res) => {
  Object.assign(records[0], req.body);
  res.json(records[0]);
});
app.get("/api/users", (req, res) => res.json([user]));
app.use("/api/demo", backendRequire("./demo/router").createDemoRouter());
const build = path.join(root, "build");
app.use(async (req, res) => {
  let file = path.join(build, req.path);
  if (!file.startsWith(build + path.sep) && file !== build)
    return res.sendStatus(400);
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    await stat(file);
  } catch {
    if (req.path.startsWith("/app"))
      file = path.join(build, "workspace-shell.html");
    else {
      file = path.join(build, "404.html");
      res.status(404);
    }
  }
  res.sendFile(file);
});
const server = await new Promise((resolve) => {
  const s = app.listen(0, "127.0.0.1", () => resolve(s));
});
const origin = `http://127.0.0.1:${server.address().port}`;
const artifacts = await mkdtemp(path.join(tmpdir(), "rentflow-browser-"));
const profile = await mkdtemp(path.join(tmpdir(), "rentflow-chrome-"));
const chrome = spawn(
  process.env.CHROME_BIN || "google-chrome",
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);
let socket;
let stopping = false;
let closeCdp = () => {};
try {
  const debugURL = await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(
      () => reject(new Error("Chrome did not start")),
      15000,
    );
    chrome.on("error", reject);
    chrome.stderr.on("data", (d) => {
      output += d;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(new URL(match[1]));
      }
    });
  });
  const targets = await (
    await fetch(`http://${debugURL.host}/json/list`)
  ).json();
  socket = new WebSocket(
    targets.find((t) => t.type === "page").webSocketDebuggerUrl,
  );
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  const exceptions = [];
  closeCdp = () => {
    stopping = true;
    for (const item of pending.values()) {
      clearTimeout(item.timeout);
      item.resolve({});
    }
    pending.clear();
    socket?.close();
  };
  function cdp(method, params = {}) {
    if (stopping) return Promise.resolve({});
    return new Promise((resolve, reject) => {
      const key = ++id;
      const timeout = setTimeout(() => {
        pending.delete(key);
        reject(new Error(`CDP timeout: ${method}`));
      }, 15000);
      pending.set(key, { resolve, reject, timeout });
      socket.send(JSON.stringify({ id: key, method, params }));
    });
  }
  socket.addEventListener("message", async (event) => {
    if (stopping) return;
    const msg = JSON.parse(event.data);
    if (msg.id) {
      const item = pending.get(msg.id);
      if (!item) return;
      clearTimeout(item.timeout);
      pending.delete(msg.id);
      msg.error
        ? item.reject(new Error(msg.error.message))
        : item.resolve(msg.result);
    }
    if (msg.method === "Runtime.exceptionThrown")
      exceptions.push(
        msg.params.exceptionDetails.text +
          ": " +
          (msg.params.exceptionDetails.exception?.description || ""),
      );
    if (msg.method === "Fetch.requestPaused") {
      const { request, requestId } = msg.params;
      try {
        const url = new URL(request.url);
        if (url.origin === origin) {
          await cdp("Fetch.continueRequest", { requestId });
          return;
        }
        if (!url.pathname.startsWith("/api/")) {
          exceptions.push("Unexpected external request blocked: " + url.origin);
          await cdp("Fetch.failRequest", {
            requestId,
            errorReason: "BlockedByClient",
          });
          return;
        }
        const response = await fetch(origin + url.pathname + url.search, {
          method: request.method,
          headers: {
            "Content-Type": "application/json",
            ...(Object.entries(request.headers).find(
              ([key]) => key.toLowerCase() === "authorization",
            )
              ? {
                  Authorization: Object.entries(request.headers).find(
                    ([key]) => key.toLowerCase() === "authorization",
                  )[1],
                }
              : {}),
          },
          ...(request.postData ? { body: request.postData } : {}),
        });
        await cdp("Fetch.fulfillRequest", {
          requestId,
          responseCode: response.status,
          responseHeaders: [
            { name: "Content-Type", value: "application/json" },
            { name: "Access-Control-Allow-Origin", value: "*" },
            {
              name: "Access-Control-Allow-Headers",
              value: "Authorization, Content-Type",
            },
            {
              name: "Access-Control-Allow-Methods",
              value: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            },
          ],
          body: Buffer.from(await response.arrayBuffer()).toString("base64"),
        });
      } catch (error) {
        exceptions.push(error.message);
        await cdp("Fetch.failRequest", { requestId, errorReason: "Failed" });
      }
    }
  });
  await cdp("Page.enable");
  await cdp("Runtime.enable");
  await cdp("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
  const evaluate = async (expression) => {
    const result = await cdp("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails)
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text,
      );
    return result.result.value;
  };
  async function wait(expression) {
    const end = Date.now() + 15000;
    while (Date.now() < end) {
      if (await evaluate(`Boolean(${expression})`)) return;
      await new Promise((r) => setTimeout(r, 75));
    }
    throw new Error("Browser condition failed: " + expression);
  }
  const navigate = async (route, heading) => {
    await cdp("Page.navigate", { url: origin + route });
    await wait(
      `document.querySelector('h1')?.textContent.includes(${JSON.stringify(heading)})`,
    );
  };
  const dimensions = async (width, height) =>
    cdp("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
  const screenshot = async (name) => {
    const result = await cdp("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(artifacts, name + ".png"),
      Buffer.from(result.data, "base64"),
    );
  };
  const clickText = async (text) => {
    assert.ok(
      await evaluate(
        `(()=>{const button=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!button)return false;button.click();return true;})()`,
      ),
      `Button missing: ${text}`,
    );
  };
  const fill = async (selector, value) =>
    evaluate(
      `(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw new Error('Missing field');const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`,
    );
  await dimensions(1440, 1000);
  await navigate("/", "Good homes");
  await screenshot("home-desktop");
  for (const [route, heading] of [
    ["/features", "Every repair"],
    ["/property-managers", "Less chasing"],
    ["/tenant-portal", "Report it"],
    ["/reporting", "A clearer view"],
    ["/faq", "Your questions"],
    ["/contact", "Bring your workflow"],
  ]) {
    await navigate(route, heading);
    assert.equal(await evaluate('document.querySelectorAll("h1").length'), 1);
    assert.ok(
      await evaluate(
        'document.querySelector("link[rel=canonical]").href.endsWith(location.pathname)',
      ),
    );
  }
  await dimensions(390, 844);
  await navigate("/", "Good homes");
  assert.ok(
    await evaluate("document.documentElement.scrollWidth<=innerWidth"),
    "mobile homepage overflows",
  );
  await screenshot("home-mobile");
  await evaluate(
    'document.querySelector("[aria-label=\\"Open navigation\\"]").click()',
  );
  await wait('document.getElementById("public-mobile-menu")');
  await evaluate(
    'document.querySelector("[aria-label=\\"Close navigation\\"]").click()',
  );
  await dimensions(1440, 1000);
  await evaluate(
    `localStorage.setItem('token','fixture-token');localStorage.setItem('user',${JSON.stringify(JSON.stringify(user))});`,
  );
  await navigate("/app/home", "Welcome back");
  await wait('document.body.innerText.includes("Kitchen sink leak")');
  await screenshot("workspace-desktop");
  await navigate("/app/requests", "Maintenance requests");
  await wait(
    'document.querySelector("select[aria-label=\\"Status for Kitchen sink leak\\"]")',
  );
  await clickText("New request");
  await wait('document.querySelector("dialog[open]")');
  assert.ok(
    await evaluate(
      'document.querySelector("dialog").contains(document.activeElement)',
    ),
    "dialog focus escapes",
  );
  await cdp("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27,
  });
  await cdp("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27,
  });
  await wait('!document.querySelector("dialog[open]")');
  await fill('select[aria-label="Status for Kitchen sink leak"]', "inProgress");
  await wait('document.body.innerText.includes("Request updated.")');
  assert.equal(records[0].status, "inProgress");
  await dimensions(390, 844);
  assert.ok(
    await evaluate("document.documentElement.scrollWidth<=innerWidth"),
    "mobile workspace overflows",
  );
  await evaluate(
    'document.querySelector("[aria-label=\\"Open workspace menu\\"]").click()',
  );
  await wait('document.getElementById("workspace-mobile-menu")');
  await screenshot("workspace-mobile-menu");
  await evaluate(
    'document.querySelector("[aria-label=\\"Close workspace menu\\"]").click()',
  );
  await dimensions(1440, 1000);
  await navigate("/demo", "One repair");
  await screenshot("demo-entry");
  await clickText("Launch Tenant demo");
  await wait('document.body.innerText.includes("My requests")');
  await fill('input[name="title"]', "Browser fixture leak");
  await fill(
    'textarea[name="description"]',
    "A fictional leak under the kitchen sink.",
  );
  await clickText("Submit request");
  await wait(
    'document.getElementById("demo-request-detail")?.innerText.includes("Browser fixture leak")',
  );
  async function role(value) {
    await fill('select[aria-label="Demo role"]', value);
    await wait(
      `document.querySelector('select[aria-label="Demo role"]').value===${JSON.stringify(value)} && !document.body.innerText.includes('Connecting to your workspace')`,
    );
    await clickText("Open RF-1009");
    await wait(
      'document.getElementById("demo-request-detail")?.innerText.includes("Browser fixture leak")',
    );
  }
  async function transition(status) {
    await fill('#demo-request-detail select[name="status"]', status);
    if (status === "resolved")
      await fill(
        '#demo-request-detail textarea[name="resolution"]',
        "Replaced the valve and checked for leaks.",
      );
    await clickText("Save update");
    await wait(
      `document.getElementById('demo-request-detail')?.innerText.includes('Status changed to ${status}')`,
    );
  }
  await role("manager");
  await transition("reviewed");
  await clickText("Assign work");
  await wait(
    'document.getElementById("demo-request-detail")?.innerText.includes("Status changed to assigned")',
  );
  await role("contractor");
  await transition("inProgress");
  await transition("resolved");
  await role("tenant");
  await transition("closed");
  await screenshot("demo-completed-repair");
  await navigate("/missing-page", "This door");
  assert.equal(
    await evaluate('document.querySelector("meta[name=robots]").content'),
    "noindex, nofollow",
  );
  assert.deepEqual(exceptions, []);
  console.log(
    JSON.stringify(
      {
        result: "passed",
        checks:
          "7 public routes; mobile overflow/navigation; workspace fixtures; native dialog Escape/focus; status save; real demo API lifecycle across tenant/manager/contractor; 404 metadata",
        artifacts,
      },
      null,
      2,
    ),
  );
} finally {
  closeCdp();
  chrome.kill("SIGTERM");
  server.close();
  await rm(profile, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
}
