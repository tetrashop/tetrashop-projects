const http = require('http');
const fs = require('fs');
const path = require('path');

// لیست پروژه‌ها با مسیرهای صحیح
const projects = {
  'chess': { 
    file: 'chess/index.html', 
    title: 'شطرنج هوشمند',
    description: 'سیستم شطرنج با هوش مصنوعی'
  },
  'quantum-writer': { 
    file: 'quantum-writer/quantum-writer.html', 
    title: 'نویسنده کوانتومی',
    description: 'تولید محتوا با الگوریتم‌های کوانتومی'
  },
  'speech-recognition': { 
    file: 'speech-recognition/index.html', 
    title: 'تشخیص صوت',
    description: 'سیستم تشخیص گفتار فارسی'
  },
  'intelligent-writer': { 
    file: 'intelligent-writer-backup-20251021/index.html', 
    title: 'نویسنده هوشمند',
    description: 'تولید محتوای هوشمند'
  },
  'secret-garden': { 
    file: 'secret-garden/index.html', 
    title: 'باغ آرزو',
    description: 'مدیریت اهداف و آرزوها'
  }
};

const server = http.createServer((req, res) => {
  const url = req.url.replace(/^\//, '').replace(/\/$/, '');
  
  // صفحه اصلی
  if (!url) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>پروژه‌های Tetrashop</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: Tahoma, Arial; 
          direction: rtl; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 50px; color: white; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .projects-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
          gap: 25px; 
        }
        .project-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          transition: transform 0.3s;
        }
        .project-card:hover { transform: translateY(-5px); }
        .project-title { 
          color: #333; 
          font-size: 1.4rem; 
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .project-desc { color: #666; margin-bottom: 20px; line-height: 1.6; }
        .project-link {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
        }
        .project-link:hover { background: #5a67d8; }
        .icon { font-size: 1.5rem; }
        footer { 
          text-align: center; 
          margin-top: 50px; 
          color: white; 
          opacity: 0.8; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🎯 پروژه‌های Tetrashop</h1>
          <p>انتخاب و مشاهده پروژه‌ها</p>
        </header>
        
        <div class="projects-grid">
          ${Object.entries(projects).map(([key, project]) => `
            <div class="project-card">
              <h2 class="project-title">
                <span class="icon">
                  ${key === 'chess' ? '♔' : 
                    key === 'quantum-writer' ? '⚛️' : 
                    key === 'speech-recognition' ? '🎤' : 
                    key === 'intelligent-writer' ? '✍️' : 
                    key === 'secret-garden' ? '🌷' : '📁'}
                </span>
                ${project.title}
              </h2>
              <p class="project-desc">${project.description}</p>
              <a href="/${key}" class="project-link">ورود به پروژه →</a>
            </div>
          `).join('')}
        </div>
        
        <footer>
          <p>© 2024 - تمامی حقوق محفوظ است</p>
          <p>تعداد پروژه‌ها: ${Object.keys(projects).length}</p>
        </footer>
      </div>
    </body>
    </html>
    `;
    res.end(html);
    return;
  }
  
  // اگر پروژه شناخته شده است
  if (projects[url]) {
    // استفاده از مسیر مطلق
    const baseDir = process.cwd();
    const filePath = path.join(baseDir, projects[url].file);
    
    console.log('درخواست برای:', url);
    console.log('مسیر فایل:', filePath);
    
    try {
      // بررسی وجود فایل
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      } else {
        // برای quantum-writer که فایل quantum-writer.html دارد
        if (url === 'quantum-writer') {
          const altPath = path.join(baseDir, 'quantum-writer/quantum-writer.html');
          if (fs.existsSync(altPath)) {
            const content = fs.readFileSync(altPath, 'utf8');
            res.writeHead(200, { 
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache'
            });
            res.end(content);
            return;
          }
        }
        
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <html dir="rtl">
          <head><title>خطا</title></head>
          <body style="font-family: Tahoma; padding: 40px;">
            <h1>فایل پروژه یافت نشد</h1>
            <p>فایل <strong>${projects[url].file}</strong> در مسیر زیر پیدا نشد:</p>
            <pre>${filePath}</pre>
            <a href="/">← بازگشت به صفحه اصلی</a>
          </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('خطا در خواندن فایل:', error);
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html dir="rtl">
        <head><title>خطای سرور</title></head>
        <body style="font-family: Tahoma; padding: 40px;">
          <h1>خطای سرور</h1>
          <pre>${error.message}</pre>
          <a href="/">← بازگشت به صفحه اصلی</a>
        </body>
        </html>
      `);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html dir="rtl">
      <head><title>صفحه یافت نشد</title></head>
      <body style="font-family: Tahoma; padding: 40px;">
        <h1>صفحه یافت نشد (۴۰۴)</h1>
        <p>آدرس <strong>${req.url}</strong> وجود ندارد.</p>
        <a href="/">← بازگشت به صفحه اصلی</a>
      </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`🚀 سرور در پورت \${PORT} اجرا شد\`);
  console.log(\`📁 مسیر جاری: \${process.cwd()}\`);
});
