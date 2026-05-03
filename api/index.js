const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({
    message: "🚀 TetraSaaS API",
    nlpPosts: 251,
    status: "✅ Running on Vercel",
    developer: "رامین اجلال"
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = app;
