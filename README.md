# RentFlow Maintenance

A property maintenance workspace built with React, Express and MongoDB. RentFlow brings request intake, priorities, assignments and repair updates into a consistent interface, with an isolated four-role demonstration environment.

## Explore the product

- **Public product site:** homepage, features, manager and tenant workflows, reporting, FAQ and contact.
- **Interactive demo (`/demo`):** owner/administrator, property manager, tenant and contractor perspectives, with fictional properties, scoped access, a full repair lifecycle, notifications, reports and disposable sessions.
- **Existing customer workspace (`/app`):** administrator and manager accounts, maintenance queues, assignments, notes, property activity, people management and account settings.

Demo capabilities are broader than the existing production domain. Production organization isolation, extended production roles, invitations and secure attachments are still pending. Public registration is closed; self-service email recovery is not configured. See [production readiness](docs/PRODUCTION_READINESS.md). Public deployment of these changes has not been verified.

## Local setup

Use Node.js 22, npm and MongoDB for production-workspace functionality. The disposable demo itself does not read MongoDB.

```bash
git clone https://github.com/KwesitheDev/RentFlow-Maintenance.git
cd RentFlow-Maintenance
```

Run the remaining commands from the repository root. Install dependencies in each application:

```bash
npm ci --prefix maintenance-tracker-backend
```

```bash
npm ci --prefix rentflow-maintenance-frontend
```

Configure the backend from `maintenance-tracker-backend/.env.example`:

```env
MONGO_URI=mongodb://localhost:27017/rentflow-maintenance
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000
```

Configure the frontend from `rentflow-maintenance-frontend/.env.example`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_URL=https://rentflow-maintenance.vercel.app
```

`REACT_APP_SITE_URL` controls public canonical URLs, social metadata and sitemap generation. Set it to the actual public HTTPS origin before deploying; it is separate from the API URL. Never put server secrets in frontend environment variables.

Run the backend and frontend in separate terminals:

```bash
npm run dev --prefix maintenance-tracker-backend
```

```bash
npm start --prefix rentflow-maintenance-frontend
```

Open `http://localhost:3000` or `http://localhost:3000/demo`. Existing customer accounts can sign in; public account creation is intentionally disabled.

## Build and verify

```bash
npm test --prefix maintenance-tracker-backend
npm start --prefix maintenance-tracker-backend
```

```bash
CI=true npm test --prefix rentflow-maintenance-frontend -- --watchAll=false --runInBand
npm run build --prefix rentflow-maintenance-frontend
```

The complete frontend build pre-renders seven public pages, generates sitemap/robots files and checks metadata, headings, internal links and private indexing rules. Deploy the generated `build` folder with the included Vercel routing configuration. Other hosts need equivalent public HTML routing, a private SPA shell and proper 404 responses. See [UI, UX and SEO](docs/UI_UX_AND_SEO.md) for implementation and optional browser QA instructions.

## Operations and documentation

- [Demo deployment, seeding, access controls and reset](docs/DEMO.md)
- [Deployment and optional free-tier health probe](docs/DEPLOYMENT.md)
- [Architecture](docs/ARCHITECTURE.md) and [data model](docs/DATA_MODEL.md)
- [Security](docs/SECURITY.md), [testing](docs/TESTING.md) and [readiness](docs/PRODUCTION_READINESS.md)
- [Production audit](docs/PRODUCTION_AUDIT.md), [implementation plan](docs/IMPLEMENTATION_PLAN.md) and [change log](docs/IMPLEMENTATION_LOG.md)

The optional external GitHub scheduler calls `/api/health`, which pings MongoDB. Set repository variable `RENTFLOW_HEALTH_URL` after deployment to enable it. This is best-effort monitoring and cannot guarantee free-tier uptime or prevent provider suspension.

## API overview

Legacy production endpoints use bearer JWT authentication; `/api/users` requires an administrator. Request lists currently return up to 500 recent records.

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`, `POST /api/auth/change-password` |
| Users | `GET/POST /api/users`, `PUT/DELETE /api/users/:id` |
| Requests | `GET/POST /api/requests`, `PUT /api/requests/:id` |
| Demo | `POST /api/demo/sessions`, then authenticated workspace, role, request, notification and reset routes described in DEMO.md |
| Health | `GET /api/health` |

The public registration and reset-secret issuance endpoints are disabled. There is no legacy request-delete endpoint. Demo tokens cannot authenticate against production APIs.

## Contributing

Create a feature branch, make focused commits, run the relevant checks and open a pull request. Report general feedback through [GitHub issues](https://github.com/KwesitheDev/RentFlow-Maintenance/issues). Do not include credentials, private tenant records or sensitive security details in public issues.

Licensed under ISC.
