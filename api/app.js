// app.js - فایل اصلی سرور تتراشاپ برای Vercel
const express = require('express');
const path = require('path');
const app = express();

// تنظیمات پایه
const PORT = process.env.PORT || 3000;

// Middleware‌ها
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرو فایل‌های استاتیک از پوشه‌های مختلف
app.use('/chess', express.static(path.join(__dirname, 'chess')));
app.use('/writer', express.static(path.join(__dirname, 'writer')));
app.use('/quantum', express.static(path.join(__dirname, 'quantum')));
app.use('/secret-garden', express.static(path.join(__dirname, 'secret-garden')));
app.use('/speech', express.static(path.join(__dirname, 'speech-recognition')));
app.use(express.static('public'));

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 تتراشاپ - پلتفرم ۵ پروژه هوش مصنوعی</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vazirmatn/monospace@latest/font-face.css">
            <style>
                * { font-family: 'Vazirmatn', sans-serif; box-sizing: border-box; }
                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                }
                .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 20px;
                    border: 3px solid #4361ee;
                }
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 25px;
                    margin: 40px 0;
                }
                .project-card {
                    background: rgba(255,255,255,0.05);
                    border-radius: 15px;
                    padding: 25px;
                    text-align: center;
                    border: 2px solid;
                    transition: all 0.3s;
                    text-decoration: none;
                    color: white;
                    display: block;
                }
                .project-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                }
                .project-card:nth-child(1) { border-color: #4cc9f0; }
                .project-card:nth-child(2) { border-color: #7209b7; }
                .project-card:nth-child(3) { border-color: #f72585; }
                .project-card:nth-child(4) { border-color: #00ff88; }
                .project-card:nth-child(5) { border-color: #ff9e00; }
                .btn {
                    display: inline-block;
                    background: linear-gradient(45deg, #4361ee, #3a0ca3);
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="font-size: 2.5em; margin-bottom: 10px;">🚀 تتراشاپ</h1>
                    <p style="font-size: 1.2em; color: #4cc9f0;">پلتفرم ۵ پروژه هوش مصنوعی برای بهره‌وری و درآمدزایی</p>
                    <div style="color: #00ff88; background: rgba(0,255,136,0.1); padding: 10px 20px; border-radius: 20px; display: inline-block; margin-top: 15px;">
                        ✅ سرور فعال در Vercel
                    </div>
                </div>
                
                <div class="projects-grid">
                    <a href="/chess" class="project-card">
                        <h3>♔ شطرنج پیشرفته</h3>
                        <p>هوش مصنوعی سطح گرندمستر</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/writer" class="project-card">
                        <h3>✍️ نویسنده هوشمند</h3>
                        <p>تولید محتوای حرفه‌ای</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/quantum" class="project-card">
                        <h3>⚛️ نویسنده کوانتومی</h3>
                        <p>الگوریتم‌های کوانتومی</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/secret-garden" class="project-card">
                        <h3>🔐 باغ امن</h3>
                        <p>سیستم امنیتی پیشرفته</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/speech" class="project-card">
                        <h3>🎤 تشخیص گفتار</h3>
                        <p>تبدیل گفتار به متن فارسی</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                </div>
                
                <div style="text-align: center; margin-top: 50px; padding: 25px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <h3>🔧 وضعیت سیستم</h3>
                    <p>سرور: Vercel | وضعیت: فعال ✅</p>
                    <a href="/api/status" class="btn" style="background: linear-gradient(45deg, #4cc9f0, #4895ef);">مشاهده آمار API</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Route برای هر پروژه
app.get('/chess', (req, res) => {
    res.sendFile(path.join(__dirname, 'chess/index.html'));
});

app.get('/writer', (req, res) => {
    res.sendFile(path.join(__dirname, 'writer/index.html'));
});

app.get('/quantum', (req, res) => {
    res.sendFile(path.join(__dirname, 'quantum/index.html'));
});

app.get('/secret-garden', (req, res) => {
    res.sendFile(path.join(__dirname, 'secret-garden/index.html'));
});

app.get('/speech', (req, res) => {
    res.sendFile(path.join(__dirname, 'speech-recognition/index.html'));
});

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        server: 'Tetrashop Platform',
        version: '3.0.0',
        status: 'active',
        timestamp: new Date().toISOString(),
        projects: [
            { name: 'شطرنج پیشرفته', endpoint: '/chess', active: true },
            { name: 'نویسنده هوشمند', endpoint: '/writer', active: true },
            { name: 'نویسنده کوانتومی', endpoint: '/quantum', active: true },
            { name: 'باغ امن', endpoint: '/secret-garden', active: true },
            { name: 'تشخیص گفتار', endpoint: '/speech', active: true }
        ],
        deployment: 'Vercel'
    });
});

app.get('/api/projects', (req, res) => {
    res.json({
        chess: { name: 'شطرنج پیشرفته', price: 99000, status: 'active' },
        writer: { name: 'نویسنده هوشمند', price: 149000, status: 'active' },
        quantum: { name: 'نویسنده کوانتومی', price: 199000, status: 'active' },
        security: { name: 'باغ امن', price: 299000, status: 'active' },
        speech: { name: 'تشخیص گفتار', price: 99000, status: 'active' }
    });
});

// Route 404
app.use((req, res) => {
    res.status(404).send(`
        <div style="text-align: center; padding: 50px; font-family: 'Vazirmatn';">
            <h1>۴۰۴ - صفحه پیدا نشد</h1>
            <p>صفحه مورد نظر وجود ندارد</p>
            <a href="/" style="color: #4cc9f0;">بازگشت به صفحه اصلی</a>
        </div>
    `);
});

// مدیریت خطا
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <div style="text-align: center; padding: 50px; font-family: 'Vazirmatn';">
            <h1>۵۰۰ - خطای سرور</h1>
            <p>مشکلی در سرور پیش آمده است</p>
            <a href="/" style="color: #4cc9f0;">بازگشت به صفحه اصلی</a>
        </div>
    `);
});

// نکته مهم: در Vercel از app.listen استفاده نکنید!
// فقط export کنید
module.exports = app;

// این بخش فقط برای اجرای محلی استفاده می‌شود
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 سرور تتراشاپ روی پورت ${PORT} فعال شد`);
        console.log(`🌐 آدرس: http://localhost:${PORT}`);
    });
}
