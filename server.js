const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// سیستم مانیتورینگ برای جلوگیری از حلقه بی‌نهایت
class PerformanceMonitor {
    constructor() {
        this.executionTimes = new Map();
        this.maxExecutionTime = 30000; // 30 ثانیه
    }
    
    startMonitoring(moduleName) {
        console.log(`🔍 شروع مانیتورینگ ماژول: ${moduleName}`);
        this.executionTimes.set(moduleName, {
            start: Date.now(),
            timeout: setTimeout(() => {
                console.error(`⏰ اخطار: ماژول ${moduleName} بیش از 30 ثانیه در حال اجراست`);
            }, this.maxExecutionTime)
        });
    }
    
    stopMonitoring(moduleName) {
        const moduleData = this.executionTimes.get(moduleName);
        if (moduleData) {
            clearTimeout(moduleData.timeout);
            const executionTime = Date.now() - moduleData.start;
            console.log(`✅ ماژول ${moduleName} در ${executionTime}ms تکمیل شد`);
            this.executionTimes.delete(moduleName);
        }
    }
}

const monitor = new PerformanceMonitor();

// پایگاه دانش هوشمند
let knowledgeBase = [
    {
        id: 1,
        category: "شطرنج هوشمند",
        content: "سیستم شطرنج پیشرفته با قابلیت تحلیل عمق بازی",
        tags: ["chess", "ai", "هوش مصنوعی"],
        module: "chess-engine"
    },
    {
        id: 2,
        category: "نگار کوانتا", 
        content: "سیستم نگارش کوانتومی پیشرفته برای تولید محتوا",
        tags: ["quantum", "نوشتن", "هوش مصنوعی"],
        module: "quantum-calligraphy-advanced"
    },
    {
        id: 3,
        category: "آمان راز",
        content: "سیستم حفاظت از اسرار و امنیت داده‌ها",
        tags: ["امنیت", "رمزنگاری", "حفاظت"],
        module: "aman-secret-cluster"
    },
    {
        id: 4,
        category: "نطق مصطلح",
        content: "پایگاه دانش هوشمند برای پردازش زبان طبیعی",
        tags: ["nlp", "پردازش زبان", "هوش مصنوعی"],
        module: "speech-processor"
    }
];

app.use(express.json());
app.use(express.static('.'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// صفحه اصلی با رابط کاربری پیشرفته
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>اکوسیستم تتراشاپ - سیستم یکپارچه هوشمند</title>
        <style>
            :root {
                --primary: #2563eb;
                --secondary: #7c3aed;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --dark: #1e293b;
                --light: #f8fafc;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Vazirmatn', 'Tahoma', sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, var(--dark) 0%, #0f172a 100%);
                color: var(--light);
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
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            
            .modules-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
                box-shadow: 0 15px 30px rgba(0,0,0,0.2);
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
                <h1>🧠 اکوسیستم تتراشاپ - سیستم یکپارچه هوشمند</h1>
                <p>مدیریت و اجرای تمام ماژول‌ها با بالاترین بهره‌وری</p>
            </div>
            
            <div class="modules-grid">
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
                
                <div class="module-card" onclick="runModule('all-modules')">
                    <div class="module-icon">⚡</div>
                    <h3>اجرای کامل سیستم</h3>
                    <p>راه‌اندازی تمام ماژول‌ها به صورت یکپارچه</p>
                    <button class="btn" style="background: var(--success);">اجرای کامل</button>
                </div>
            </div>
            
            <div class="status-panel">
                <h3>📊 پنل مانیتورینگ زنده</h3>
                <div id="monitor-container">
                    <div class="monitor-item">
                        <span>وضعیت سیستم:</span>
                        <span style="color: var(--success);">✅ آماده به کار</span>
                    </div>
                </div>
            </div>
        </div>

        <script>
            async function runModule(moduleName) {
                const monitorContainer = document.getElementById('monitor-container');
                
                // اضافه کردن آیتم مانیتورینگ جدید
                const monitorItem = document.createElement('div');
                monitorItem.className = 'monitor-item';
                monitorItem.id = 'monitor-' + moduleName;
                monitorItem.innerHTML = \`
                    <span>ماژول \${moduleName}:</span>
                    <span style="color: var(--warning);">🔄 در حال اجرا...</span>
                \`;
                monitorContainer.appendChild(monitorItem);
                
                try {
                    const response = await fetch(\`/api/run-module/\${moduleName}\`, {
                        method: 'POST'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        monitorItem.innerHTML = \`
                            <span>ماژول \${moduleName}:</span>
                            <span style="color: var(--success);">✅ اجرا شد (\${data.executionTime}ms)</span>
                        \`;
                    } else {
                        monitorItem.innerHTML = \`
                            <span>ماژول \${moduleName}:</span>
                            <span style="color: var(--danger);">❌ خطا: \${data.error}</span>
                        \`;
                    }
                } catch (error) {
                    monitorItem.innerHTML = \`
                        <span>ماژول \${moduleName}:</span>
                        <span style="color: var(--danger);">❌ خطای اتصال</span>
                    \`;
                }
            }
            
            // تست خودکار اتصال به سرور
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    console.log('✅ سیستم با موفقیت راه‌اندازی شد');
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
        status: 'active',
        modules: ['chess-engine', 'quantum-calligraphy-advanced', 'aman-secret-cluster', 'speech-processor', 'natiq-ai'],
        timestamp: new Date().toISOString()
    });
});

app.post('/api/run-module/:moduleName', (req, res) => {
    const moduleName = req.params.moduleName;
    const startTime = Date.now();
    
    console.log(\`🎯 درخواست اجرای ماژول: \${moduleName}\`);
    
    // شروع مانیتورینگ
    monitor.startMonitoring(moduleName);
    
    // شبیه‌سازی اجرای ماژول
    setTimeout(() => {
        const executionTime = Date.now() - startTime;
        
        // توقف مانیتورینگ
        monitor.stopMonitoring(moduleName);
        
        console.log(\`✅ ماژول \${moduleName} با موفقیت اجرا شد (\${executionTime}ms)\`);
        
        res.json({
            success: true,
            module: moduleName,
            executionTime: executionTime,
            message: 'ماژول با موفقیت اجرا شد'
        });
    }, 2000); // شبیه‌سازی اجرای 2 ثانیه‌ای
});

// هندلر خطا
app.use((err, req, res, next) => {
    console.error('❌ خطای سرور:', err);
    res.status(500).json({ 
        success: false, 
        error: 'خطای داخلی سرور',
        message: err.message 
    });
});

// فقط برای Vercel export کنید
module.exports = app;
