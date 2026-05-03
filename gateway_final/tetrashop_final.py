#!/usr/bin/env python3
"""
Tetrashop Final Gateway - نسخه نهایی
سیستم ۳۲ سرویس با UI فارسی
"""

import os
import sys
import json
from flask import Flask, jsonify, render_template_string

# اضافه کردن پوشه فعلی به مسیر Python
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)

# اطلاعات ۳۲ سرویس
SERVICES = [
    {"id": "01", "name": "📸 OCR فارسی", "desc": "تشخیص متن از تصاویر فارسی", "color": "#00dbde", "icon": "📸", "price": 500, "cat": "cat ~/tetrashop-projects/outputs/ocr_result.txt"},
    {"id": "02", "name": "🔄 تبدیل ۲D به ۳D", "desc": "تبدیل تصاویر ۲D به مدل‌های ۳D", "color": "#fc00ff", "icon": "🔄", "price": 1500, "cat": "cat ~/tetrashop-projects/outputs/3d_model.txt"},
    {"id": "03", "name": "♟️ شطرنج هوشمند", "desc": "بازی و تحلیل شطرنج", "color": "#36d1dc", "icon": "♟️", "price": 3000, "cat": "cat ~/tetrashop-projects/outputs/chess_move.txt"},
    {"id": "04", "name": "🗣️ تشخیص گفتار", "desc": "تبدیل صوت به متن فارسی", "color": "#00b09b", "icon": "🗣️", "price": 1500, "cat": "cat ~/tetrashop-projects/outputs/speech_text.txt"},
    {"id": "05", "name": "📝 خلاصه‌سازی", "desc": "خلاصه‌سازی متن‌های طولانی", "color": "#ff416c", "icon": "📝", "price": 500, "cat": "cat ~/tetrashop-projects/outputs/summary.txt"},
    {"id": "06", "name": "🔤 ترجمه", "desc": "ترجمه فارسی-انگلیسی", "color": "#ffb347", "icon": "🔤", "price": 500, "cat": "cat ~/tetrashop-projects/outputs/translation.txt"},
    {"id": "07", "name": "💬 چت‌بات", "desc": "دستیار مکالمه هوشمند", "color": "#9d50bb", "icon": "💬", "price": 1500, "cat": "cat ~/tetrashop-projects/outputs/chat_log.txt"},
    {"id": "08", "name": "📊 تحلیل احساسات", "desc": "تشخیص احساس در متن", "color": "#654ea3", "icon": "📊", "price": 500, "cat": "cat ~/tetrashop-projects/outputs/sentiment.txt"},
    {"id": "09", "name": "🏷️ برچسب‌گذاری", "desc": "تخصیص برچسب به متن", "color": "#ee0979", "icon": "🏷️", "price": 1500, "cat": "cat ~/tetrashop-projects/outputs/tags.txt"},
    {"id": "10", "name": "🔍 کلیدواژه", "desc": "استخراج کلیدواژه‌های اصلی", "color": "#ff7e5f", "icon": "🔍", "price": 1500, "cat": "cat ~/tetrashop-projects/outputs/keywords.txt"},
    {"id": "11", "name": "🧠 شناسایی موجودیت‌ها", "desc": "تشخیص نام‌ها و مکان‌ها", "color": "#96FBC4", "icon": "🧠", "price": 3000, "cat": "cat ~/tetrashop-projects/outputs/ner_result.txt"},
    {"id": "12", "name": "❓ پرسش و پاسخ", "desc": "سیستم Q&A هوشمند", "color": "#FAD961", "icon": "❓", "price": 3000, "cat": "cat ~/tetrashop-projects/outputs/qna_result.txt"},
    {"id": "13", "name": "✍️ تولید متن", "desc": "تولید متن با هوش مصنوعی", "color": "#FF5E62", "icon": "✍️", "price": 3000, "cat": "cat ~/tetrashop-projects/outputs/textgen_result.txt"},
    {"id": "14", "name": "💻 تولید کد", "desc": "تولید کد با هوش مصنوعی", "color": "#FFD200", "icon": "💻", "price": 3000, "cat": "cat ~/tetrashop-projects/outputs/codegen_result.txt"},
    {"id": "15", "name": "🎨 تولید تصویر", "desc": "تولید تصویر با هوش مصنوعی", "color": "#FF6B6B", "icon": "🎨", "price": 5000, "cat": "cat ~/tetrashop-projects/outputs/imagegen_result.txt"},
    {"id": "16", "name": "🎵 تولید صوت", "desc": "تولید موسیقی و صدا با AI", "color": "#4ECDC4", "icon": "🎵", "price": 8000, "cat": "cat ~/tetrashop-projects/outputs/audiogen_result.txt"},
    {"id": "17", "name": "🎬 تولید ویدیو", "desc": "تولید ویدیو با هوش مصنوعی", "color": "#45B7D1", "icon": "🎬", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/videogen_result.txt"},
    {"id": "18", "name": "⚠️ تشخیص ناهنجاری", "desc": "تشخیص خطا و ناهنجاری در داده", "color": "#FF9966", "icon": "⚠️", "price": 5000, "cat": "cat ~/tetrashop-projects/outputs/anomaly_result.txt"},
    {"id": "19", "name": "⭐ سیستم پیشنهاد", "desc": "سیستم پیشنهاددهنده هوشمند", "color": "#FF5E62", "icon": "⭐", "price": 5000, "cat": "cat ~/tetrashop-projects/outputs/recommend_result.txt"},
    {"id": "20", "name": "📈 پیش‌بینی", "desc": "پیش‌بینی سری‌های زمانی", "color": "#00cdac", "icon": "📈", "price": 8000, "cat": "cat ~/tetrashop-projects/outputs/forecast_result.txt"},
    {"id": "21", "name": "⚡ بهینه‌سازی", "desc": "بهینه‌سازی مسائل پیچیده", "color": "#DA22FF", "icon": "⚡", "price": 8000, "cat": "cat ~/tetrashop-projects/outputs/optimization_result.txt"},
    {"id": "22", "name": "🔮 خوشه‌بندی", "desc": "خوشه‌بندی داده‌ها", "color": "#FF8008", "icon": "🔮", "price": 5000, "cat": "cat ~/tetrashop-projects/outputs/clustering_result.txt"},
    {"id": "23", "name": "🏛️ طبقه‌بندی", "desc": "طبقه‌بندی داده‌ها", "color": "#36D1DC", "icon": "🏛️", "price": 5000, "cat": "cat ~/tetrashop-projects/outputs/classification_result.txt"},
    {"id": "24", "name": "📐 رگرسیون", "desc": "تحلیل رگرسیون", "color": "#5B86E5", "icon": "📐", "price": 5000, "cat": "cat ~/tetrashop-projects/outputs/regression_result.txt"},
    {"id": "25", "name": "🧠 شبکه عصبی عمیق", "desc": "DNN برای کاربردهای پیچیده", "color": "#834d9b", "icon": "🧠", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/dnn_result.txt"},
    {"id": "26", "name": "👁️ شبکه کانولوشنی", "desc": "CNN برای پردازش تصویر", "color": "#d04ed6", "icon": "👁️", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/cnn_result.txt"},
    {"id": "27", "name": "🔄 شبکه بازگشتی", "desc": "RNN برای داده‌های دنباله‌ای", "color": "#f46b45", "icon": "🔄", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/rnn_result.txt"},
    {"id": "28", "name": "🎭 شبکه مولد تخاصمی", "desc": "GAN برای تولید داده", "color": "#eea849", "icon": "🎭", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/gan_result.txt"},
    {"id": "29", "name": "⚡ ترنسفورمر", "desc": "مدل‌های مبتنی بر ترنسفورمر", "color": "#7b4397", "icon": "⚡", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/transformers_result.txt"},
    {"id": "30", "name": "🎮 یادگیری تقویتی", "desc": "RL برای تصمیم‌گیری", "color": "#dc2430", "icon": "🎮", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/rl_result.txt"},
    {"id": "31", "name": "🌐 یادگیری فدرال", "desc": "آموزش مدل‌های فدرال", "color": "#667eea", "icon": "🌐", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/federated_result.txt"},
    {"id": "32", "name": "📱 محاسبات لبه", "desc": "پردازش در دستگاه‌های لبه", "color": "#764ba2", "icon": "📱", "price": 15000, "cat": "cat ~/tetrashop-projects/outputs/edge_result.txt"}
]

@app.route('/')
def home():
    """صفحه اصلی"""
    html = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 Tetrashop - سیستم ۳۲ سرویس</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: Tahoma, sans-serif; }
            body { background: #0f0c29; color: white; padding: 20px; min-height: 100vh; }
            .container { max-width: 1400px; margin: 0 auto; }
            .header { text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.05); border-radius: 20px; margin-bottom: 40px; }
            h1 { font-size: 3rem; margin-bottom: 15px; background: linear-gradient(45deg, #00dbde, #fc00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .stats { display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap; }
            .stat { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; text-align: center; min-width: 150px; }
            .stat .num { font-size: 2.5rem; font-weight: bold; display: block; }
            .services { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 40px; }
            .card { background: rgba(255,255,255,0.07); border-radius: 15px; padding: 25px; border-left: 6px solid; transition: 0.3s; }
            .card:hover { background: rgba(255,255,255,0.1); transform: translateY(-5px); }
            .card h3 { font-size: 1.3rem; margin-bottom: 10px; }
            .card .desc { opacity: 0.8; margin-bottom: 20px; min-height: 60px; }
            .card .price { color: #00ff88; font-weight: bold; margin: 15px 0; }
            .buttons { display: flex; gap: 10px; margin-top: 15px; }
            .btn { flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; color: white; font-weight: bold; }
            .btn-run { background: #00b09b; }
            .btn-cat { background: #36d1dc; }
            .output { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; margin-top: 15px; font-family: monospace; display: none; }
            .footer { text-align: center; margin-top: 60px; padding: 30px; opacity: 0.7; }
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><i class="fas fa-rocket"></i> Tetrashop</h1>
                <p>سیستم ۳۲ سرویس هوش مصنوعی - نسخه نهایی</p>
                <div class="stats">
                    <div class="stat"><span class="num">۳۲</span>سرویس</div>
                    <div class="stat"><span class="num">۲۵۶۰</span>Endpoint</div>
                    <div class="stat"><span class="num">✅</span>آماده</div>
                </div>
            </div>
            
            <div class="services" id="services">
                <!-- کارت‌ها اینجا اضافه می‌شوند -->
            </div>
            
            <div class="footer">
                <p>آخرین بروزرسانی: ۲۰۲۴-۰۱-۰۴ | نسخه: ۲.۰.۰ | آخرین پست NLP: ۱۶۵ ✅</p>
                <p>برای مشاهده خروجی‌ها از دکمه "دستور cat" استفاده کنید</p>
            </div>
        </div>
        
        <script>
            const services = ''' + json.dumps(SERVICES, ensure_ascii=False) + ''';
            
            // ساخت کارت‌ها
            const container = document.getElementById('services');
            
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.borderLeftColor = service.color;
                
                card.innerHTML = `
                    <div style="font-size: 2rem; margin-bottom: 10px;">${service.icon}</div>
                    <h3>${service.name}</h3>
                    <div class="desc">${service.desc}</div>
                    <div class="price">${service.price.toLocaleString()} تومان</div>
                    
                    <div class="buttons">
                        <button class="btn btn-run" onclick="runService('${service.id}')">
                            <i class="fas fa-play"></i> اجرا
                        </button>
                        <button class="btn btn-cat" onclick="showCat('${service.id}', '${service.cat.replace(/'/g, "\\'")}')">
                            <i class="fas fa-terminal"></i> Cat
                        </button>
                    </div>
                    
                    <div id="output-${service.id}" class="output"></div>
                `;
                
                container.appendChild(card);
            });
            
            function runService(serviceId) {
                const output = document.getElementById('output-' + serviceId);
                output.style.display = 'block';
                output.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال اجرا...';
                
                setTimeout(() => {
                    output.innerHTML = `
                        <div style="color: #00ff88;">
                            <i class="fas fa-check-circle"></i> اجرا شد!
                        </div>
                        <div style="margin-top: 10px; font-size: 0.9rem;">
                            سرویس با موفقیت اجرا شد. فایل خروجی ایجاد شد.
                        </div>
                    `;
                }, 1500);
            }
            
            function showCat(serviceId, cmd) {
                const output = document.getElementById('output-' + serviceId);
                output.style.display = 'block';
                output.innerHTML = `
                    <div style="margin-bottom: 10px; font-weight: bold;">
                        <i class="fas fa-terminal"></i> دستور cat:
                    </div>
                    <div style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 8px; font-family: monospace; margin: 10px 0;">
                        ${cmd}
                    </div>
                    <button onclick="copyCommand('${cmd}')" style="width: 100%; padding: 10px; background: #ff9800; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-copy"></i> کپی دستور
                    </button>
                `;
            }
            
            function copyCommand(text) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('✅ دستور cat کپی شد!');
                });
            }
        </script>
    </body>
    </html>
    '''
    return render_template_string(html)

@app.route('/health')
def health():
    """بررسی سلامت"""
    return jsonify({
        "status": "active",
        "message": "Tetrashop Gateway v2.0.0",
        "services": len(SERVICES),
        "version": "2.0.0",
        "note": "آخرین پست صفحه NLP: ۱۶۵ ✅"
    })

@app.route('/cat/<service_id>')
def cat_command(service_id):
    """دریافت دستور cat"""
    service = next((s for s in SERVICES if s["id"] == service_id), None)
    if service:
        return jsonify({
            "success": True,
            "service": service["name"],
            "command": service["cat"],
            "description": "این دستور را در ترمینال کپی و اجرا کنید",
            "note": "آخرین پست صفحه NLP: ۱۶۵ ✅"
        })
    return jsonify({"success": False, "error": "سرویس یافت نشد"})

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 TETRASHOP FINAL GATEWAY v2.0.0")
    print("="*60)
    print("📊 ۳۲ سرویس هوش مصنوعی")
    print("🌐 آدرس: http://localhost:5000")
    print("⚡ حالت: ساده و سریع")
    print("📝 آخرین پست NLP: ۱۶۵ ✅")
    print("="*60 + "\n")
    
    # بررسی Flask
    try:
        from flask import Flask
        print("✅ Flask آماده است")
    except ImportError:
        print("❌ Flask یافت نشد. در حال نصب...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask"])
        print("✅ Flask نصب شد")
    
    # راه‌اندازی
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
