## Architecture Overview

Simple description of the project architecture and data flow:

- Frontend (Next.js app in `app/`)
	- Pages: `/` (All Notifications), `/priority` (Priority Notifications)
	- Calls local API routes under `/api/*` to get data or send logs.

- API routes (Next.js server routes under `app/api/`)
	- `/api/notifications` — proxies requests to the external Notifications API and returns the JSON to the frontend.
	- `/api/log` — forwards log payloads to the external logging endpoint; keeps the access token on the server.

- External services
	- Evaluation Service: `http://4.224.186.213` (notifications + logs endpoints).

- Logging helper
	- `logging/middleware/log.ts` — reusable function originally provided; used server-side to send logs to the external service.

## Important files (review these)

- `app/page.tsx` — All Notifications page (simple list, filters, mark viewed)
- `app/priority/page.tsx` — Priority page (top‑n by weight+recency)
- `app/api/notifications/route.ts` — Notifications proxy
- `app/api/log/route.ts` — Log forwarding route (server-side token)
- `logging/middleware/log.ts` — reusable Log implementation
- `notification_app_be/stage1/top10_notifications.js` — Stage 1 priority script
- `.env.local` — put `LOG_ACCESS_TOKEN` here for local development (already ignored by git)
- `README.md` — short run instructions
- `notification_system_design.md` — this file (architecture notes)

## Notes

- Frontend never sends the secret token; all external calls that require the token are made from server routes.
- Stage 1 uses a simple priority algorithm (type weight + recency) and keeps top‑n efficiently using a small heap.

If you want any extra simplification or an exported image of this architecture, tell me and I will add it.
