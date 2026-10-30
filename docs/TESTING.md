# Testing

Probe: `node --test scripts/keep-alive.test.cjs` (local mock HTTP service; no external credentials).

Backend: `cd maintenance-tracker-backend && npm ci && npm test`.
Frontend: `cd rentflow-maintenance-frontend && npm ci && CI=true npm test -- --watchAll=false --runInBand && npm run build`.

Backend tests run the real Express demo router over HTTP without MongoDB. Assertions cover all four roles, authorized units/properties, hidden internal notes, invalid transitions, assignment, required resolution details, closure/reopening, notifications/audit, exact reporting calculations, stale/concurrent writes, reset, session deletion/expiry, forged sessions and rate limiting. Frontend tests cover landing rendering, all four launch options, credential-free session launch, tenant-specific UI and server-error feedback.

Not verified: hosted deployment, comprehensive accessibility and production browser journeys, production MongoDB authorization/migration, object storage, backup restore and external scheduler execution. DEMO.md describes the hosted acceptance journey. CI is configured; local results do not imply GitHub Actions has run.

Product UX tests and build-time SEO assertions are described in [UI_UX_AND_SEO.md](UI_UX_AND_SEO.md). An optional Chrome harness exercises the demo lifecycle through the real disposable API while using fictional fixtures for production screens. It does not verify production MongoDB authorization or deployment.
