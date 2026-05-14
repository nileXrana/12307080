# Campus Notifications (Simple Test Project)

This is a simple Next.js + TypeScript + Material UI project for OA stages.

## What Is Included

- Stage 1 script to fetch notifications and print top 10 by priority.
- Stage 2 frontend with two pages:
	- All Notifications (`/`)
	- Priority Notifications (`/priority`)

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build Check

```bash
npm run build
```

## Stage 1 Script

```bash
node notification_app_be/stage1/top10_notifications.js
```

## Notes

- API token is read from `.env.local` (`LOG_ACCESS_TOKEN`).
- Frontend data comes through Next API routes under `app/api/*`.

## Preview Images

![First](/first.png)

![Priority](/priority.png)
