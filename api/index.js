const http = require('http');
const fs = require('fs');
const path = require('path');

const projects = {
  'chess': { file: 'chess/index.html', title: 'شطرنج' },
  'quantum-writer': { file: 'quantum-writer/quantum-writer.html', title: 'نویسنده کوانتومی' },
  'speech-recognition': { file: 'speech-recognition/index.html', title: 'تشخیص صوت' },
  'intelligent-writer': { file: 'intelligent-writer-backup-20251021/index.html', title: 'نویسنده هوشمند' },
  'secret-garden': { file: 'secret-garden/index.html', title: 'باغ آرزو' }
};

const server = http.createServer((req, res) => {
  const url = req.url.replace(/^\//, '').replace(/\/$/, '');
  
  // صفحه اصلی
  if (!url) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پروژه‌های من</title>
        <style>
          body { font-family: Tahoma; direction: rtl; padding: 20px; background: #f5f5f5; }
          h1 { color: #333; text-align: center; }
          .projects { max-width: 800px; margin: 0 auto; }
          .project { background: white; margin: 15px; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          a { color: #0066cc; text-decoration: none; font-size: 18px; }
          a:hover { text-decoration: underline; }
          .path { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="projects">
          <h1>پروژه‌های Tetrashop</h1>
          ${Object.entries(projects).map(([key, proj]) => `
            <div class="project">
              <a href="/${key}">${proj.title}</a>
              <div class="path">مسیر: /${key}</div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `);
    return;
  }
  
  // اگر پروژه شناخته شده است
  if (projects[url]) {
    const filePath = path.join(__dirname, '..', projects[url].file);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <h1>فایل ${projects[url].file} یافت نشد</h1>
          <p>مسیر: ${filePath}</p>
          <a href="/">بازگشت به صفحه اصلی</a>
        `);
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <h1>خطای سرور</h1>
        <pre>${error.message}</pre>
        <a href="/">بازگشت به صفحه اصلی</a>
      `);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>صفحه یافت نشد</h1>
      <p>آدرس "${req.url}" وجود ندارد</p>
      <a href="/">بازگشت به صفحه اصلی</a>
    `);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT}⁹ اجرا شد`);
});
