# Security

Public registration and reset-secret disclosure are disabled. Existing production JWTs are checked against current user existence/role. User listings use allowlisted output fields. Legacy request writes allowlist fields, validate primitive types/notes and run schema validators; list responses are bounded to 500 records (full pagination remains pending). API JSON bodies are capped at 32 KB, basic security headers are set and auth attempts are rate-limited per IP. Configure an exact FRONTEND_ORIGIN and HTTPS termination.

Demo sessions have independent random tokens, absolute expiry, resource limits, role and property checks, request revision checks, filtered internal notes and no production model access. CORS is not authorization; bearer tokens must remain private. Demo responses disable caching/indexing. No external integrations or files are accepted. Current rate limits are single-process; distributed deployment needs shared limit/session storage.

Known production blockers: global request collection, localStorage JWT revocation limitations, missing invitation onboarding, attachment storage and organization migration. Do not onboard unrelated customer organizations yet. Rotate JWT_SECRET if compromise is suspected; this signs out all existing production sessions. Never publish database credentials or real records in demo fixtures.
