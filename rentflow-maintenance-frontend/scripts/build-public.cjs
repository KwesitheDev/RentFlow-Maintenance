process.env.NODE_ENV = "production";
require("react-scripts/config/env");
/* Render only public, database-free components into the CRA build. No customer data is read. */
const fs = require("node:fs");
const path = require("node:path");
const { transformSync } = require("@babel/core");
const src = path.resolve(__dirname, "../src");
for (const extension of [".js", ".jsx"]) {
  const original = require.extensions[extension] || require.extensions[".js"];
  require.extensions[extension] = (module, filename) => {
    if (!filename.startsWith(src + path.sep)) return original(module, filename);
    const { code } = transformSync(fs.readFileSync(filename, "utf8"), {
      filename,
      babelrc: false,
      configFile: false,
      presets: [
        [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
      ],
      plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")],
    });
    module._compile(code, filename);
  };
}
const React = require("react");
const { renderToString } = require("react-dom/server");
const { MemoryRouter } = require("react-router-dom");
const { publicPages, SITE_ORIGIN } = require("../src/content/site");
const Landing = require("../src/pages/Landing").default;
const {
  ProductPage,
  FAQ,
  Contact,
  NotFound,
} = require("../src/pages/ProductPages");
const { metadataFor } = require("../src/components/RouteMeta");
const build = path.resolve(__dirname, "../build");
const template = fs.readFileSync(path.join(build, "index.html"), "utf8");
const origin = new URL(SITE_ORIGIN);
if (origin.protocol !== "https:" && origin.hostname !== "localhost")
  throw new Error("REACT_APP_SITE_URL must use HTTPS");
if (
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash ||
  origin.username ||
  origin.password
)
  throw new Error(
    "REACT_APP_SITE_URL must be an origin without paths or credentials",
  );
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
function htmlFor(route, component) {
  const meta = metadataFor(route);
  const canonical = meta.canonical
    ? `<link rel="canonical" href="${escape(meta.canonical)}"/>`
    : "";
  const data = meta.canonical
    ? `<script id="site-structured-data" type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "RentFlow", url: SITE_ORIGIN + "/", description: publicPages["/"].description }).replaceAll("<", "\\u003c")}</script>`
    : "";
  const tags = `<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"/><meta name="robots" content="${meta.robots}"/>${canonical}<meta property="og:title" content="${escape(meta.title)}"/><meta property="og:description" content="${escape(meta.description)}"/><meta property="og:url" content="${escape(meta.canonical || SITE_ORIGIN + route)}"/><meta property="og:type" content="website"/><meta property="og:site_name" content="RentFlow"/><meta property="og:image" content="${SITE_ORIGIN}/social-preview.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(meta.title)}"/><meta name="twitter:description" content="${escape(meta.description)}"/><meta name="twitter:image" content="${SITE_ORIGIN}/social-preview.png"/>${data}`;
  const clean = template
    .replace(/<title>.*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "");
  const markup = component
    ? renderToString(
        React.createElement(
          MemoryRouter,
          { initialEntries: [route] },
          component,
        ),
      )
    : "";
  return clean
    .replace("</head>", tags + "</head>")
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}
for (const route of Object.keys(publicPages)) {
  const component =
    route === "/"
      ? React.createElement(Landing)
      : route === "/faq"
        ? React.createElement(FAQ)
        : route === "/contact"
          ? React.createElement(Contact)
          : React.createElement(ProductPage, { path: route });
  const destination =
    route === "/"
      ? path.join(build, "index.html")
      : path.join(build, route, "index.html");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, htmlFor(route, component));
}
for (const route of ["/demo", "/login", "/register", "/forgot-password"]) {
  const dir = path.join(build, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), htmlFor(route));
}
fs.writeFileSync(
  path.join(build, "workspace-shell.html"),
  htmlFor("/app/home"),
);
fs.writeFileSync(
  path.join(build, "404.html"),
  htmlFor("/404", React.createElement(NotFound)),
);
fs.writeFileSync(
  path.join(build, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
    publicPages,
  )
    .map(
      (route) =>
        `<url><loc>${escape(SITE_ORIGIN + (route === "/" ? "/" : route))}</loc></url>`,
    )
    .join("")}</urlset>`,
);
// Allow crawling the noindex shells so search engines can actually read the directive.
fs.writeFileSync(
  path.join(build, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
);
console.log(
  `Pre-rendered ${Object.keys(publicPages).length} public pages, private noindex shells, 404 and sitemap.`,
);
