const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;

// فقط یک سرور ساده که لینک‌های مستقیم می‌دهد
const server = http.createServer((req, res) => {
  const url = req.url.replace(/^\//, '').replace(/\/$/, '');
  
  if (!url) {
    // صفحه اصلی با لینک‌های مستقیم به فایل‌های استاتیک
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>پروژه‌های Tetrashop</title>
      <style>
        body { font-family: Tahoma; direction: rtl; padding: 40px; background: #f5f5f5; }
        h1 { color: #333; text-align: center; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
        .project-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .project-title { color: #2c3e50; margin-bottom: 10px; }
        .project-link { display: inline-block; background: #3498db; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 10px; }
        .project-link:hover { background: #2980b9; }
      </style>
    </head>
    <body>
      <h1>پروژه‌های Tetrashop</h1>
      <div class="project-grid">
        <div class="project-card">
          <h3 class="project-title">♔ شطرنج هوشمند</h3>
          <p>سیستم شطرنج با هوش مصنوعی</p>
          <a href="/chess/index.html" class="project-link">ورود به پروژه</a>
        </div>
        
        <div class="project-card">
          <h3 class="project-title">⚛️ نویسنده کوانتومی</h3>
          <p>تولید محتوا با الگوریتم‌های کوانتومی</p>
          <a href="/quantum-writer/quantum-writer.html" class="project-link">ورود به پروژه</a>
        </div>
        
        <div class="project-card">
          <h3 class="project-title">🎤 تشخیص صوت</h3>
          <p>سیستم تشخیص گفتار فارسی</p>
          <a href="/speech-recognition/index.html" class="project-link">ورود به پروژه</a>
        </div>
        
        <div class="project-card">
          <h3 class="project-title">✍️ نویسنده هوشمند</h3>
          <p>تولید محتوای هوشمند</p>
          <a href="/intelligent-writer-backup-20251021/index.html" class="project-link">ورود به پروژه</a>
        </div>
        
        <div class="project-card">
          <h3 class="project-title">🌷 باغ آرزو</h3>
          <p>مدیریت اهداف و آرزوها</p>
          <a href="/secret-garden/index.html" class="project-link">ورود به پروژه</a>
        </div>
      </div>
    </body>
    </html>
    `);
    return;
  }
  
  // برای بقیه درخواست‌ها، ۴۰۴ بده یا به صفحه اصلی ریدایرکت کن
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <html dir="rtl">
    <body style="font-family: Tahoma; padding: 40px;">
      <h1>صفحه یافت نشد</h1>
      <p>از لینک‌های صفحه اصلی استفاده کنید.</p>
      <a href="/">بازگشت به صفحه اصلی</a>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log("✅ سرور Tetrashop در پورت " + PORT + " آماده است");
  console.log("🌐 آدرس: http://localhost:" + PORT);
});
