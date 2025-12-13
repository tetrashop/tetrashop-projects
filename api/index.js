const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('<h1>تتراشاپ فعال شد!</h1><p>مشکل پوشه حل شده است.</p>'));
app.get('/api/status', (req, res) => res.json({status: 'ok'}));
module.exports = app;
