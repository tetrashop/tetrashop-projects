// لایه ذخیره‌سازی دوگانه
// اگر MONGODB_URI تنظیم شده باشد از MongoDB استفاده می‌کند
// در غیر این صورت از FileStorage (فایل JSON) استفاده می‌کند

let dbModule = null;

async function getDb() {
  if (dbModule) return dbModule;

  if (process.env.MONGODB_URI) {
    try {
      const mongoose = require('mongoose');
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI);
      }
      dbModule = 'mongodb';
      return 'mongodb';
    } catch (e) {
      console.warn('MongoDB connection failed, falling back to FileStorage');
    }
  }

  // fallback: FileStorage
  const fs = require('fs');
  const path = require('path');
  const DATA_DIR = '/tmp/tetrashop-data';

  function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  dbModule = {
    readCollection(name) {
      ensureDir();
      const filePath = path.join(DATA_DIR, `${name}.json`);
      if (!fs.existsSync(filePath)) return [];
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        return [];
      }
    },
    writeCollection(name, data) {
      ensureDir();
      const filePath = path.join(DATA_DIR, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    },
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },
  };

  return dbModule;
}

export async function readCollection(name) {
  const db = await getDb();
  if (db === 'mongodb') {
    const mongoose = require('mongoose');
    const model = mongoose.models[name] || mongoose.model(name, new mongoose.Schema({}, { strict: false }), name);
    return model.find({}).lean();
  }
  return db.readCollection(name);
}

export async function writeCollection(name, data) {
  const db = await getDb();
  if (db === 'mongodb') {
    const mongoose = require('mongoose');
    const model = mongoose.models[name] || mongoose.model(name, new mongoose.Schema({}, { strict: false }), name);
    if (Array.isArray(data)) {
      await model.deleteMany({});
      await model.insertMany(data);
    } else {
      const doc = new model(data);
      await doc.save();
    }
    return;
  }
  db.writeCollection(name, data);
}

export async function generateId() {
  const db = await getDb();
  if (db === 'mongodb') {
    return new (require('mongoose').Types.ObjectId)().toString();
  }
  return db.generateId();
}
