// Send a single concise log using LOG_ACCESS_TOKEN from env/.env.local
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
  console.error('Missing LOG_ACCESS_TOKEN');
  process.exit(1);
}

const LOG_URL = 'http://4.224.186.213/evaluation-service/logs';

async function send() {
  const log = {
    stack: 'backend',
    level: 'info',
    package: 'submission',
    message: 'stage2 frontend implemented',
  };

  try {
    const res = await fetch(LOG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(log),
    });

    const body = await res.text();
    console.log('Sent log:', res.status, body);
  } catch (err) {
    console.error('Send failed:', err.message || err);
  }
}

send();
