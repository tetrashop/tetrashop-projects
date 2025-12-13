// api/index.js را با این کد جایگزین کنید
const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.json());

// سرو فایل‌های استاتیک
app.use('/chess', express.static(path.join(__dirname, '../chess')));
app.use('/writer', express.static(path.join(__dirname, '../writer')));
app.use('/quantum', express.static(path.join(__dirname, '../quantum')));
app.use('/secret-garden', express.static(path.join(__dirname, '../secret-garden')));
app.use('/speech', express.static(path.join(__dirname, '../speech-recognition')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// صفحه اصلی HTML کامل
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 تتراشاپ - پلتفرم هوش مصنوعی</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vazirmatn/monospace@latest/font-face.css">
            <style>
                * {
                    font-family: 'Vazirmatn', sans-serif;
                    box-sizing: border-box;
                }
                
                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
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
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
                    min-height: 200px;
                    position: relative;
                    overflow: hidden;
                }
                
                .project-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s;
                }
                
                .project-card:hover::before {
                    transform: translateX(100%);
                }
                
                .project-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.4);
                }
                
                .project-card.chess {
                    border-color: #4cc9f0;
                    background: linear-gradient(135deg, rgba(76, 201, 240, 0.1), transparent);
                }
                
                .project-card.writer {
                    border-color: #7209b7;
                    background: linear-gradient(135deg, rgba(114, 9, 183, 0.1), transparent);
                }
                
                .project-card.quantum {
                    border-color: #f72585;
                    background: linear-gradient(135deg, rgba(247, 37, 133, 0.1), transparent);
                }
                
                .project-card.security {
                    border-color: #00ff88;
                    background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), transparent);
                }
                
                .project-card.speech {
                    border-color: #ff9e00;
                    background: linear-gradient(135deg, rgba(255, 158, 0, 0.1), transparent);
                }
                
                .project-icon {
                    font-size: 3em;
                    margin-bottom: 15px;
                    display: block;
                }
                
                .btn {
                    display: inline-block;
                    background: linear-gradient(45deg, #4361ee, #3a0ca3);
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 15px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(67, 97, 238, 0.4);
                }
                
                .status-badge {
                    display: inline-block;
                    background: linear-gradient(45deg, #00ff88, #4cc9f0);
                    color: #000;
                    padding: 8px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                
                .api-section {
                    background: rgba(0,0,0,0.2);
                    padding: 25px;
                    border-radius: 15px;
                    margin: 30px 0;
                    border: 1px solid #4cc9f0;
                }
                
                @media (max-width: 768px) {
                    .projects-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .container {
                        padding: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="font-size: 2.5em; margin-bottom: 10px;">🚀 تتراشاپ</h1>
                    <p style="font-size: 1.2em; color: #4cc9f0; margin-bottom: 15px;">
                        پلتفرم ۵ پروژه هوش مصنوعی برای بهره‌وری و درآمدزایی
                    </p>
                    <div class="status-badge">
                        ✅ سرور فعال | Vercel Deployment
                    </div>
                    <p style="margin-top: 15px; color: #aaa;">
                        آدرس پروژه: <strong>tetrashop-projects-chi.vercel.app</strong>
                    </p>
                </div>
                
                <div class="projects-grid">
                    <a href="/chess" class="project-card chess">
                        <span class="project-icon">♔</span>
                        <h3>شطرنج پیشرفته</h3>
                        <p>هوش مصنوعی سطح GM با قابلیت بازی آنلاین</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/writer" class="project-card writer">
                        <span class="project-icon">✍️</span>
                        <h3>نویسنده هوشمند</h3>
                        <p>تولید محتوای حرفه‌ای با هوش مصنوعی</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/quantum" class="project-card quantum">
                        <span class="project-icon">⚛️</span>
                        <h3>نویسنده کوانتومی</h3>
                        <p>الگوریتم‌های کوانتومی برای محتوای فوق‌هوشمند</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/secret-garden" class="project-card security">
                        <span class="project-icon">🔐</span>
                        <h3>باغ امن</h3>
                        <p>سیستم امنیتی پیشرفته با رمزنگاری کوانتومی</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                    
                    <a href="/speech" class="project-card speech">
                        <span class="project-icon">🎤</span>
                        <h3>تشخیص گفتار</h3>
                        <p>تبدیل گفتار به متن فارسی با دقت ۹۹٪</p>
                        <div class="btn">ورود به پروژه</div>
                    </a>
                </div>
                
                <div class="api-section">
                    <h3>🔧 API‌های فعال</h3>
                    <p>برای توسعه‌دهندگان و تست سیستم</p>
                    <div style="margin: 20px 0;">
                        <a href="/api/status" class="btn" style="background: linear-gradient(45deg, #4cc9f0, #4895ef);">
                            📊 آمار سیستم
                        </a>
                        <a href="/api/projects" class="btn" style="background: linear-gradient(45deg, #7209b7, #560bad);">
                            📋 لیست پروژه‌ها
                        </a>
                        <a href="/api/marketplace" class="btn" style="background: linear-gradient(45deg, #f72585, #b5179e);">
                            💰 فروشگاه
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px;">
                    <h3>📊 اطلاعات فنی</h3>
                    <p>پلتفرم: Vercel | Runtime: Node.js | وضعیت: فعال</p>
                    <p>زمان سرور: <span id="serverTime">${new Date().toLocaleString('fa-IR')}</span></p>
                </div>
            </div>
            
            <script>
                // به‌روزرسانی زمان
                function updateTime() {
                    const now = new Date();
                    const options = { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false 
                    };
                    document.getElementById('serverTime').textContent = 
                        now.toLocaleString('fa-IR', options);
                }
                
                setInterval(updateTime, 1000);
                updateTime();
                
                // کنسول لاگ برای توسعه‌دهندگان
                console.log('🚀 تتراشاپ فعال است!');
                console.log('🌐 آدرس: https://tetrashop-projects-chi.vercel.app');
                console.log('📅 تاریخ: ' + new Date().toISOString());
            </script>
        </body>
        </html>
    `);
});

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        server: 'Tetrashop Platform',
        version: '3.0.0',
        status: 'active',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        url: 'https://tetrashop-projects-chi.vercel.app',
        endpoints: [
            '/api/status',
            '/api/projects',
            '/api/marketplace',
            '/chess',
            '/writer',
            '/quantum',
            '/secret-garden',
            '/speech'
        ]
    });
});

app.get('/api/projects', (req, res) => {
    res.json([
        { id: 1, name: 'شطرنج پیشرفته', path: '/chess', price: 99000, status: 'active' },
        { id: 2, name: 'نویسنده هوشمند', path: '/writer', price: 149000, status: 'active' },
        { id: 3, name: 'نویسنده کوانتومی', path: '/quantum', price: 199000, status: 'active' },
        { id: 4, name: 'باغ امن', path: '/secret-garden', price: 299000, status: 'active' },
        { id: 5, name: 'تشخیص گفتار', path: '/speech', price: 99000, status: 'active' }
    ]);
});

app.get('/api/marketplace', (req, res) => {
    res.json({
        plans: [
            { name: 'پایه', price: 99000, projects: 1, features: ['دسترسی محدود', 'پشتیب ایمیل'] },
            { name: 'حرفه‌ای', price: 299000, projects: 3, features: ['دسترسی نامحدود', 'پشتیب تلفنی'] },
            { name: 'سازمانی', price: 499000, projects: 5, features: ['همه پروژه‌ها', 'پشتیب VIP', 'API اختصاصی'] }
        ]
    });
});

// Redirect برای پروژه‌ها (اگر فایل HTML وجود نداشت)
app.get('/chess', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head><title>شطرنج پیشرفته</title></head>
        <body style="font-family: Vazirmatn; padding: 50px;">
            <h1>♔ شطرنج پیشرفته</h1>
            <p>پروژه شطرنج در حال توسعه است...</p>
            <a href="/">بازگشت به صفحه اصلی</a>
        </body>
        </html>
    `);
});

app.get('/writer', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head><title>نویسنده هوشمند</title></head>
        <body style="font-family: Vazirmatn; padding: 50px;">
            <h1>✍️ نویسنده هوشمند</h1>
            <p>پروژه نویسنده در حال توسعه است...</p>
            <a href="/">بازگشت به صفحه اصلی</a>
        </body>
        </html>
    `);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send(`
        <html dir="rtl">
        <head>
            <title>۴۰۴ - صفحه پیدا نشد</title>
            <style>
                body { font-family: 'Vazirmatn'; text-align: center; padding: 100px; background: #0f0c29; color: white; }
            </style>
        </head>
        <body>
            <h1>۴۰۴ - صفحه پیدا نشد</h1>
            <p>صفحه مورد نظر وجود ندارد</p>
            <a href="/" style="color: #4cc9f0;">بازگشت به صفحه اصلی</a>
        </body>
        </html>
    `);
});

module.exports = app;
