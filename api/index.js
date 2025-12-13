const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.json({ message: 'تتراشاپ فعال است!', success: true });
});
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});
module.exports = app;
