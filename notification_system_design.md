# Stage 1

## Problem
Students get too many notifications and can miss important ones. The task is to show top 10 unread notifications based on:
1. Type priority: Placement > Result > Event
2. Recency: newer notifications should come first for same type priority

## API Used
- `GET http://4.224.186.213/evaluation-service/notifications`
- Protected route using bearer token (`LOG_ACCESS_TOKEN`)

## Simple Solution
I created one basic script:
- `notification_app_be/stage1/top10_notifications.js`

It does this:
1. Reads token from `LOG_ACCESS_TOKEN` (or `.env.local`).
2. Fetches notifications from the API.
3. Assigns weight:
	- Placement = 3
	- Result = 2
	- Event = 1
4. Uses timestamp as tie-breaker (newer first).
5. Prints top 10 priority notifications.

## Efficient Top 10 Maintenance (for incoming notifications)
To handle continuous incoming notifications efficiently, the script uses a min-heap of size 10:
1. If heap size < 10, push notification.
2. If heap is full, compare with smallest priority item in heap.
3. Replace only when new item has higher priority.

This avoids sorting full data repeatedly.

## Complexity
- For `m` notifications and top `n=10`:
- Total complexity: `O(m log n)`
- Since `n` is small and fixed (10), this is near linear in practice.

## How To Run
```bash
node notification_app_be/stage1/top10_notifications.js
```

## Screenshot Note
After running, capture terminal output screenshot and add it under:
- `notification_app_be/stage1/screenshots/`
