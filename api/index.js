const http = require('http');
const fs = require('fs');
const path = require('path');

// لیست پروژه‌ها - همه مسیرها را امتحان می‌کنیم
const projects = {
  'chess': { 
    files: [
      'public/chess/index.html',
      'chess/index.html'
    ],
    title: 'شطرنج هوشمند'
  },
  'quantum-writer': { 
    files: [
      'public/quantum-writer/quantum-writer.html',
      'quantum-writer/quantum-writer.html'
    ],
    title: 'نویسنده کوانتومی'
  },
  'speech-recognition': { 
    files: [
      'public/speech-recognition/index.html',
      'speech-recognition/index.html'
    ],
    title: 'تشخیص صوت'
  },
  'intelligent-writer': { 
    files: [
      'public/intelligent-writer/index.html',
      'intelligent-writer-backup-20251021/index.html'
    ],
    title: 'نویسنده هوشمند'
  },
  'secret-garden': { 
    files: [
      'public/secret-garden/index.html',
      'secret-garden/index.html'
    ],
    title: 'باغ آرزو'
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
            <a href="/${key}">ورود به پروژه →</a>
          </div>
        `).join('')}
      </div>
      <hr>
      <div style="color: #666; font-size: 12px;">
        <p>مسیر جاری سرور: <span id="path"></span></p>
        <p>پورت: <span id="port"></span></p>
      </div>
      <script>
        document.getElementById('path').textContent = window.location.hostname;
        document.getElementById('port').textContent = window.location.port || 80;
      </script>
    </body>
    </html>
    `;
    res.end(html);
    return;
  }
  
  // اگر پروژه شناخته شده است
  if (projects[url]) {
    const baseDir = process.cwd();
    console.log(`\n=== درخواست برای: ${url} ===`);
    console.log('مسیر جاری:', baseDir);
    
    let foundFile = null;
    let foundPath = null;
    
    // تمام مسیرهای ممکن را امتحان کن
    for (const file of projects[url].files) {
      const filePath = path.join(baseDir, file);
      console.log(`جستجو در: ${filePath}`);
      
      if (fs.existsSync(filePath)) {
        foundFile = file;
        foundPath = filePath;
        console.log(`✅ فایل پیدا شد: ${filePath}`);
        break;
      }
    }
    
    if (foundFile) {
      try {
        const content = fs.readFileSync(foundPath, 'utf8');
        res.writeHead(200, { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      } catch (error) {
        console.error('خطا در خواندن فایل:', error);
        sendError(res, 500, `خطا در خواندن فایل: ${error.message}`);
      }
    } else {
      console.log(`❌ هیچ یک از مسیرها پیدا نشد:`, projects[url].files);
      
      // لیست فایل‌های موجود را چاپ کن
      console.log('فایل‌های موجود در مسیر جاری:');
      try {
        const files = fs.readdirSync(baseDir);
        console.log(files);
        
        // بررسی وجود پوشه public
        const publicPath = path.join(baseDir, 'public');
        if (fs.existsSync(publicPath)) {
          console.log('محتوای پوشه public:');
          const publicFiles = fs.readdirSync(publicPath);
          console.log(publicFiles);
        }
      } catch (err) {
        console.log('خطا در لیست کردن فایل‌ها:', err.message);
      }
      
      sendError(res, 404, `
        <h2>فایل پروژه "${projects[url].title}" یافت نشد</h2>
        <p>مسیرهای جستجو شده:</p>
        <ul>
          ${projects[url].files.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <p>مسیر جاری سرور: ${baseDir}</p>
      `);
    }
  } else {
    sendError(res, 404, `<h2>پروژه "${url}" یافت نشد</h2>`);
  }
});

function sendError(res, code, message) {
  res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head><title>خطا ${code}</title></head>
    <body style="font-family: Tahoma; padding: 40px;">
      ${message}
      <p><a href="/">← بازگشت به صفحه اصلی</a></p>
    </body>
    </html>
  `);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 سرور در پورت " + PORT + " اجرا شد");
  console.log("📂 مسیر جاری: " + process.cwd());
  
  // بررسی وجود پوشه public
  const publicPath = path.join(process.cwd(), 'public');
  console.log("🔍 بررسی پوشه public: " + (fs.existsSync(publicPath) ? "✅ وجود دارد" : "❌ وجود ندارد"));
  
  if (fs.existsSync(publicPath)) {
    console.log("📁 محتوای پوشه public:");
    try {
      const files = fs.readdirSync(publicPath);
      files.forEach(file => {
        const fullPath = path.join(publicPath, file);
        const isDir = fs.statSync(fullPath).isDirectory();
        console.log(`  ${isDir ? '📁' : '📄'} ${file}`);
      });
    } catch (err) {
      console.log("  خطا در خواندن محتوا:", err.message);
    }
  }
});
