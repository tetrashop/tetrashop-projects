const express = require('express');
const path = require('path');
const app = express();

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '..')));

// روت اصلی برای سرویس frontend
app.get('/ui', (req, res) => {
  res.sendFile(path.join(__dirname, '../simple-frontend.html'));
});

const PORT = process.env.UI_PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🎨 سرور رابط کاربری راه‌اندازی شد!');
  console.log(`📍 آدرس: http://localhost:${PORT}/ui`);
  console.log(`📁 پوشه: ${path.join(__dirname, '..')}`);
});
