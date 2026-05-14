/*
  Send a small set of evaluation logs to the external logging endpoint.
  Reads LOG_ACCESS_TOKEN from process.env or .env.local
*/

const fs = require('fs');
const path = require('path');

function loadToken() {
  if (process.env.LOG_ACCESS_TOKEN) return process.env.LOG_ACCESS_TOKEN;
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return '';
  const content = fs.readFileSync(envPath, 'utf8');
  const m = content.match(/LOG_ACCESS_TOKEN=(.+)/);
  return m ? m[1].trim() : '';
}

const ACCESS_TOKEN = loadToken();
if (!ACCESS_TOKEN) {
  console.error('LOG_ACCESS_TOKEN not found in env or .env.local');
  process.exit(1);
}

const LOG_URL = 'http://4.224.186.213/evaluation-service/logs';

const logs = [
  { level: 'info', pkg: 'service', message: 'dev server started' },
  { level: 'info', pkg: 'route', message: 'added api/notifications' },
  { level: 'info', pkg: 'route', message: 'added api/log' },
  { level: 'info', pkg: 'page', message: 'added priority page' },
  { level: 'info', pkg: 'cleanup', message: 'removed empty folders' },
  { level: 'info', pkg: 'docs', message: 'updated README and design doc' },
  { level: 'info', pkg: 'build', message: 'build completed successfully' },
  // error logs
  { level: 'error', pkg: 'build', message: 'build failed: JSX syntax' },
  { level: 'error', pkg: 'api', message: 'CORS header conflict' },
  { level: 'error', pkg: 'auth', message: 'invalid authorization token' },
];

async function sendLog(l) {
  try {
    const res = await fetch(LOG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack: 'backend',
        level: l.level,
        package: l.pkg,
        message: l.message,
      }),
    });
    const txt = await res.text();
    console.log(`Sent: ${l.level} | ${l.pkg} | ${l.message} -> ${res.status} ${res.statusText} | ${txt}`);
  } catch (err) {
    console.error('Failed to send log:', err.message || err);
  }
}

(async () => {
  for (const l of logs) {
    // small delay
    await new Promise((r) => setTimeout(r, 200));
    // send
    // eslint-disable-next-line no-await-in-loop
    await sendLog(l);
  }
})();
