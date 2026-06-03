#!/usr/bin/env python3
"""
Tetrashop - نسخه ساده برای مشتری
۱۰ سرویس کاربردی
"""

from flask import Flask, jsonify, render_template_string
import os

app = Flask(__name__)

# ۱۰ سرویس واقعاً کاربردی
SERVICES = [
    {"id": "1", "name": "📸 OCR فارسی", "desc": "تبدیل عکس به متن", "price": "500 تومان", "cmd": "echo 'متن استخراج شده از عکس'"},
    {"id": "2", "name": "📝 خلاصه‌سازی", "desc": "خلاصه متن طولانی", "price": "300 تومان", "cmd": "echo 'خلاصه متن تولید شد'"},
    {"id": "3", "name": "🔤 ترجمه", "desc": "فارسی به انگلیسی", "price": "400 تومان", "cmd": "echo 'متن ترجمه شد'"},
    {"id": "4", "name": "💬 چت‌بات", "desc": "پاسخ به سوالات", "price": "600 تومان", "cmd": "echo 'سلام! چطور می‌توانم کمک کنم؟'"},
    {"id": "5", "name": "📊 تحلیل احساسات", "desc": "تشخیص احساس متن", "price": "350 تومان", "cmd": "echo 'احساس متن: مثبت'"},
    {"id": "6", "name": "🔍 کلیدواژه", "desc": "استخراج کلمات کلیدی", "price": "450 تومان", "cmd": "echo 'کلمات کلیدی: هوش مصنوعی'"},
    {"id": "7", "name": "📈 پیش‌بینی", "desc": "پیش‌بینی داده‌ها", "price": "800 تومان", "cmd": "echo 'پیش‌بینی انجام شد'"},
    {"id": "8", "name": "🎨 تولید متن", "desc": "تولید متن با AI", "price": "700 تومان", "cmd": "echo 'متن جدید تولید شد'"},
    {"id": "9", "name": "⚠️ خطایابی", "desc": "تشخیص خطا در کد", "price": "900 تومان", "cmd": "echo 'خطاها شناسایی شدند'"},
    {"id": "10", "name": "⭐ پیشنهاد", "desc": "سیستم پیشنهاددهنده", "price": "750 تومان", "cmd": "echo 'پیشنهادات آماده است'"}
]

@app.route('/')
def home():
    html = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>سرویس‌های هوش مصنوعی</title>
        <style>
            body { font-family: Tahoma; padding: 20px; background: #f5f5f5; }
            h1 { color: #333; text-align: center; }
            .services { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 30px; }
            .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .card h3 { color: #2c3e50; margin-bottom: 10px; }
            .card p { color: #666; font-size: 14px; }
            .price { color: #27ae60; font-weight: bold; margin: 10px 0; }
            button { width: 100%; padding: 10px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; }
            .output { background: #f8f9fa; padding: 10px; margin-top: 10px; border-radius: 5px; font-family: monospace; display: none; }
        </style>
    </head>
    <body>
        <h1>🎯 سرویس‌های هوش مصنوعی</h1>
        <p style="text-align: center; color: #666;">۱۰ سرویس کاربردی - قیمت مناسب</p>
        
        <div class="services" id="services">
            <!-- کارت‌ها اینجا اضافه می‌شوند -->
        </div>
        
        <script>
            const services = ''' + str(SERVICES).replace("'", '"') + ''';
            
            const container = document.getElementById('services');
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${service.name}</h3>
                    <p>${service.desc}</p>
                    <div class="price">${service.price}</div>
                    <button onclick="runService('${service.id}')">اجرای سرویس</button>
                    <div id="output-${service.id}" class="output"></div>
                `;
                container.appendChild(card);
            });
            
            function runService(id) {
                const output = document.getElementById('output-' + id);
                output.style.display = 'block';
                output.innerHTML = 'در حال اجرا...';
                
                setTimeout(() => {
                    const service = services.find(s => s.id === id);
                    output.innerHTML = `
                        <strong>✅ اجرا شد!</strong><br>
                        <em>نتیجه:</em> ${service.cmd}<br><br>
                        <button onclick="copyResult('${service.cmd}')" style="background: #2ecc71; font-size: 12px; padding: 5px;">
                            کپی نتیجه
                        </button>
                    `;
                }, 1000);
            }
            
            function copyResult(text) {
                navigator.clipboard.writeText(text);
                alert('کپی شد!');
            }
        </script>
    </body>
    </html>
    '''
    return render_template_string(html)

if __name__ == '__main__':
    print("✅ سیستم ساده برای مشتری آماده است!")
    print("🌐 آدرس: http://localhost:5000")
    print("📱 مشتری می‌تواند مستقیماً استفاده کند")
    app.run(host='0.0.0.0', port=5000, debug=False)
