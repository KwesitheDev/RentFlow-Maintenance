const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const build = path.resolve(__dirname, "../build");
const routes = [
  "/",
  "/features",
  "/property-managers",
  "/tenant-portal",
  "/reporting",
  "/faq",
  "/contact",
];
const titles = new Set();
const descriptions = new Set();
for (const route of routes) {
  const html = fs.readFileSync(path.join(build, route, "index.html"), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(
    /<meta name="description" content="([^"]+)"/,
  )?.[1];
  assert.ok(title && description, `${route}: metadata required`);
  assert.ok(!titles.has(title), "unique titles");
  assert.ok(!descriptions.has(description), "unique descriptions");
  titles.add(title);
  descriptions.add(description);
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${route}: exactly one rendered h1`,
  );
  assert.equal(
    (html.match(/rel="canonical"/g) || []).length,
    1,
    `${route}: one canonical`,
  );
  assert.ok(html.includes('content="index, follow"'));
  assert.ok(html.includes('type="application/ld+json"'));
  assert.ok(html.includes('property="og:image"'));
  assert.ok(!html.includes("logo192.png"));
  assert.ok(!html.includes("noindex"));
  const rootContent = html.match(/<div id="root">([\s\S]+)<\/div>/)?.[1];
  assert.ok(rootContent?.includes("<main"), `${route}: pre-rendered content`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical).pathname, route);
  for (const href of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const target = href[1];
    if (
      routes.includes(target) ||
      ["/demo", "/login", "/register", "/forgot-password"].includes(target) ||
      target.startsWith("/static/") ||
      target === "/logo.svg" ||
      target === "/manifest.json"
    )
      continue;
    assert.ok(
      fs.existsSync(path.join(build, target)),
      `${route}: missing internal target ${target}`,
    );
  }
}
for (const file of [
  "demo/index.html",
  "login/index.html",
  "register/index.html",
  "forgot-password/index.html",
  "workspace-shell.html",
  "404.html",
]) {
  const html = fs.readFileSync(path.join(build, file), "utf8");
  assert.ok(
    html.includes('content="noindex, nofollow"'),
    `${file}: noindex required`,
  );
  assert.ok(!html.includes('rel="canonical"'), `${file}: no public canonical`);
}
const sitemap = fs.readFileSync(path.join(build, "sitemap.xml"), "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length);
for (const p of ["/demo", "/app", "/login"]) assert.ok(!sitemap.includes(p));
const robots = fs.readFileSync(path.join(build, "robots.txt"), "utf8");
assert.ok(robots.includes("Sitemap: https://"));
assert.ok(
  !robots.includes("Disallow: /app"),
  "noindex shells must be crawlable",
);
assert.ok(fs.statSync(path.join(build, "social-preview.png")).size > 0);
console.log(
  `SEO checks passed for ${routes.length} public pages, 6 private/error shells, internal links and discovery files.`,
);
