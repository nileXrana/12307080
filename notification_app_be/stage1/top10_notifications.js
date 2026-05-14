/*
  Stage 1 - Campus Notifications Microservice
  Simple script to fetch notifications and print top 10 priority unread notifications.
*/

const fs = require('fs');
const path = require('path');

const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
const TOP_N = 10;

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function loadEnvLocalToken() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return '';

  const content = fs.readFileSync(envPath, 'utf8');
  const line = content
    .split('\n')
    .find((row) => row.trim().startsWith('LOG_ACCESS_TOKEN='));

  if (!line) return '';
  return line.substring('LOG_ACCESS_TOKEN='.length).trim();
}

function parseTimestamp(value) {
  // API format: "YYYY-MM-DD HH:mm:ss"
  // Convert to ISO-like format for stable Date parsing.
  const normalized = value.replace(' ', 'T') + 'Z';
  return new Date(normalized).getTime();
}

function comparePriority(a, b) {
  // Higher weight first. If same weight, newer timestamp first.
  if (a.weight !== b.weight) return a.weight - b.weight;
  return a.time - b.time;
}

class MinHeap {
  constructor(compareFn) {
    this.compare = compareFn;
    this.data = [];
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(item) {
    this.data.push(item);
    this.heapifyUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return null;
    if (this.data.length === 1) return this.data.pop();

    const root = this.data[0];
    this.data[0] = this.data.pop();
    this.heapifyDown(0);
    return root;
  }

  replaceTop(item) {
    this.data[0] = item;
    this.heapifyDown(0);
  }

  heapifyUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[index], this.data[parent]) >= 0) break;
      [this.data[index], this.data[parent]] = [this.data[parent], this.data[index]];
      index = parent;
    }
  }

  heapifyDown(index) {
    const n = this.data.length;

    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) {
        smallest = left;
      }

      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === index) break;
      [this.data[index], this.data[smallest]] = [this.data[smallest], this.data[index]];
      index = smallest;
    }
  }
}

function keepTopN(notifications, n) {
  const heap = new MinHeap(comparePriority);

  for (const notif of notifications) {
    const item = {
      id: notif.ID,
      type: notif.Type,
      message: notif.Message,
      timestamp: notif.Timestamp,
      weight: TYPE_WEIGHT[notif.Type] || 0,
      time: parseTimestamp(notif.Timestamp),
    };

    if (heap.size() < n) {
      heap.push(item);
      continue;
    }

    // If current item has higher priority than smallest in heap, replace.
    if (comparePriority(item, heap.peek()) > 0) {
      heap.replaceTop(item);
    }
  }

  return heap.data.sort((a, b) => comparePriority(b, a));
}

async function fetchNotifications(token) {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`Notification API failed (${response.status}): ${JSON.stringify(body)}`);
  }

  return body.notifications || [];
}

async function main() {
  try {
    const token = process.env.LOG_ACCESS_TOKEN || loadEnvLocalToken();

    if (!token) {
      throw new Error('LOG_ACCESS_TOKEN is missing. Set it in env or .env.local');
    }

    const notifications = await fetchNotifications(token);
    const top10 = keepTopN(notifications, TOP_N);

    console.log('Top 10 Priority Unread Notifications');
    console.log('-----------------------------------');

    top10.forEach((n, idx) => {
      console.log(
        `${idx + 1}. [${n.type}] ${n.message} | ${n.timestamp} | weight=${n.weight}`
      );
    });
  } catch (error) {
    console.error('Stage 1 script failed:', error.message);
    process.exitCode = 1;
  }
}

main();
