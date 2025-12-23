// Ultra-simple JSON-based database for initial development
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../database.json');

// Initial database structure
const initialDB = {
  services: [
    { id: 1, slug: 'image-enhancement', name: 'Image Enhancement', category: 'Computer Vision', pricePerCall: 100 },
    { id: 2, slug: 'sentiment-analysis', name: 'Sentiment Analysis', category: 'NLP', pricePerCall: 60 },
    { id: 3, slug: 'speech-to-text', name: 'Speech to Text', category: 'Audio Processing', pricePerCall: 110 }
  ],
  apiKeys: [
    { id: 1, apiKey: 'ts_live_sample_1234567890', name: 'Sample Key', tenantId: 'tenant_dev_1', balance: 50000, rateLimit: 1000 }
  ],
  logs: []
};

// Load or create database
let db;
try {
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } else {
    db = initialDB;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
} catch (error) {
  db = initialDB;
}

export const simpleDatabase = {
  getAllServices() {
    return db.services;
  },
  
  getServiceBySlug(slug) {
    return db.services.find(s => s.slug === slug);
  },
  
  validateApiKey(apiKey) {
    const key = db.apiKeys.find(k => k.apiKey === apiKey);
    return key ? { ...key, isValid: true } : null;
  },
  
  logRequest(apiKeyId, serviceId, data) {
    const log = {
      id: db.logs.length + 1,
      apiKeyId,
      serviceId,
      timestamp: new Date().toISOString(),
      ...data
    };
    db.logs.push(log);
    this.save();
    return log;
  },
  
  save() {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } catch (error) {
      console.error('Failed to save database:', error.message);
    }
  }
};

export default simpleDatabase;
