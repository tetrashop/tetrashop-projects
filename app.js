console.log('🎯 شروع اجرای سرور پایدار تتراشاپ...');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// middlewareهای ضروری
app.use(express.json());
app.use(express.static('.'));

// CORS ساده
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

console.log('✅ میدلورها تنظیم شد');

// راهنمای ماژول‌های موجود
const MODULES_INFO = {
    'chess-engine': { name: 'شطرنج هوشمند', port: 3001, available: true },
    'quantum-calligraphy-advanced': { name: 'نگار کوانتا', port: 3002, available: true },
    'aman-secret-cluster': { name: 'آمان راز', port: 3003, available: true },
    'speech-processor': { name: 'نطق مصطلح', port: 3004, available: true },
    'natiq-ai': { name: 'کوروش هوشمند', port: 3005, available: true }
};

// صفحه اصلی
app.get('/', (req, res) => {
    console.log('📥 دریافت درخواست صفحه اصلی');
    
    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تتراشاپ - سیستم یکپارچه</title>
        <style>
            :root {
                --primary: #2563eb;
                --secondary: #7c3aed;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --dark: #1e293b;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: Tahoma, sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, var(--dark) 0%, #0f172a 100%);
                color: white;
                min-height: 100vh;
                padding: 20px;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding: 30px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                border-radius: 20px;
            }
            
            .modules-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }
            
            .module-card {
                background: rgba(255,255,255,0.1);
                padding: 25px;
                border-radius: 15px;
                border: 1px solid rgba(255,255,255,0.2);
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .module-card:hover {
                transform: translateY(-5px);
                background: rgba(255,255,255,0.15);
            }
            
            .module-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            
            .btn {
                padding: 12px 24px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1rem;
                margin: 5px;
                transition: all 0.3s ease;
            }
            
            .btn:hover {
                background: var(--secondary);
                transform: translateY(-2px);
            }
            
            .btn-success {
                background: var(--success);
            }
            
            .status-panel {
                background: rgba(255,255,255,0.05);
                padding: 20px;
                border-radius: 15px;
                margin-top: 30px;
            }
            
            .monitor-item {
                padding: 10px;
                margin: 5px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧠 اکوسیستم تتراشاپ - نسخه پایدار</h1>
                <p>مدیریت هوشمند ماژول‌ها با کارایی بالا</p>
            </div>
            
            <div class="modules-grid" id="modulesGrid">
                <div class="module-card" onclick="runModule('chess-engine')">
                    <div class="module-icon">♟️</div>
                    <h3>شطرنج هوشمند</h3>
                    <p>سیستم شطرنج پیشرفته با هوش مصنوعی</p>
                    <button class="btn">اجرای ماژول</button>
                </div>
                
                <div class="module-card" onclick="runModule('quantum-calligraphy-advanced')">
                    <div class="module-icon">🖋️</div>
                    <h3>نگار کوانتا</h3>
                    <p>سیستم نگارش کوانتومی پیشرفته</p>
                    <button class="btn">اجرای ماژول</button>
                </div>
                
                <div class="module-card" onclick="runModule('aman-secret-cluster')">
                    <div class="module-icon">🛡️</div>
                    <h3>آمان راز</h3>
                    <p>سیستم امنیتی و حفاظت از اسرار</p>
                    <button class="btn">اجرای ماژول</button>
                </div>
                
                <div class="module-card" onclick="runModule('speech-processor')">
                    <div class="module-icon">🗣️</div>
                    <h3>نطق مصطلح</h3>
                    <p>پایگاه دانش هوشمند پردازش زبان</p>
                    <button class="btn">اجرای ماژول</button>
                </div>
                
                <div class="module-card" onclick="runModule('natiq-ai')">
                    <div class="module-icon">🤖</div>
                    <h3>کوروش هوشمند</h3>
                    <p>دستیار هوش مصنوعی پیشرفته</p>
                    <button class="btn">اجرای ماژول</button>
                </div>
                
                <div class="module-card" onclick="runAllModules()">
                    <div class="module-icon">⚡</div>
                    <h3>اجرای کامل سیستم</h3>
                    <p>راه‌اندازی تمام ماژول‌ها به صورت یکپارچه</p>
                    <button class="btn btn-success">اجرای کامل</button>
                </div>
            </div>
            
            <div class="status-panel">
                <h3>📊 پنل مانیتورینگ زنده</h3>
                <div id="monitorContainer">
                    <div class="monitor-item">
                        <span>وضعیت سیستم مرکزی:</span>
                        <span style="color: #10b981;">✅ فعال - پورت ${PORT}</span>
                    </div>
                    <div class="monitor-item">
                        <span>زمان راه‌اندازی:</span>
                        <span>${new Date().toLocaleString('fa-IR')}</span>
                    </div>
                </div>
            </div>
        </div>

        <script>
            async function runModule(moduleId) {
                const monitorContainer = document.getElementById('monitorContainer');
                
                const monitorItem = document.createElement('div');
                monitorItem.className = 'monitor-item';
                monitorItem.id = 'monitor-' + moduleId;
                monitorItem.innerHTML = '<span>آماده‌سازی ' + moduleId + ':</span><span style="color: #f59e0b;">🔄 در حال اجرا...</span>';
                monitorContainer.appendChild(monitorItem);
                
                try {
                    const response = await fetch('/api/run-module/' + moduleId, {
                        method: 'POST'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        monitorItem.innerHTML = '<span>' + moduleId + ':</span><span style="color: #10b981;">✅ ' + data.message + '</span>';
                    } else {
                        monitorItem.innerHTML = '<span>' + moduleId + ':</span><span style="color: #ef4444;">❌ ' + data.error + '</span>';
                    }
                } catch (error) {
                    monitorItem.innerHTML = '<span>' + moduleId + ':</span><span style="color: #ef4444;">❌ خطای اتصال</span>';
                }
            }
            
            async function runAllModules() {
                const modules = ['chess-engine', 'quantum-calligraphy-advanced', 'aman-secret-cluster', 'speech-processor', 'natiq-ai'];
                
                for (const moduleId of modules) {
                    await runModule(moduleId);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // تست اتصال به سرور
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    console.log('✅ اتصال به سرور برقرار است');
                })
                .catch(error => {
                    console.error('❌ خطا در اتصال به سرور');
                });
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
});

// API routes
app.get('/api/status', (req, res) => {
    res.json({ 
        success: true, 
        message: 'سرور فعال است',
        modules: Object.keys(MODULES_INFO),
        timestamp: new Date().toISOString()
    });
});

app.post('/api/run-module/:moduleId', (req, res) => {
    const moduleId = req.params.moduleId;
    console.log('🎯 درخواست اجرای ماژول: ' + moduleId);
    
    if (!MODULES_INFO[moduleId]) {
        return res.json({
            success: false,
            error: 'ماژول پیدا نشد'
        });
    }
    
    // شبیه‌سازی اجرای ماژول
    setTimeout(() => {
        res.json({
            success: true,
            module: moduleId,
            message: 'ماژول با موفقیت اجرا شد',
            executionTime: Math.floor(Math.random() * 2000) + 1000
        });
    }, 2000);
});

// هندلر خطا
app.use((err, req, res, next) => {
    console.error('❌ خطای سرور:', err);
    res.status(500).json({ 
        success: false, 
        error: 'خطای داخلی سرور'
    });
});

// راه‌اندازی سرور
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 سرور پایدار تتراشاپ اجرا شد!');
    console.log('🌐 آدرس: http://localhost:' + PORT);
    console.log('⏰ زمان: ' + new Date().toLocaleString('fa-IR'));
    console.log('📊 ماژول‌های فعال: ' + Object.keys(MODULES_INFO).join(', '));
});

module.exports = app;
