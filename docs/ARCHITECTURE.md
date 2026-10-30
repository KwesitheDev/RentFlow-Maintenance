# Architecture

React SPA calls an Express API. Legacy production routes use JWT identity refreshed from MongoDB. Production data is persisted by Mongoose. `/api/demo/*` is an independent router using random opaque sessions and isolated process-local fictional workspaces. It never imports production models. A lazy-loaded demo frontend chunk avoids adding its interface to the initial landing-page bundle. Demo payloads and resource counts are bounded; analytics operate on at most 100 requests.

The health endpoint checks server reachability plus a bounded MongoDB ping. An optional external GitHub Actions probe exercises this endpoint. CI runs backend integration tests, frontend component tests and an optimized build.
