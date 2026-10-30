# Product interface, UX and technical SEO

## Design and navigation

The product uses warm neutral surfaces, forest green accents, a shared brand, consistent controls and responsive spacing. Public pages explain maintenance workflows through product previews, role descriptions and practical examples. Illustrations are explicitly fictional; there are no invented testimonials, customers or performance claims. The landing page uses HTML/CSS rather than a large remote background photograph. No webfont download is required.

Public routes: `/`, `/features`, `/property-managers`, `/tenant-portal`, `/reporting`, `/faq`, `/contact`. Public signup is closed, so account-access and recovery pages explain the available next step rather than submitting forms to disabled endpoints. The FAQ distinguishes extended demo capabilities from existing production capabilities. Contact links to the real project issue tracker and warns that issues are public; no unconnected contact form is presented.

The authenticated workspace includes a working mobile menu and bottom navigation, account links, meaningful loading/error/empty states, request search and status/priority/property filters, sortable columns with keyboard-accessible buttons, 12-row client pagination, request details, assignment/priority editing and notes. Status saves send only the editable field, compatible with backend allowlisting. The property page never fabricates customer inventory on load errors; it groups actual maintenance activity. Account settings no longer present unsaved notification checkboxes. Team management includes inline feedback, duplicate-submit prevention and named destructive controls.

Dialogs use native `<dialog>` behavior for focus containment and Escape, restore focus on close and lock background scrolling. Reduced-motion preferences, skip links, visible focus, semantic headings, labeled controls and print styles are included. Opening a demo request scrolls and focuses its detail panel. Expired demo actions return to role selection; revision conflicts refresh the workspace while retaining error feedback.

## Build and metadata

Run `npm run build` in `rentflow-maintenance-frontend`. CRA builds the client; the npm `postbuild` hook then renders public React components with ReactDOMServer and writes static HTML. It never imports customer data or connects to MongoDB. Run the complete npm build, rather than calling `react-scripts build` directly: the latter skips HTML generation and checks.

Set `REACT_APP_SITE_URL` to the actual HTTPS public origin, with no path or trailing slash. The default is the existing `https://rentflow-maintenance.vercel.app` origin. The generator loads CRA’s production environment files so browser and static metadata use the same configuration. Rebuild whenever the origin changes. `REACT_APP_API_URL` remains the separate API base URL.

Every public page has:
- Readable initial HTML, one main heading and real anchor links.
- A unique title and description; one absolute self-canonical.
- Open Graph and Twitter metadata using the local 1200×630 PNG social card.
- WebSite JSON-LD describing the actual site, without fabricated reviews or offers.

Public routes alone appear in the generated sitemap; `robots.txt` references its configured origin. Private app, demo, auth and error routes use `noindex, nofollow` metadata and Vercel headers. They are crawlable so a crawler can read noindex; robots blocking is not used as a substitute for noindex or backend authorization. Query parameters are excluded from public canonical URLs.

The Vercel configuration maps public paths to their generated HTML, maps `/app` paths to a noindex SPA shell, redirects old app aliases and leaves unknown paths to the generated `404.html` rather than a blanket 200 rewrite. Do not replace this configuration with a catch-all homepage rewrite. Other hosts must reproduce these mappings and serve missing paths with HTTP 404. Direct navigation and HTTP status behavior on the deployed host remain to be verified.

The browser updates metadata during client navigation, removes public canonicals and structured data in private views and focuses the new page heading. Static markup provides public content before the client starts; the existing React app takes over with createRoot, not hydration.

## Verification

- `CI=true npm test -- --watchAll=false --runInBand`: product navigation, available account flows, metadata changes, canonical removal, mobile app menu, request filters, narrow status payloads, property failure recovery, named dialogs and demo entry.
- `npm run build`: optimized build followed by automated checks for seven public pages, six private/error shells, unique metadata, one h1/canonical per public page, internal links, sitemap exclusions, crawl directives and the social image.
- Optional browser smoke: install backend/frontend dependencies, build first, then run `node scripts/browser-smoke.mjs` from the frontend using Node 22 and an existing `google-chrome` executable. Set `CHROME_BIN` if needed. On Node 20, `node --experimental-websocket scripts/browser-smoke.mjs` is needed. No browser is downloaded. The script starts loopback-only servers and a temporary Chrome profile, intercepts every `/api/` request, uses fictional production-workspace fixtures and the real in-memory demo router, and tears down its processes. It tests public routes, mobile overflow/navigation, dialog focus/Escape, a status save and the tenant→manager→contractor→tenant lifecycle. Screenshots are written to a temporary directory reported by the script. It never uses real production credentials or records.

Local checks do not prove search rankings, live indexing, Core Web Vitals or hosting correctness. After deployment, verify direct route status codes, inspect rendered URLs in Search Console, submit `/sitemap.xml`, test the social card and measure representative mobile loads. No Search Console account, live indexing change, production deployment or real-user performance measurement was performed here. The CRA dependency tree still reports security advisories and requires a separate, deliberate tooling upgrade; no breaking automatic audit fix was applied.

References used: [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [noindex requirements](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
