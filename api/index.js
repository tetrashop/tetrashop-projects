const http = require('http');
const fs = require('fs');
const path = require('path');

// لیست پروژه‌ها با مسیرهای صحیح - فقط یک تعریف!
const projects = {
  'chess': { 
    file: 'public/chess/index.html', 
    title: 'شطرنج هوشمند',
    description: 'سیستم شطرنج با هوش مصنوعی'
  },
  'quantum-writer': { 
    file: 'public/quantum-writer/quantum-writer.html', 
    title: 'نویسنده کوانتومی',
    description: 'تولید محتوا با الگوریتم‌های کوانتومی'
  },
  'speech-recognition': { 
    file: 'public/speech-recognition/index.html', 
    title: 'تشخیص صوت',
    description: 'سیستم تشخیص گفتار فارسی'
  },
  'intelligent-writer': { 
    file: 'public/intelligent-writer/index.html', 
    title: 'نویسنده هوشمند',
    description: 'تولید محتوای هوشمند'
  },
  'secret-garden': { 
    file: 'public/secret-garden/index.html', 
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
        body { font-family: Tahoma; direction: rtl; padding: 20px; }
        .project { background: #f5f5f5; margin: 10px; padding: 15px; border-radius: 8px; }
        h1 { color: #333; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>پروژه‌های Tetrashop</h1>
      <div>
        ${Object.entries(projects).map(([key, project]) => `
          <div class="project">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="/${key}">ورود به پروژه →</a>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
    `;
    res.end(html);
    return;
  }
  
  // اگر پروژه شناخته شده است
  if (projects[url]) {
    const baseDir = process.cwd();
    const filePath = path.join(baseDir, projects[url].file);
    
    console.log('درخواست برای:', url);
    console.log('مسیر فایل:', filePath);
    console.log('مسیر جاری:', baseDir);
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      } else {
        // بررسی مسیرهای جایگزین
        const altPaths = [
          filePath,
          path.join(baseDir, projects[url].file.replace('public/', '')),
          path.join(__dirname, '..', projects[url].file)
        ];
        
        let found = false;
        for (const altPath of altPaths) {
          if (fs.existsSync(altPath)) {
            const content = fs.readFileSync(altPath, 'utf8');
            res.writeHead(200, { 
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache'
            });
            res.end(content);
            found = true;
            break;
          }
        }
        
        if (!found) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <html dir="rtl">
            <body style="font-family: Tahoma; padding: 40px;">
              <h1>فایل پروژه یافت نشد</h1>
              <p>فایل <strong>${projects[url].file}</strong> پیدا نشد.</p>
              <p>مسیرهای جستجو شده:</p>
              <ul>
                ${altPaths.map(p => `<li>${p}</li>`).join('')}
              </ul>
              <a href="/">← بازگشت به صفحه اصلی</a>
            </body>
            </html>
          `);
        }
      }
    } catch (error) {
      console.error('خطا در خواندن فایل:', error);
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html dir="rtl">
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
  console.log("Server started on port: " + PORT);
  console.log("Current directory: " + process.cwd());
  
  // بررسی وجود فایل‌ها
  console.log("\nبررسی فایل‌های پروژه:");
  Object.entries(projects).forEach(([key, project]) => {
    const filePath = path.join(process.cwd(), project.file);
    console.log(`${fs.existsSync(filePath) ? '✅' : '❌'} ${key}: ${filePath}`);
  });
});
