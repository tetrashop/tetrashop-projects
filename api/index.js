const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// سرو فایل‌های استاتیک برای هر پروژه
app.use('/chess', express.static(path.join(__dirname, '../chess')));
app.use('/writer', express.static(path.join(__dirname, '../writer')));
app.use('/quantum', express.static(path.join(__dirname, '../quantum')));
app.use('/secret-garden', express.static(path.join(__dirname, '../secret-garden')));
app.use('/speech-recognition', express.static(path.join(__dirname, '../speech-recognition')));

// صفحه اصلی با لینک به ۵ پروژه
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>تتراشاپ - ۵ پروژه کامل</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Vazirmatn', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 30px;
          text-align: center;
          color: white;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .subtitle {
          font-size: 1.2rem;
          margin-bottom: 40px;
          opacity: 0.9;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-top: 40px;
        }
        .project-card {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 15px;
          padding: 30px 20px;
          transition: all 0.3s ease;
          text-decoration: none;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .project-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        .project-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          display: block;
        }
        .project-title {
          font-size: 1.5rem;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .project-desc {
          font-size: 0.9rem;
          opacity: 0.85;
          line-height: 1.5;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
          h1 { font-size: 2.2rem; }
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vazirmatn@33.003/font.css">
    </head>
    <body>
      <div class="container">
        <h1>🚀 تتراشاپ - پروژه‌های کامل</h1>
        <p class="subtitle">مجموعه‌ای از ۵ پروژه تعاملی و کاربردی</p>
        
        <div class="projects-grid">
          <a href="/chess" class="project-card">
            <span class="project-icon">♔</span>
            <div class="project-title">شطرنج تعاملی</div>
            <div class="project-desc">بازی شطرنج آنلاین با قابلیت ذخیره بازی و تحلیل حرکات</div>
          </a>
          
          <a href="/writer" class="project-card">
            <span class="project-icon">✍️</span>
            <div class="project-title">نویسنده هوشمند</div>
            <div class="project-desc">ابزار نوشتن با پیشنهادات هوشمند و ویرایشگر پیشرفته</div>
          </a>
          
          <a href="/quantum" class="project-card">
            <span class="project-icon">⚛️</span>
            <div class="project-title">شبیه‌ساز کوانتومی</div>
            <div class="project-desc">شبیه‌سازی مفاهیم مکانیک کوانتومی به زبان ساده</div>
          </a>
          
          <a href="/secret-garden" class="project-card">
            <span class="project-icon">🌿</span>
            <div class="project-title">باغ رازآلود</div>
            <div class="project-desc">بازی ماجراجویی با عناصر مخفی و معمای تعاملی</div>
          </a>
          
          <a href="/speech-recognition" class="project-card">
            <span class="project-icon">🎤</span>
            <div class="project-title">تشخیص گفتار فارسی</div>
            <div class="project-desc">تبدیل گفتار به متن با پشتیبانی از زبان فارسی</div>
          </a>
        </div>
        
        <div class="footer">
          <p>آدرس: tetrashop-projects-chi.vercel.app</p>
          <p>نسخه ۳.۰ | آخرین به‌روزرسانی: امروز</p>
          <p style="margin-top: 10px; font-size: 0.8rem;">
            <a href="/api/status" style="color: #a3d5ff;">وضعیت سرور</a> | 
            <a href="https://github.com" style="color: #a3d5ff;">مخزن گیت‌هاب</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API برای وضعیت
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'active',
    projects: 5,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: 'همه سیستم‌ها فعال هستند'
  });
});

// هندل ۴۰۴
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>صفحه پیدا نشد</title>
      <style>
        body { font-family: 'Vazirmatn'; text-align: center; padding: 50px; }
        h1 { color: #ff4757; }
        a { color: #3742fa; }
      </style>
    </head>
    <body>
      <h1>۴۰۴ - صفحه مورد نظر یافت نشد</h1>
      <p><a href="/">بازگشت به صفحه اصلی</a></p>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`سرور در پورت \${PORT} اجرا شد\`);
});

module.exports = app;

// اضافه کردن مسیرهای درآمدزایی
const premiumRouter = require('./premium');
const adsRouter = require('./ads');
const paymentRouter = require('./payment');
const storeRouter = require('./store');

app.use('/api/premium', premiumRouter);
app.use('/api/ads', adsRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/store', storeRouter);

// اضافه کردن بخش درآمدزایی به صفحه اصلی
app.get('/monetization', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>درآمدزایی از تتراشاپ</title>
      <style>
        body { font-family: 'Vazirmatn'; padding: 30px; }
        .income-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 50px auto; max-width: 1200px; }
        .method-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; }
        .method-icon { font-size: 60px; margin-bottom: 20px; }
        .btn-income { display: inline-block; margin-top: 20px; padding: 15px 30px; background: #0070f3; color: white; text-decoration: none; border-radius: 10px; }
        .stats { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 20px; margin: 50px auto; max-width: 800px; text-align: center; }
        .stats h2 { margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <h1 style="text-align: center;">💰 درآمدزایی از تتراشاپ</h1>
      <p style="text-align: center; max-width: 800px; margin: 20px auto;">چگونه از ۵ پروژه تتراشاپ درآمد داشته باشیم؟</p>
      
      <div class="income-methods">
        <div class="method-card">
          <div class="method-icon">👑</div>
          <h3>عضویت پریمیوم</h3>
          <p>ارائه قابلیت‌های پیشرفته به کاربران در ازای اشتراک ماهانه</p>
          <p style="color: #4CAF50; font-size: 24px;">+۲۹۰,۰۰۰ تومان در ماه</p>
          <a href="/api/premium/pricing" class="btn-income">شروع کنید</a>
        </div>
        
        <div class="method-card">
          <div class="method-icon">📢</div>
          <h3>تبلیغات</h3>
          <p>اجاره فضای تبلیغاتی به کسب‌وکارهای مرتبط</p>
          <p style="color: #4CAF50; font-size: 24px;">+۱۵۰,۰۰۰ تومان در ماه</p>
          <a href="/api/ads" class="btn-income">مشاهده نرخ‌ها</a>
        </div>
        
        <div class="method-card">
          <div class="method-icon">💻</div>
          <h3>فروش سورس کد</h3>
          <p>فروش کدهای پروژه‌ها به توسعه‌دهندگان و سازمان‌ها</p>
          <p style="color: #4CAF50; font-size: 24px;">+۵۰۰,۰۰۰ تومان در ماه</p>
          <a href="/api/store" class="btn-income">مشاهده فروشگاه</a>
        </div>
      </div>
      
      <div class="stats">
        <h2>📈 درآمد ماهانه تخمینی</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin-top: 30px;">
          <div>
            <div style="font-size: 40px;">۲۹۰,۰۰۰</div>
            <p>عضویت پریمیوم</p>
          </div>
          <div>
            <div style="font-size: 40px;">۱۵۰,۰۰۰</div>
            <p>تبلیغات</p>
          </div>
          <div>
            <div style="font-size: 40px;">۵۰۰,۰۰۰</div>
            <p>فروش سورس</p>
          </div>
          <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px;">
            <div style="font-size: 40px;">۹۴۰,۰۰۰</div>
            <p>جمع کل</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 50px;">
        <a href="/" style="color: #0070f3; text-decoration: none;">← بازگشت به صفحه اصلی</a>
      </div>
    </body>
    </html>
  `);
});
// در بخش HTML صفحه اصلی، بعد از پروژه‌ها اضافه کنید:
`
      <div style="margin: 60px 0; padding: 40px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 20px; text-align: center;">
        <h2>💰 از تتراشاپ درآمد داشته باش!</h2>
        <p>آیا می‌دانید می‌توانید از این پروژه‌ها کسب درآمد کنید؟</p>
        <div style="margin-top: 30px;">
          <a href="/monetization" style="background: white; color: #f5576c; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block; margin: 0 10px;">
            🚀 مشاهده راه‌های درآمدزایی
          </a>
          <a href="/api/premium/pricing" style="background: #333; color: white; padding: 15px 40px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block; margin: 0 10px;">
            👑 خرید اشتراک پریمیوم
          </a>
        </div>
      </div>
`;
