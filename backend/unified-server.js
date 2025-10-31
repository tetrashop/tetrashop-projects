const express = require('express');
const path = require('path');
const app = express();

// سرویس‌های API
app.use('/api', require('./routes/api'));

// سرویس فایل‌های استاتیک (اگر frontend build شده exists)
if (require('fs').existsSync('../frontend/dist')) {
    app.use(express.static('../frontend/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
} else {
    // صفحه ساده برای تست
    app.get('*', (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head><title>سیستم ناطق</title></head>
            <body style="font-family: Tahoma; padding: 20px;">
                <h1>🚀 سیستم ناطق فعال است</h1>
                <p>Backend: ✅ فعال</p>
                <p>Frontend: ⚠️ نیاز به build دارد</p>
                <p><a href="/api/natiq">تست API</a></p>
            </body>
            </html>
        `);
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 سرور یکپارچه روی پورت ${PORT} راه‌اندازی شد`);
});
