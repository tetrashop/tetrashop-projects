const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// روت اصلی
app.get('/', (req, res) => {
    res.json({
        status: 'active',
        service: 'Natiq Backend',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// سلامت
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// API ناطق
app.get('/api/natiq/speak', (req, res) => {
    const { text = 'سلام' } = req.query;
    res.json({
        success: true,
        text: text,
        audio_url: `/api/audio/${Date.now()}`,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/natiq/speak', (req, res) => {
    const { text } = req.body;
    res.json({
        success: true,
        original_text: text,
        processed_text: `🗣️ ${text}`,
        audio_data: { format: 'mp3', duration: '5s' }
    });
});

// سرویس فایل‌های استاتیک
app.use(express.static('../'));

// صفحه تست ساده
app.get('/test', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head><title>تست سیستم ناطق</title></head>
        <body style="font-family: Tahoma; padding: 20px;">
            <h1>🧪 صفحه تست سیستم ناطق</h1>
            <button onclick="testAPI()">تست API</button>
            <div id="result"></div>
            <script>
                async function testAPI() {
                    const response = await fetch('/api/natiq/speak?text=سلام دنیا');
                    const data = await response.json();
                    document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
                }
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور Natiq راه‌اندازی شد!');
    console.log(`📍 پورت: ${PORT}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
    console.log(`🧪 تست: http://localhost:${PORT}/test`);
    console.log(`🩺 سلامت: http://localhost:${PORT}/health`);
});
