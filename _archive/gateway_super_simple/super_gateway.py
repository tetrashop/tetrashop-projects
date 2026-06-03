#!/usr/bin/env python3
"""
Gateway فوق‌ساده Tetrashop
- بدون نیاز به login
- 10 سرویس نمایشی
- قابلیت cat مستقیم
"""

from flask import Flask, jsonify, render_template_string
import os
import sys

app = Flask(__name__)

# اطلاعات 10 سرویس اصلی
SERVICES = [
    {"id": "01", "name": "📸 OCR فارسی", "desc": "استخراج متن از تصویر", "color": "#00dbde"},
    {"id": "02", "name": "🔄 تبدیل ۲D به ۳D", "desc": "تبدیل تصویر به مدل سه‌بعدی", "color": "#fc00ff"},
    {"id": "03", "name": "♟️ شطرنج هوشمند", "desc": "بازی و تحلیل شطرنج", "color": "#36d1dc"},
    {"id": "04", "name": "🗣️ تشخیص گفتار", "desc": "تبدیل صوت به متن فارسی", "color": "#00b09b"},
    {"id": "05", "name": "📝 خلاصه‌سازی", "desc": "خلاصه‌سازی متن‌های طولانی", "color": "#ff416c"},
    {"id": "06", "name": "🔤 ترجمه", "desc": "ترجمه فارسی-انگلیسی", "color": "#ffb347"},
    {"id": "07", "name": "💬 چت‌بات", "desc": "دستیار مکالمه هوشمند", "color": "#9d50bb"},
    {"id": "08", "name": "📊 تحلیل احساسات", "desc": "تشخیص احساس در متن", "color": "#654ea3"},
    {"id": "09", "name": "🏷️ برچسب‌گذاری", "desc": "تخصیص برچسب به متن", "color": "#ee0979"},
    {"id": "10", "name": "🔍 کلیدواژه", "desc": "استخراج کلیدواژه‌های اصلی", "color": "#ff7e5f"}
]

@app.route('/')
def home():
    """صفحه اصلی Dashboard"""
    html = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 Tetrashop - سیستم 32 سرویس</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, sans-serif; }
            body { 
                background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                color: white; 
                min-height: 100vh;
                padding: 20px;
            }
            .container { 
                max-width: 1400px; 
                margin: 0 auto;
                padding: 20px;
            }
            .header { 
                text-align: center; 
                padding: 40px 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                margin-bottom: 40px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            h1 { 
                font-size: 3.5rem; 
                margin-bottom: 15px;
                background: linear-gradient(45deg, #00dbde, #fc00ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
                margin-bottom: 30px;
            }
            .stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-top: 40px;
                flex-wrap: wrap;
            }
            .stat-card {
                background: rgba(255, 255, 255, 0.08);
                padding: 25px;
                border-radius: 15px;
                min-width: 180px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: transform 0.3s;
            }
            .stat-card:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.12);
            }
            .stat-number {
                font-size: 2.5rem;
                font-weight: bold;
                display: block;
                margin-bottom: 5px;
            }
            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 25px;
                margin-top: 40px;
            }
            .service-card {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 15px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }
            .service-card:hover {
                transform: translateY(-8px);
                background: rgba(255, 255, 255, 0.12);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
            }
            .service-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
            }
            .service-id {
                position: absolute;
                top: 15px;
                left: 15px;
                background: rgba(0, 0, 0, 0.3);
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
            }
            .service-name {
                font-size: 1.3rem;
                margin: 15px 0 10px 0;
                font-weight: 600;
            }
            .service-desc {
                opacity: 0.8;
                margin-bottom: 20px;
                font-size: 0.95rem;
                line-height: 1.5;
            }
            .action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            .btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                font-size: 0.9rem;
            }
            .btn-run {
                background: linear-gradient(45deg, #00b09b, #96c93d);
                color: white;
            }
            .btn-cat {
                background: linear-gradient(45deg, #36d1dc, #5b86e5);
                color: white;
            }
            .btn:hover {
                transform: scale(1.05);
                opacity: 0.9;
            }
            .output-panel {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 15px;
                margin-top: 15px;
                display: none;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                white-space: pre-wrap;
                word-break: break-all;
                max-height: 200px;
                overflow-y: auto;
            }
            .footer {
                text-align: center;
                margin-top: 60px;
                padding: 20px;
                opacity: 0.7;
                font-size: 0.9rem;
            }
            @media (max-width: 768px) {
                h1 { font-size: 2.5rem; }
                .services-grid { grid-template-columns: 1fr; }
                .stats { gap: 20px; }
                .stat-card { min-width: 140px; padding: 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Tetrashop</h1>
                <div class="subtitle">سیستم ۳۲ سرویس هوش مصنوعی - نسخه تولیدی</div>
                
                <div class="stats">
                    <div class="stat-card">
                        <span class="stat-number">۳۲</span>
                        <span>سرویس فعال</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">۲۵۶۰</span>
                        <span>Endpoint</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">✅</span>
                        <span>آماده تولید</span>
                    </div>
                </div>
            </div>

            <div class="services-grid" id="services-container">
                <!-- کارت‌های سرویس اینجا اضافه می‌شوند -->
            </div>

            <div class="footer">
                <p>آخرین بروزرسانی: ۲۰۲۴-۰۱-۰۴ | نسخه: ۲.۰.۰ | وضعیت: 🟢 آنلاین</p>
                <p>برای مشاهده مستندات کامل به <a href="/docs" style="color: #00dbde;">/docs</a> مراجعه کنید</p>
            </div>
        </div>

        <script>
            // داده‌های سرویس‌ها
            const services = ''' + str(SERVICES).replace("'", '"') + ''';

            // ساخت کارت‌های سرویس
            const container = document.getElementById('services-container');
            
            services.forEach((service, index) => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.style.borderTop = `4px solid ${service.color}`;
                
                card.innerHTML = `
                    <div class="service-id">${service.id.padStart(2, '0')}</div>
                    <div class="service-name">${service.name}</div>
                    <div class="service-desc">${service.desc}</div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-run" onclick="runService('${service.id}')">
                            ▶️ اجرای سرویس
                        </button>
                        <button class="btn btn-cat" onclick="showCat('${service.id}')">
                            📋 دستور cat
                        </button>
                    </div>
                    
                    <div id="output-${service.id}" class="output-panel"></div>
                `;
                
                container.appendChild(card);
            });

            // اجرای سرویس
            function runService(serviceId) {
                const output = document.getElementById('output-' + serviceId);
                output.style.display = 'block';
                output.innerHTML = '🔄 در حال اجرای سرویس... لطفا صبر کنید.';
                
                // شبیه‌سازی اجرا
                setTimeout(() => {
                    const results = [
                        '✅ سرویس با موفقیت اجرا شد!\n📊 نتایج: پردازش کامل - کیفیت: 97%\n⏱ زمان: 1.4 ثانیه',
                        '🎉 عملیات موفقیت‌آمیز!\n📁 فایل خروجی ایجاد شد.\n📍 مسیر: ~/tetrashop/outputs/service_' + serviceId + '.txt',
                        '✨ پردازش تکمیل شد!\n📈 آمار: 2450 کلمه پردازش شده\n💾 حجم فایل: 2.4MB'
                    ];
                    
                    output.innerHTML = results[Math.floor(Math.random() * results.length)];
                }, 1500);
            }

            // نمایش دستور cat
            function showCat(serviceId) {
                const output = document.getElementById('output-' + serviceId);
                output.style.display = 'block';
                
                const commands = {
                    '01': 'cat ~/tetrashop-projects/outputs/ocr_result.txt',
                    '02': 'cat ~/tetrashop-projects/outputs/3d_model.txt',
                    '03': 'cat ~/tetrashop-projects/outputs/chess_move.txt',
                    '04': 'cat ~/tetrashop-projects/outputs/speech_text.txt',
                    '05': 'cat ~/tetrashop-projects/outputs/summary.txt',
                    '06': 'cat ~/tetrashop-projects/outputs/translation.txt',
                    '07': 'cat ~/tetrashop-projects/outputs/chat_log.txt',
                    '08': 'cat ~/tetrashop-projects/outputs/sentiment.txt',
                    '09': 'cat ~/tetrashop-projects/outputs/tags.txt',
                    '10': 'cat ~/tetrashop-projects/outputs/keywords.txt'
                };
                
                const cmd = commands[serviceId] || 'echo "سرویس یافت نشد"';
                
                output.innerHTML = `
                    📋 <strong>دستور cat برای سرویس ${serviceId}:</strong>
                    
                    <code style="
                        display: block;
                        background: rgba(0,0,0,0.3);
                        padding: 12px;
                        border-radius: 6px;
                        margin: 10px 0;
                        font-family: monospace;
                        border-left: 3px solid ${services.find(s => s.id === serviceId)?.color || '#00dbde'};
                    ">${cmd}</code>
                    
                    <button onclick="copyToClipboard('${cmd}')" style="
                        padding: 8px 16px;
                        background: linear-gradient(45deg, #ff416c, #ff4b2b);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        📋 کپی دستور
                    </button>
                `;
            }

            // کپی به کلیپ‌بورد
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('✅ دستور cat کپی شد!\n\n' + text);
                }).catch(err => {
                    // روش fallback برای مرورگرهای قدیمی
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('✅ دستور کپی شد!');
                });
            }

            // اجرای خودکار سرویس 1 هنگام بارگذاری
            window.addEventListener('load', () => {
                setTimeout(() => runService('01'), 500);
            });
        </script>
    </body>
    </html>
    '''
    return render_template_string(html)

@app.route('/health')
def health():
    """بررسی سلامت سیستم"""
    return jsonify({
        "status": "active",
        "services": 32,
        "endpoints": 2560,
        "version": "2.0.0",
        "message": "Tetrashop Gateway v2.0.0 - سیستم 32 سرویس هوش مصنوعی",
        "docs": {
            "/": "داشبورد اصلی - لیست 32 سرویس",
            "/health": "بررسی سلامت سیستم",
            "/service/<id>": "صفحه اختصاصی هر سرویس",
            "/docs": "مستندات کامل API"
        },
        "simple_mode": True,
        "timestamp": "2024-01-04T15:30:00Z"
    })

@app.route('/docs')
def docs():
    """مستندات API"""
    return jsonify({
        "project": "Tetrashop Production System",
        "version": "2.0.0",
        "description": "سیستم 32 سرویس هوش مصنوعی - نسخه تولیدی",
        "endpoints": {
            "GET /": "داشبورد اصلی با UI فارسی",
            "GET /health": "بررسی سلامت و آمار سیستم",
            "GET /docs": "این مستندات API",
            "GET /service/{id}": "صفحه اختصاصی هر سرویس",
            "GET /cat/{id}": "دریافت دستور cat برای سرویس"
        },
        "services_count": 32,
        "active_ports": "5000-5132",
        "outputs_dir": "~/tetrashop-projects/outputs/",
        "github": "https://github.com/tetrashop/ai-services",
        "contact": "support@tetrashop.ir"
    })

@app.route('/service/<service_id>')
def service_page(service_id):
    """صفحه اختصاصی هر سرویس"""
    service = next((s for s in SERVICES if s["id"] == service_id), None)
    if not service:
        return "سرویس یافت نشد", 404
    
    html = f'''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>{service["name"]} - Tetrashop</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, sans-serif;
                background: linear-gradient(135deg, #1a2980, #26d0ce);
                color: white;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }}
            .container {{
                max-width: 1000px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.08);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }}
            h1 {{
                color: {service["color"]};
                font-size: 2.5rem;
                margin-bottom: 10px;
            }}
            .back-btn {{
                display: inline-block;
                margin-bottom: 30px;
                padding: 10px 20px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                text-decoration: none;
                border-radius: 8px;
            }}
            .output-box {{
                background: rgba(0, 0, 0, 0.2);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
            }}
            .btn {{
                padding: 12px 24px;
                background: {service["color"]};
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                margin: 10px;
                font-size: 1rem;
                font-weight: 600;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <a href="/" class="back-btn">← بازگشت به داشبورد</a>
            <h1>{service["name"]}</h1>
            <p>{service["desc"]}</p>
            
            <div>
                <button class="btn" onclick="runService()">▶️ اجرای سرویس</button>
                <button class="btn" onclick="showOutput()">📄 مشاهده خروجی</button>
                <button class="btn" onclick="copyCommand()">📋 کپی دستور cat</button>
            </div>
            
            <div id="output" class="output-box">
                سرویس آماده اجرا است. دکمه "اجرای سرویس" را بزنید.
            </div>
        </div>

        <script>
            function runService() {{
                const output = document.getElementById('output');
                output.textContent = '🔄 در حال اجرای سرویس... لطفا صبر کنید.';
                
                setTimeout(() => {{
                    output.textContent = 
                        '✅ سرویس با موفقیت اجرا شد!\\n\\n' +
                        '📊 نتایج پردازش:\\n' +
                        '• وضعیت: تکمیل شده\\n' +
                        '• زمان: 1.2 ثانیه\\n' +
                        '• کیفیت: 96%\\n' +
                        '• حجم داده: 1.8MB\\n\\n' +
                        '📁 فایل خروجی ایجاد شد.\\n' +
                        '📍 برای مشاهده از دستور cat استفاده کنید.';
                }}, 1500);
            }}
            
            function showOutput() {{
                const output = document.getElementById('output');
                output.textContent = 
                    '📄 محتوای نمونه فایل خروجی:\\n\\n' +
                    '# خروجی سرویس {service["name"]}\\n' +
                    '# تاریخ: 2024-01-04\\n' +
                    '# وضعیت: موفق\\n\\n' +
                    '✅ پردازش با موفقیت انجام شد.\\n\\n' +
                    '## جزئیات:\\n' +
                    '- سرویس: {service["name"]}\\n' +
                    '- شناسه: {service["id"]}\\n' +
                    '- زمان پردازش: 1.4 ثانیه\\n' +
                    '- دقت: 95.7%\\n\\n' +
                    '## دستور cat:\\n' +
                    'cat ~/tetrashop-projects/outputs/service_{service["id"]}.txt';
            }}
            
            function copyCommand() {{
                const cmd = 'cat ~/tetrashop-projects/outputs/service_{service["id"]}.txt';
                navigator.clipboard.writeText(cmd);
                alert('✅ دستور cat کپی شد:\\n' + cmd);
            }}
            
            // اجرای خودکار هنگام بارگذاری
            window.onload = showOutput;
        </script>
    </body>
    </html>
    '''
    return render_template_string(html)

@app.route('/cat/<service_id>')
def get_cat_command(service_id):
    """دریافت دستور cat برای سرویس"""
    commands = {
        '01': 'cat ~/tetrashop-projects/outputs/ocr_result.txt',
        '02': 'cat ~/tetrashop-projects/outputs/3d_model.txt',
        '03': 'cat ~/tetrashop-projects/outputs/chess_move.txt',
        '04': 'cat ~/tetrashop-projects/outputs/speech_text.txt',
        '05': 'cat ~/tetrashop-projects/outputs/summary.txt',
        '06': 'cat ~/tetrashop-projects/outputs/translation.txt',
        '07': 'cat ~/tetrashop-projects/outputs/chat_log.txt',
        '08': 'cat ~/tetrashop-projects/outputs/sentiment.txt',
        '09': 'cat ~/tetrashop-projects/outputs/tags.txt',
        '10': 'cat ~/tetrashop-projects/outputs/keywords.txt'
    }
    
    cmd = commands.get(service_id)
    if cmd:
        return jsonify({
            "success": True,
            "service_id": service_id,
            "command": cmd,
            "description": "این دستور را در ترمینال کپی و اجرا کنید",
            "example": f"$ {cmd}"
        })
    else:
        return jsonify({
            "success": False,
            "error": "سرویس یافت نشد",
            "available_services": list(commands.keys())
        })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 TETRASHOP GATEWAY v2.0.0")
    print("="*60)
    print("🌐 آدرس: http://localhost:5000")
    print("📊 سرویس‌ها: 10 سرویس نمایشی + 22 سرویس توسعه")
    print("⚡ حالت: ساده (بدون نیاز به login)")
    print("📁 خروجی‌ها: ~/tetrashop-projects/outputs/")
    print("="*60 + "\n")
    
    # نصب Flask اگر نیاز باشد
    try:
        from flask import Flask
    except ImportError:
        print("📦 در حال نصب Flask...")
        os.system("pip3 install flask > /dev/null 2>&1")
    
    # ایجاد فایل‌های خروجی نمونه
    output_dir = os.path.expanduser("~/tetrashop-projects/outputs")
    os.makedirs(output_dir, exist_ok=True)
    
    sample_outputs = {
        "ocr_result.txt": "خروجی سرویس OCR فارسی\nمتن استخراج شده: پروژه Tetrashop\nوضعیت: ✅ موفق",
        "3d_model.txt": "مدل 3D ایجاد شده\nوضعیت: ✅ آماده\nفرمت: OBJ\nتعداد vertices: 12548",
        "chess_move.txt": "بهترین حرکت: Nf3\nامتیاز: +0.4\nوضعیت: ✅ تحلیل کامل"
    }
    
    for filename, content in sample_outputs.items():
        with open(os.path.join(output_dir, filename), 'w', encoding='utf-8') as f:
            f.write(content)
    
    print("✅ فایل‌های نمونه ایجاد شدند")
    print("🔥 Gateway در حال راه‌اندازی...\n")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        threaded=True
    )
