# Production audit — 2026-10-30

Baseline: Express 5/Mongoose API, React 19/CRA SPA. Existing production models are User and Request. Properties are derived from request text, not domain entities. There are two production roles (admin/manager), no organization boundary, and a three-state request model. No backend test suite or start script existed. The landing dashboard contains illustrative metrics rather than live production analytics.

Critical findings:
- Password reset returned a reset secret to unauthenticated callers. Removed secret generation/delivery endpoint until trusted delivery exists.
- Public registration assigned the first registrant admin and every later registrant manager. Public registration is now disabled.
- JWT role claims remained valid after demotion/deletion. Authentication now reloads the account and role.
- User listing excluded only passwords, potentially exposing reset-token hashes. Now uses a positive field selection.
- Production request writes accepted arbitrary bodies; these now allowlist fields and validate types/schema. Requests remain global to all authenticated managers. This remains a release blocker for customer multi-tenancy. Existing records cannot be assigned an organization safely without operator input.
- Production auth still uses browser localStorage JWTs; migration to revocable sessions is outstanding.
- No secure object storage, invitations, email queue, backup verification or comprehensive production authorization tests.

The new public demo has its own isolated API and disposable in-memory domain. It cannot query customer collections, issue production JWTs, send email or create real accounts. Tests exercise all four demo roles. Demo functionality must not be treated as completion of the production migration.

Deployment credentials and access to the hosting control planes were not provided. Public deployment is unverified. Do not call this application production-ready.
