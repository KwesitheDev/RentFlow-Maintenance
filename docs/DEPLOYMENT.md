# Deployment and operations

Use Node 22, MongoDB and an HTTPS frontend host with React SPA rewrites. Copy the two `.env.example` files to local `.env` files; inject production values through hosting secrets. Run backend `npm ci && npm start`; run frontend `npm ci && npm run build`. Frontend API URLs are embedded at build time. Set FRONTEND_ORIGIN on the backend. See DEMO.md for the single-process requirement and public acceptance checks.

No deployment was performed: hosting credentials and control-plane access are unavailable. Existing live URLs may still serve earlier code.

## Optional health scheduler

Set GitHub repository variable RENTFLOW_HEALTH_URL to the public HTTPS `/api/health` URL. The optional workflow runs every 10 minutes or manually; an unset variable skips it. For another external scheduler, run `RENTFLOW_HEALTH_URL=https://your-api.example/api/health node scripts/keep-alive.mjs`. It queries the server, which issues a MongoDB ping with a five-second timeout. Retries accommodate a cold server; failures produce a nonzero exit status without leaking response bodies or credentials. The endpoint is limited to one call/IP/30 seconds.

A process on a paused server cannot wake itself. Scheduling is best-effort and does not guarantee uptime or prevent provider suspension; check your hosting/database plan's permitted usage. A database ping is not guaranteed to satisfy a provider's inactivity rules. GitHub scheduling may be delayed or disabled for inactive repositories. For reliable service use hosting with an uptime commitment. Keep the probe optional rather than generating artificial customer data or unbounded database writes.

## Recovery

Back up MongoDB through the configured provider before production changes; document retention and access in the operator's runbook. Restore to a separate database and verify account/request counts and permissions before switching traffic. No backup or restoration was executed here. Demo data is intentionally disposable and must never be restored into customer collections. Roll back frontend/backend together if their APIs diverge; restarting the backend safely resets only process-local demo workspaces.

## Product HTML and SEO routing

The frontend npm build now includes a postbuild renderer and SEO checks. Deploy the whole `build` directory and preserve the frontend `vercel.json` configuration. Set `REACT_APP_SITE_URL` to the actual public origin before building. Public routes use their generated HTML; app routes use a noindex shell; unknown routes must return HTTP 404. The earlier generic instruction to rewrite every URL to `/index.html` is superseded. See [UI_UX_AND_SEO.md](UI_UX_AND_SEO.md).
