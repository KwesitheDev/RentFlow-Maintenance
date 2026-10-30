# Implementation plan

1. Completed: audit existing code; close public registration/reset-secret exposure and stale role authorization.
2. Completed: isolated four-role demo API, seeded workspace, lifecycle, notifications, optimistic concurrency, reporting, reset, role-specific UI and tests.
3. Completed: health probe, CI, deployment examples and operational documentation.
4. Pending operator deployment: deploy frontend/backend together; validate public URL, CORS, SPA rewrites and cold-start behavior.
5. Pending production domain migration: back up existing records; map every legacy user/property/request to an operator-confirmed organization; introduce organization/property/unit references and scoped indexes; dual-read legacy fields during rollout; dry-run and verify counts before enforcing references. Never infer organization ownership from untrusted client input.
6. Pending production expansion: invitation onboarding, four production roles, attachment storage with signed access, email outbox, production lifecycle migration and exhaustive cross-organization tests. Preserve legacy status mapping (pending→submitted, inProgress→inProgress, resolved→resolved) in an explicit migration.
7. Pending product work: additional marketing/SEO pages, production trend reports, real screenshots and legal copy approved by the operator.

No destructive data migration was executed.
