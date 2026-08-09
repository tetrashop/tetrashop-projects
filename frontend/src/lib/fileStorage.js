// کتابخانه ساده ذخیره‌سازی مبتنی بر فایل JSON
// این جایگزین MongoDB است و در Vercel بدون نیاز به پایگاه داده کار می‌کند
// داده‌ها در فایل‌های موقت Vercel ذخیره می‌شوند (تا ری‌استارت بعدی)

import fs from 'fs';
import path from 'path';

const DATA_DIR = '/tmp/tetrashop-data'; // مسیر موقت در Vercel

// اطمینان از وجود پوشه داده
function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// خواندن یک مجموعه (collection)
export function readCollection(name) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// نوشتن یک مجموعه
export function writeCollection(name, data) {
  ensureDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// تولید شناسه یکتا
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
