console.log('🟢 فایل server.js شروع به اجرا شد');
const express = require('express');
const app = express();
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// سیستم مانیتورینگ پیشرفته
class PerformanceMonitor {
    constructor() {
        this.executionTimes = new Map();
        this.maxExecutionTime = 30000;
        this.activeProcesses = new Map();
    }
    
    startMonitoring(moduleName) {
        console.log('🔍 شروع مانیتورینگ ماژول: ' + moduleName);
        this.executionTimes.set(moduleName, {
            start: Date.now(),
            timeout: setTimeout(() => {
                console.error('⏰ اخطار: ماژول ' + moduleName + ' بیش از 30 ثانیه در حال اجراست');
                this.forceStop(moduleName);
            }, this.maxExecutionTime)
        });
    }
    
    stopMonitoring(moduleName) {
        const moduleData = this.executionTimes.get(moduleName);
        if (moduleData) {
            clearTimeout(moduleData.timeout);
            const executionTime = Date.now() - moduleData.start;
            console.log('✅ ماژول ' + moduleName + ' در ' + executionTime + 'ms تکمیل شد');
            this.executionTimes.delete(moduleName);
        }
        this.activeProcesses.delete(moduleName);
    }
    
    forceStop(moduleName) {
        const process = this.activeProcesses.get(moduleName);
        if (process) {
            process.kill();
            console.log('🛑 توقف اضطراری ماژول: ' + moduleName);
        }
    }
    
    setProcess(moduleName, process) {
        this.activeProcesses.set(moduleName, process);
    }
}

const monitor = new PerformanceMonitor();

app.use(express.json());
app.use(express.static('.'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ماژول‌های واقعی سیستم با مسیرهای صحیح
const MODULES = {
    'chess-engine': {
        name: 'شطرنج هوشمند',
        path: './chess-engine',
        scripts: ['index.js', 'server.js', 'app.js', 'main.js'],
        port: 3001,
        status: 'inactive'
    },
    'quantum-calligraphy-advanced': {
        name: 'نگار کوانتا',
        path: './quantum-calligraphy-advanced',
        scripts: ['index.js', 'server.js', 'app.js', 'main.js'],
        port: 3002,
        status: 'inactive'
    },
    'aman-secret-cluster': {
        name: 'آمان راز',
        path: './aman-secret-cluster',
        scripts: ['index.js', 'server.js', 'app.js', 'main.js'],
        port: 3003,
        status: 'inactive'
    },
    'speech-processor': {
        name: 'نطق مصطلح',
        path: './speech-processor',
        scripts: ['index.js', 'server.js', 'app.js', 'main.js'],
        port: 3004,
        status: 'inactive'
    },
    'natiq-ai': {
        name: 'کوروش هوشمند',
        path: './natiq-ai',
        scripts: ['index.js', 'server.js', 'app.js', 'main.js'],
        port: 3005,
        status: 'inactive'
    }
};

// تابع برای پیدا کردن فایل اجرایی ماژول
function findModuleScript(modulePath, scripts) {
    for (const script of scripts) {
        const scriptPath = path.join(modulePath, script);
        if (fs.existsSync(scriptPath)) {
            return script;
        }
    }
    return null;
}

// تابع برای بررسی وضعیت پورت
function checkPortStatus(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const tester = net.createServer()
            .once('error', () => resolve(false))
            .once('listening', () => {
                tester.close();
                resolve(true);
            })
            .listen(port);
    });
}

// صفحه اصلی
app.get('/', (req, res) => {
    const html = `<!DOCTYPE html>
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
            font-family: system-ui, -apple-system, sans-serif;
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
        }
        
        .module-card.available:hover {
            transform: translateY(-5px);
            background: rgba(255,255,255,0.15);
            cursor: pointer;
        }
        
        .module-card.unavailable {
            opacity: 0.6;
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
        
        .btn-warning {
            background: var(--warning);
        }
        
        .btn-danger {
            background: var(--danger);
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
        
        .module-status {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: 10px;
        }
        
        .status-active { background: var(--success); }
        .status-inactive { background: var(--danger); }
        .status-loading { background: var(--warning); }
        
        .module-info {
            font-size: 0.9em;
            opacity: 0.8;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 اکوسیستم تتراشاپ - سیستم یکپارچه هوشمند</h1>
            <p>مدیریت و اجرای تمام ماژول‌ها با بالاترین بهره‌وری</p>
        </div>
        
        <div class="modules-grid" id="modules-container">
            <!-- ماژول‌ها توسط JavaScript لود می‌شوند -->
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <button class="btn btn-success" onclick="runAllModules()">⚡ اجرای تمام ماژول‌های قابل دسترس</button>
        </div>
        
        <div class="status-panel">
            <h3>📊 پنل مانیتورینگ زنده</h3>
            <div id="monitor-container">
                <div class="monitor-item">
                    <span>وضعیت سیستم مرکزی:</span>
                    <span style="color: var(--success);">✅ فعال - پورت 3000</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        async function loadModules() {
            try {
                const response = await fetch('/api/modules');
                const modules = await response.json();
                
                const container = document.getElementById('modules-container');
                container.innerHTML = '';
                
                modules.forEach(module => {
                    const moduleCard = document.createElement('div');
                    moduleCard.className = module.available ? 'module-card available' : 'module-card unavailable';
                    moduleCard.onclick = module.available ? () => runModule(module.id) : null;
                    
                    moduleCard.innerHTML = '<div class="module-icon">' + module.icon + '</div>' +
                        '<h3>' + module.name + ' <span class="module-status status-' + module.status + '"></span></h3>' +
                        '<p>' + module.description + '</p>' +
                        '<div class="module-info">' + 
                            (module.script ? 'فایل: ' + module.script : '') +
                            (module.port ? ' | پورت: ' + module.port : '') +
                        '</div>' +
                        '<button class="btn ' + (module.status === 'active' ? 'btn-warning' : (module.available ? '' : 'btn-danger')) + '" ' +
                                'onclick="event.stopPropagation(); ' + (module.available ? 'runModule(\\'' + module.id + '\\')' : '') + '">' +
                            (module.status === 'active' ? '🔄 در حال اجرا' : (module.available ? '🚀 اجرای ماژول' : '❌ غیرفعال')) +
                        '</button>' +
                        (module.available ? '' : '<div style="color: var(--warning); margin-top: 10px;">⚠️ پوشه موجود است اما فایل اجرایی یافت نشد</div>');
                    container.appendChild(moduleCard);
                });
                
            } catch (error) {
                console.error('خطا در بارگذاری ماژول‌ها:', error);
            }
        }
        
        async function runModule(moduleId) {
            const monitorContainer = document.getElementById('monitor-container');
            
            // حذف مانیتور قدیمی اگر وجود دارد
            const oldMonitor = document.getElementById('monitor-' + moduleId);
            if (oldMonitor) oldMonitor.remove();
            
            const monitorItem = document.createElement('div');
            monitorItem.className = 'monitor-item';
            monitorItem.id = 'monitor-' + moduleId;
            monitorItem.innerHTML = '<span>آماده‌سازی ماژول ' + moduleId + ':</span><span style="color: var(--warning);">🔄 در حال بررسی...</span>';
            monitorContainer.appendChild(monitorItem);
            
            try {
                const response = await fetch('/api/run-module/' + moduleId, {
                    method: 'POST'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    monitorItem.innerHTML = '<span>ماژول ' + moduleId + ':</span><span style="color: var(--success);">✅ ' + data.message + ' (' + data.executionTime + 'ms)</span>';
                    if (data.port) {
                        const portMonitor = document.createElement('div');
                        portMonitor.className = 'monitor-item';
                        portMonitor.innerHTML = '<span>پورت سرویس ' + moduleId + ':</span><span style="color: var(--success);">🌐 http://localhost:' + data.port + '</span>';
                        monitorContainer.appendChild(portMonitor);
                    }
                    // رفرش لیست ماژول‌ها
                    setTimeout(loadModules, 2000);
                } else {
                    monitorItem.innerHTML = '<span>ماژول ' + moduleId + ':</span><span style="color: var(--danger);">❌ ' + data.error + '</span>';
                }
            } catch (error) {
                monitorItem.innerHTML = '<span>ماژول ' + moduleId + ':</span><span style="color: var(--danger);">❌ خطای اتصال به سرور</span>';
            }
        }
        
        async function runAllModules() {
            const response = await fetch('/api/modules');
            const modules = await response.json();
            const availableModules = modules.filter(m => m.available);
            
            for (const module of availableModules) {
                await runModule(module.id);
                // تأخیر بین اجرای ماژول‌ها
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        
        // بارگذاری اولیه ماژول‌ها
        document.addEventListener('DOMContentLoaded', loadModules);
        
        // رفرش هر 15 ثانیه
        setInterval(loadModules, 15000);
    </script>
</body>
</html>`;
    res.send(html);
});

// API routes
app.get('/api/status', (req, res) => {
    res.json({ 
        success: true, 
        status: 'active',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/modules', async (req, res) => {
    const modulesList = [];
    
    for (const moduleId of Object.keys(MODULES)) {
        const module = MODULES[moduleId];
        const available = fs.existsSync(module.path);
        let script = null;
        let status = 'inactive';
        
        if (available) {
            script = findModuleScript(module.path, module.scripts);
            // بررسی اینکه ماژول در حال اجراست
            status = await checkPortStatus(module.port) ? 'active' : 'inactive';
            MODULES[moduleId].status = status;
        }
        
        modulesList.push({
            id: moduleId,
            name: module.name,
            description: 'سیستم ' + module.name + ' پیشرفته',
            icon: getModuleIcon(moduleId),
            status: status,
            available: available && script !== null,
            script: script,
            port: module.port,
            path: module.path
        });
    }
    
    res.json(modulesList);
});

app.post('/api/run-module/:moduleId', async (req, res) => {
    const moduleId = req.params.moduleId;
    const startTime = Date.now();
    
    console.log('🎯 درخواست اجرای ماژول: ' + moduleId);
    
    if (!MODULES[moduleId]) {
        return res.json({
            success: false,
            error: 'ماژول پیدا نشد'
        });
    }
    
    const module = MODULES[moduleId];
    
    // بررسی وجود پوشه ماژول
    if (!fs.existsSync(module.path)) {
        return res.json({
            success: false,
            error: 'پوشه ماژول پیدا نشد: ' + module.path
        });
    }
    
    // پیدا کردن فایل اجرایی
    const script = findModuleScript(module.path, module.scripts);
    if (!script) {
        return res.json({
            success: false,
            error: 'هیچ فایل اجرایی در ماژول پیدا نشد'
        });
    }
    
    // بررسی اینکه ماژول قبلاً اجرا شده
    const isAlreadyRunning = await checkPortStatus(module.port);
    if (isAlreadyRunning) {
        return res.json({
            success: true,
            module: moduleId,
            executionTime: 0,
            message: 'ماژول از قبل در حال اجراست',
            port: module.port
        });
    }
    
    monitor.startMonitoring(moduleId);
    
    try {
        const scriptPath = path.join(module.path, script);
        console.log('🚀 اجرای فایل: ' + scriptPath);
        
        // اجرای ماژول
        const moduleProcess = spawn('node', [scriptPath], {
            cwd: module.path,
            stdio: 'pipe',
            detached: false
        });
        
        monitor.setProcess(moduleId, moduleProcess);
        
        moduleProcess.stdout.on('data', (data) => {
            console.log('[' + moduleId + ' stdout]: ' + data);
        });
        
        moduleProcess.stderr.on('data', (data) => {
            console.error('[' + moduleId + ' stderr]: ' + data);
        });
        
        moduleProcess.on('close', (code) => {
            console.log('[' + moduleId + '] فرآیند با کد ' + code + ' بسته شد');
            monitor.stopMonitoring(moduleId);
            MODULES[moduleId].status = 'inactive';
        });
        
        // صبر کردن برای اجرای ماژول
        await new Promise((resolve) => {
            setTimeout(() => {
                const executionTime = Date.now() - startTime;
                console.log('✅ ماژول ' + moduleId + ' اجرا شد (' + executionTime + 'ms)');
                MODULES[moduleId].status = 'active';
                resolve();
            }, 5000); // زمان بیشتر برای اجرای واقعی ماژول
        });
        
        const executionTime = Date.now() - startTime;
        
        res.json({
            success: true,
            module: moduleId,
            executionTime: executionTime,
            message: 'ماژول با موفقیت اجرا شد',
            port: module.port,
            script: script
        });
        
    } catch (error) {
        monitor.stopMonitoring(moduleId);
        res.json({
            success: false,
            error: 'خطا در اجرای ماژول: ' + error.message
        });
    }
});

// تابع helper برای آیکون‌ها
function getModuleIcon(moduleId) {
    const icons = {
        'chess-engine': '♟️',
        'quantum-calligraphy-advanced': '🖋️',
        'aman-secret-cluster': '🛡️',
        'speech-processor': '🗣️',
        'natiq-ai': '🤖'
    };
    return icons[moduleId] || '⚡';
}

app.use((err, req, res, next) => {
    console.error('❌ خطای سرور:', err);
    res.status(500).json({ 
        success: false, 
        error: 'خطای داخلی سرور',
        message: err.message 
    });
});

module.exports = app;
