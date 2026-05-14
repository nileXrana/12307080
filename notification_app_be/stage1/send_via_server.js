// Send a single log to the local server route /api/log
const fetch = require('node-fetch');

async function send() {
  const url = 'http://localhost:3000/api/log';
  const payload = {
    stack: 'backend',
    level: 'info',
    pkg: 'submission',
    message: 'stage2 frontend implemented (server)'
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await res.text();
    console.log('Server route response:', res.status, body);
  } catch (err) {
    console.error('Failed to call local /api/log:', err.message || err);
    process.exitCode = 1;
  }
}

send();
