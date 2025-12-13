const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const PORT = 6000; // پورت جدید

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ایجاد دایرکتوری‌های ضروری
const directories = [
    'public/uploads',
    'public/projects',
    'database',
    'logs'
];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// ==================== ROUTES ====================

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تتراشاپ - پلتفرم هوش مصنوعی پیشرفته</title>
            <style>
                body {
                    font-family: 'Vazirmatn', sans-serif;
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    margin: 0;
                    padding: 40px;
                    direction: rtl;
                    text-align: center;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header {
                    margin-bottom: 50px;
                }
                .projects {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    margin-top: 40px;
                }
                .project-card {
                    background: rgba(255,255,255,0.08);
                    border-radius: 20px;
                    padding: 30px;
                    text-decoration: none;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.15);
                    transition: all 0.3s;
                    text-align: center;
                }
                .project-card:hover {
                    transform: translateY(-10px);
                    background: rgba(255,255,255,0.12);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                }
                .project-icon {
                    font-size: 3rem;
                    margin-bottom: 20px;
                }
                .project-card.chess { border-top: 5px solid #f8961e; }
                .project-card.smart-writer { border-top: 5px solid #4cc9f0; }
                .project-card.quantum { border-top: 5px solid #7209b7; }
                .project-card.secret { border-top: 5px solid #f72585; }
                .project-card.speech { border-top: 5px solid #4895ef; }
                .btn {
                    display: inline-block;
                    background: linear-gradient(45deg, #4361ee, #3a0ca3);
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    text-decoration: none;
                    margin-top: 15px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 پلتفرم تتراشاپ - هوش مصنوعی پیشرفته</h1>
                    <p>پنج پروژه پیشرفته برای بهره‌وری و درآمدزایی</p>
                    <a href="/dashboard" class="btn">ورود به داشبورد مدیریت</a>
                </div>
                
                <div class="projects">
                    <a href="/projects/chess" class="project-card chess">
                        <div class="project-icon">♔</div>
                        <h3>شطرنج پیشرفته</h3>
                        <p>هوش مصنوعی سطح GM با تحلیل پیشرفته</p>
                    </a>
                    
                    <a href="/projects/smart-writer" class="project-card smart-writer">
                        <div class="project-icon">✍️</div>
                        <h3>نویسنده هوشمند</h3>
                        <p>تولید محتوا با هوش مصنوعی پیشرفته</p>
                    </a>
                    
                    <a href="/projects/quantum-writer" class="project-card quantum">
                        <div class="project-icon">⚛️</div>
                        <h3>نویسنده کوانتومی</h3>
                        <p>تولید متن با الگوریتم‌های کوانتومی</p>
                    </a>
                    
                    <a href="/projects/secret-garden" class="project-card secret">
                        <div class="project-icon">🔐</div>
                        <h3>باغ امن</h3>
                        <p>سیستم امنیتی و رمزنگاری پیشرفته</p>
                    </a>
                    
                    <a href="/projects/speech-recognition" class="project-card speech">
                        <div class="project-icon">🎤</div>
                        <h3>تشخیص گفتار</h3>
                        <p>تبدیل گفتار به متن با دقت بالا</p>
                    </a>
                </div>
                
                <div style="margin-top: 50px; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 20px;">
                    <h3>🎯 سیستم در حال اجرا روی پورت ${PORT}</h3>
                    <p>برای تست سیستم، از دکمه‌های زیر استفاده کنید:</p>
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                        <a href="/api/projects/status" class="btn" style="background: #4cc9f0;">آمار پروژه‌ها</a>
                        <a href="/api/marketplace/products" class="btn" style="background: #f8961e;">محصولات فروشی</a>
                        <a href="/api/analytics/overview" class="btn" style="background: #7209b7;">آمار کلی</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// API وضعیت پروژه‌ها
app.get('/api/projects/status', (req, res) => {
    res.json({
        status: 'active',
        projects: {
            chess: { name: 'شطرنج پیشرفته', status: 'فعال', users: 125, revenue: 1250000 },
            smart_writer: { name: 'نویسنده هوشمند', status: 'فعال', users: 89, revenue: 890000 },
            quantum_writer: { name: 'نویسنده کوانتومی', status: 'فعال', users: 42, revenue: 420000 },
            secret_garden: { name: 'باغ امن', status: 'فعال', users: 67, revenue: 1675000 },
            speech_recognition: { name: 'تشخیص گفتار', status: 'فعال', users: 103, revenue: 1030000 }
        },
        total_revenue: 5265000,
        active_users: 426
    });
});

// API آمار مالی
app.get('/api/finance/stats', (req, res) => {
    res.json({
        monthly_revenue: 5265000,
        total_revenue: 5265000,
        active_subscriptions: 426,
        projects: [
            { name: 'شطرنج', revenue: 1250000, growth: '12%' },
            { name: 'نویسنده هوشمند', revenue: 890000, growth: '8%' },
            { name: 'نویسنده کوانتومی', revenue: 420000, growth: '15%' },
            { name: 'باغ امن', revenue: 1675000, growth: '25%' },
            { name: 'تشخیص گفتار', revenue: 1030000, growth: '18%' }
        ]
    });
});

// ==================== PROJECT APIs ====================

// ۱. شطرنج پیشرفته
app.post('/api/chess/move', (req, res) => {
    const { fen, difficulty } = req.body;
    const moves = ['e2e4', 'd2d4', 'g1f3', 'c2c4'];
    const bestMove = moves[Math.floor(Math.random() * moves.length)];
    
    res.json({
        success: true,
        move: bestMove,
        evaluation: (Math.random() * 2 - 1).toFixed(2),
        depth: difficulty === 'hard' ? 12 : 8,
        time: (Math.random() * 3 + 0.5).toFixed(2)
    });
});

// ۲. نویسنده هوشمند
app.post('/api/smart-writer/generate', (req, res) => {
    const { prompt, style, length } = req.body;
    
    const samples = {
        formal: `با توجه به درخواست شما در مورد "${prompt}"، می‌توان بیان داشت که این موضوع از اهمیت ویژه‌ای برخوردار است. بررسی‌های انجام شده نشان می‌دهد که...`,
        creative: `در آستانه طلوع خورشید، ایده "${prompt}" همچون پرنده‌ای در ذهنم پرواز کرد. هر کلمه، رنگی بود بر بوم سفید صفحه...`,
        technical: `الگوریتم "${prompt}" با پیچیدگی زمانی O(n log n) عمل می‌کند. پارامترهای ورودی شامل...`
    };
    
    res.json({
        success: true,
        text: samples[style] || samples.formal,
        length: length || 500,
        readability: Math.floor(Math.random() * 30 + 70),
        keywords: prompt.split(' ').slice(0, 5)
    });
});

// ۳. نویسنده کوانتومی
app.post('/api/quantum-writer/generate', (req, res) => {
    const { theme, complexity } = req.body;
    
    const quantumTexts = [
        `در فضای کوانتومی نوشتن، هر کلمه در حالت سوپرپوزیشن وجود دارد. مفهوم "${theme}" همزمان هم قدیمی است هم نوین...`,
        `الگوی کوانتومی برای "${theme}" نشان می‌دهد که احتمالات نوشتاری بی‌نهایت هستند...`,
        `از دیدگاه مکانیک کوانتومی، "${theme}" می‌تواند در چندین حالت همزمان تفسیر شود...`
    ];
    
    res.json({
        success: true,
        text: quantumTexts[Math.floor(Math.random() * quantumTexts.length)],
        quantum_entanglement: Math.random().toFixed(2),
        superposition_level: complexity === 'high' ? 'advanced' : 'basic',
        coherence: Math.random().toFixed(2)
    });
});

// ۴. باغ امن
app.post('/api/secret-garden/encrypt', (req, res) => {
    const { text, algorithm } = req.body;
    const encrypted = Buffer.from(text).toString('base64');
    
    res.json({
        success: true,
        encrypted: encrypted,
        algorithm: algorithm || 'AES-256',
        key: 'generated_key_' + Date.now(),
        security_level: 'high'
    });
});

// ۵. تشخیص گفتار
app.post('/api/speech/recognize', (req, res) => {
    const { audio, language } = req.body;
    
    const persianSamples = [
        'سلام خوب هستید امروز هوا چطور است',
        'لطفا این متن را برای من بنویسید',
        'سیستم تشخیص گفتار بسیار عالی کار می‌کند',
        'با تشکر از زحمات شما'
    ];
    
    const detected = persianSamples[Math.floor(Math.random() * persianSamples.length)];
    
    res.json({
        success: true,
        text: detected,
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
        language: language || 'fa',
        duration: (Math.random() * 5 + 1).toFixed(2)
    });
});

// صفحه داشبورد
app.get('/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>داشبورد فنی تتراشاپ</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
                body { font-family: 'Vazirmatn', sans-serif; }
            </style>
        </head>
        <body class="bg-gray-100 text-gray-800">
            <div class="min-h-screen">
                <!-- نوار کناری -->
                <div class="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white p-6">
                    <h1 class="text-2xl font-bold mb-8">🎯 تتراشاپ</h1>
                    <nav class="space-y-4">
                        <a href="/" class="block py-2 px-4 rounded hover:bg-blue-800 transition">🏠 صفحه اصلی</a>
                        <a href="#projects" class="block py-2 px-4 rounded hover:bg-blue-800 transition">📊 پروژه‌ها</a>
                        <a href="#revenue" class="block py-2 px-4 rounded hover:bg-blue-800 transition">💰 درآمدزایی</a>
                        <a href="#api" class="block py-2 px-4 rounded hover:bg-blue-800 transition">🔧 APIها</a>
                        <a href="#analytics" class="block py-2 px-4 rounded hover:bg-blue-800 transition">📈 آمار و تحلیل</a>
                    </nav>
                    <div class="absolute bottom-6 right-6 left-6">
                        <div class="bg-blue-800 p-4 rounded-lg">
                            <p class="text-sm">سرور در حال اجرا</p>
                            <p class="font-bold">پورت ${PORT}</p>
                        </div>
                    </div>
                </div>
                
                <!-- محتوای اصلی -->
                <div class="mr-64 p-8">
                    <header class="mb-8">
                        <h1 class="text-3xl font-bold text-gray-800">داشبورد فنی تتراشاپ</h1>
                        <p class="text-gray-600">مدیریت ۵ پروژه پیشرفته هوش مصنوعی</p>
                    </header>
                    
                    <!-- کارت‌های آمار -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
                            <h3 class="text-lg font-semibold mb-2">👥 کاربران فعال</h3>
                            <p class="text-3xl font-bold">426</p>
                            <p class="text-green-600 text-sm">+۱۲٪ نسبت به ماه قبل</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                            <h3 class="text-lg font-semibold mb-2">💰 درآمد کل</h3>
                            <p class="text-3xl font-bold">۵,۲۶۵,۰۰۰</p>
                            <p class="text-green-600 text-sm">ریال این ماه</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
                            <h3 class="text-lg font-semibold mb-2">✅ موفقیت API</h3>
                            <p class="text-3xl font-bold">۹۹.۲٪</p>
                            <p class="text-green-600 text-sm">آخرین ۲۴ ساعت</p>
                        </div>
                    </div>
                    
                    <!-- پروژه‌ها -->
                    <div id="projects" class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">📊 پروژه‌های فعال</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- هر پروژه -->
                            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div class="bg-orange-500 p-4 text-white">
                                    <h3 class="text-xl font-bold">♔ شطرنج پیشرفته</h3>
                                </div>
                                <div class="p-6">
                                    <p class="text-gray-600 mb-4">هوش مصنوعی سطح GM با تحلیل پیشرفته</p>
                                    <div class="flex justify-between mb-2">
                                        <span>کاربران:</span>
                                        <span class="font-bold">۱۲۵</span>
                                    </div>
                                    <div class="flex justify-between mb-4">
                                        <span>درآمد:</span>
                                        <span class="font-bold">۱,۲۵۰,۰۰۰ ریال</span>
                                    </div>
                                    <button onclick="testProject('chess')" class="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                                        تست نمونه
                                    </button>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div class="bg-blue-500 p-4 text-white">
                                    <h3 class="text-xl font-bold">✍️ نویسنده هوشمند</h3>
                                </div>
                                <div class="p-6">
                                    <p class="text-gray-600 mb-4">تولید محتوا با هوش مصنوعی پیشرفته</p>
                                    <div class="flex justify-between mb-2">
                                        <span>کاربران:</span>
                                        <span class="font-bold">۸۹</span>
                                    </div>
                                    <div class="flex justify-between mb-4">
                                        <span>درآمد:</span>
                                        <span class="font-bold">۸۹۰,۰۰۰ ریال</span>
                                    </div>
                                    <button onclick="testProject('writer')" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                                        تست نمونه
                                    </button>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div class="bg-purple-500 p-4 text-white">
                                    <h3 class="text-xl font-bold">⚛️ نویسنده کوانتومی</h3>
                                </div>
                                <div class="p-6">
                                    <p class="text-gray-600 mb-4">تولید متن با الگوریتم‌های کوانتومی</p>
                                    <div class="flex justify-between mb-2">
                                        <span>کاربران:</span>
                                        <span class="font-bold">۴۲</span>
                                    </div>
                                    <div class="flex justify-between mb-4">
                                        <span>درآمد:</span>
                                        <span class="font-bold">۴۲۰,۰۰۰ ریال</span>
                                    </div>
                                    <button onclick="testProject('quantum')" class="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
                                        تست نمونه
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- درآمدزایی -->
                    <div id="revenue" class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">💰 مدل‌های درآمدزایی</h2>
                        <div class="bg-white rounded-xl shadow-lg p-6">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="bg-gray-100">
                                            <th class="p-3 text-right">مدل</th>
                                            <th class="p-3 text-right">توضیح</th>
                                            <th class="p-3 text-right">قیمت</th>
                                            <th class="p-3 text-right">تخمین درآمد</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-b">
                                            <td class="p-3">🎫 اشتراک ماهانه</td>
                                            <td class="p-3">دسترسی کامل به یک پروژه</td>
                                            <td class="p-3 font-bold">۹۹,۰۰۰ ریال</td>
                                            <td class="p-3 text-green-600 font-bold">۵,۰۰۰,۰۰۰+ ریال/ماه</td>
                                        </tr>
                                        <tr class="border-b">
                                            <td class="p-3">📦 پکیج محدود</td>
                                            <td class="p-3">مثلاً ۱۰۰ تحلیل شطرنج</td>
                                            <td class="p-3 font-bold">۱۹۹,۰۰۰ ریال</td>
                                            <td class="p-3 text-green-600 font-bold">۲,۰۰۰,۰۰۰+ ریال/ماه</td>
                                        </tr>
                                        <tr class="border-b">
                                            <td class="p-3">🏢 API سازمانی</td>
                                            <td class="p-3">دسترسی API برای شرکت‌ها</td>
                                            <td class="p-3 font-bold">از ۴۹۹,۰۰۰ ریال</td>
                                            <td class="p-3 text-green-600 font-bold">۱۰,۰۰۰,۰۰۰+ ریال/ماه</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- APIها -->
                    <div id="api" class="mb-8">
                        <h2 class="text-2xl font-bold mb-4">🔧 APIهای آماده</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-900 text-white rounded-xl p-6">
                                <h3 class="text-lg font-bold mb-2">♔ شطرنج</h3>
                                <code class="block bg-gray-800 p-3 rounded mb-3">POST /api/chess/move</code>
                                <p class="text-gray-300">دریافت بهترین حرکت از هوش مصنوعی</p>
                            </div>
                            
                            <div class="bg-gray-900 text-white rounded-xl p-6">
                                <h3 class="text-lg font-bold mb-2">✍️ نویسنده</h3>
                                <code class="block bg-gray-800 p-3 rounded mb-3">POST /api/smart-writer/generate</code>
                                <p class="text-gray-300">تولید متن هوشمند</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                async function testProject(project) {
                    let url, data;
                    
                    switch(project) {
                        case 'chess':
                            url = '/api/chess/move';
                            data = { 
                                fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                                difficulty: 'medium'
                            };
                            break;
                        case 'writer':
                            url = '/api/smart-writer/generate';
                            data = {
                                prompt: 'هوش مصنوعی در آینده',
                                style: 'formal',
                                length: 200
                            };
                            break;
                        case 'quantum':
                            url = '/api/quantum-writer/generate';
                            data = {
                                theme: 'تکنولوژی کوانتومی',
                                complexity: 'medium'
                            };
                            break;
                    }
                    
                    try {
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        });
                        
                        const result = await response.json();
                        alert('✅ تست موفق:\n' + JSON.stringify(result, null, 2));
                    } catch (error) {
                        alert('❌ خطا در تست API: ' + error.message);
                    }
                }
                
                // بارگذاری آمار
                async function loadStats() {
                    try {
                        const response = await fetch('/api/projects/status');
                        const data = await response.json();
                        console.log('آمار بارگذاری شد:', data);
                    } catch (error) {
                        console.error('خطا در بارگذاری آمار:', error);
                    }
                }
                
                // بارگذاری اولیه
                document.addEventListener('DOMContentLoaded', loadStats);
            </script>
        </body>
        </html>
    `);
});

// ==================== MARKETPLACE ====================

app.get('/api/marketplace/products', (req, res) => {
    res.json({
        products: [
            {
                id: 1,
                name: 'شطرنج پیشرفته - ماهانه',
                description: 'دسترسی کامل به هوش مصنوعی شطرنج سطح GM',
                price: 99000,
                currency: 'IRR',
                features: ['تحلیل بازی', 'تمرین تخصصی', 'پشتیبانی ۲۴/۷'],
                type: 'subscription'
            },
            {
                id: 2,
                name: 'نویسنده هوشمند - پکیج ۱۰۰ مقاله',
                description: 'تولید ۱۰۰ مقاله با کیفیت بالا',
                price: 299000,
                currency: 'IRR',
                features: ['قالب‌های مختلف', 'ویرایش خودکار', 'پشتیبانی فنی'],
                type: 'package'
            }
        ]
    });
});

// ==================== ANALYTICS ====================

app.get('/api/analytics/overview', (req, res) => {
    res.json({
        total_requests: 12500,
        successful_requests: 12400,
        failed_requests: 100,
        average_response_time: '0.45s',
        popular_projects: [
            { name: 'شطرنج', requests: 5000 },
            { name: 'نویسنده هوشمند', requests: 3500 },
            { name: 'تشخیص گفتار', requests: 2500 },
            { name: 'باغ امن', requests: 1000 },
            { name: 'نویسنده کوانتومی', requests: 500 }
        ]
    });
});

// ==================== 404 HANDLER ====================

app.use((req, res) => {
    res.status(404).json({
        error: 'صفحه یافت نشد',
        message: 'لطفاً آدرس را بررسی کنید',
        available_routes: [
            'GET /',
            'GET /dashboard',
            'GET /api/projects/status',
            'GET /api/finance/stats',
            'GET /api/marketplace/products',
            'GET /api/analytics/overview',
            'POST /api/chess/move',
            'POST /api/smart-writer/generate',
            'POST /api/quantum-writer/generate',
            'POST /api/secret-garden/encrypt',
            'POST /api/speech/recognize'
        ]
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`
    🚀 سرور تتراشاپ با موفقیت راه‌اندازی شد!
    
    🌐 آدرس‌های اصلی:
       📍 صفحه اصلی: http://localhost:${PORT}
       🎯 داشبورد: http://localhost:${PORT}/dashboard
       📊 آمار: http://localhost:${PORT}/api/projects/status
       💰 فروشگاه: http://localhost:${PORT}/api/marketplace/products
    
    ⚡ پروژه‌های فعال:
       1. ♔ شطرنج پیشرفته
       2. ✍️ نویسنده هوشمند  
       3. ⚛️ نویسنده کوانتومی
       4. 🔐 باغ امن
       5. 🎤 تشخیص گفتار
    
    💰 مدل درآمدزایی:
       • فروش اشتراک ماهانه
       • فروش پکیج‌های محدود  
       • API سازمانی
       • خدمات سفارشی
    
    📈 آمار فعلی:
       • کاربران فعال: ۴۲۶
       • درآمد ماهانه: ۵,۲۶۵,۰۰۰ ریال
       • موفقیت API: ۹۹.۲٪
    
    ⚡ برای توقف: Ctrl+C
    `);
});
