from flask import Flask, jsonify, render_template_string
import os

app = Flask(__name__)

# اطلاعات ۳۲ سرویس
SERVICES = [
    {"id": "01", "name": "📸 OCR فارسی", "desc": "استخراج متن از تصویر", "color": "#00dbde", "cat_cmd": "cat ~/tetrashop-projects/outputs/ocr_result.txt"},
    {"id": "02", "name": "🔄 تبدیل ۲D به ۳D", "desc": "تبدیل تصویر به مدل سه‌بعدی", "color": "#fc00ff", "cat_cmd": "cat ~/tetrashop-projects/outputs/3d_model.txt"},
    {"id": "03", "name": "♟️ شطرنج هوشمند", "desc": "بازی و تحلیل شطرنج", "color": "#36d1dc", "cat_cmd": "cat ~/tetrashop-projects/outputs/chess_move.txt"},
    {"id": "04", "name": "🗣️ تشخیص گفتار", "desc": "تبدیل صوت به متن فارسی", "color": "#00b09b", "cat_cmd": "cat ~/tetrashop-projects/outputs/speech_text.txt"},
    {"id": "05", "name": "📝 خلاصه‌سازی", "desc": "خلاصه‌سازی متن‌های طولانی", "color": "#ff416c", "cat_cmd": "cat ~/tetrashop-projects/outputs/summary.txt"},
    {"id": "06", "name": "🔤 ترجمه", "desc": "ترجمه فارسی-انگلیسی", "color": "#ffb347", "cat_cmd": "cat ~/tetrashop-projects/outputs/translation.txt"},
    {"id": "07", "name": "💬 چت‌بات", "desc": "دستیار مکالمه هوشمند", "color": "#9d50bb", "cat_cmd": "cat ~/tetrashop-projects/outputs/chat_log.txt"},
    {"id": "08", "name": "📊 تحلیل احساسات", "desc": "تشخیص احساس در متن", "color": "#654ea3", "cat_cmd": "cat ~/tetrashop-projects/outputs/sentiment.txt"},
    {"id": "09", "name": "🏷️ برچسب‌گذاری", "desc": "تخصیص برچسب به متن", "color": "#ee0979", "cat_cmd": "cat ~/tetrashop-projects/outputs/tags.txt"},
    {"id": "10", "name": "🔍 کلیدواژه", "desc": "استخراج کلیدواژه‌های اصلی", "color": "#ff7e5f", "cat_cmd": "cat ~/tetrashop-projects/outputs/keywords.txt"}
]

@app.route('/')
def home():
    html = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tetrashop - سیستم ساده</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: Tahoma, sans-serif; }
            body { background: linear-gradient(135deg, #1a2980, #26d0ce); color: white; padding: 20px; }
            .container { max-width: 1400px; margin: 0 auto; }
            .header { text-align: center; padding: 30px; }
            h1 { font-size: 2.5rem; margin-bottom: 10px; }
            .services { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
            .card { background: white; color: #333; border-radius: 15px; padding: 20px; cursor: pointer; transition: 0.3s; border-left: 6px solid; }
            .card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
            .btn { display: block; width: 100%; padding: 12px; background: #1a73e8; color: white; border: none; border-radius: 8px; margin-top: 15px; cursor: pointer; }
            .output { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px; font-family: monospace; display: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Tetrashop - نسخه ساده</h1>
                <p>سیستم ۱۰ سرویس با قابلیت cat مستقیم</p>
            </div>
            
            <div class="services" id="services">
                <!-- کارت‌ها اینجا ساخته می‌شوند -->
            </div>
        </div>
        
        <script>
            const services = ''' + str(SERVICES).replace("'", '"') + ''';
            
            // ساخت کارت‌ها
            const container = document.getElementById('services');
            
            services.forEach(service => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.borderLeftColor = service.color;
                card.innerHTML = `
                    <h3>${service.name}</h3>
                    <p>${service.desc}</p>
                    <button class="btn" onclick="runService('${service.id}')">
                        ▶️ اجرای سرویس
                    </button>
                    <button class="btn" onclick="showCatCommand('${service.id}', '${service.cat_cmd.replace("'", "\\'")}')" style="background: #00b09b; margin-top: 5px;">
                        📋 دستور cat
                    </button>
                    <div id="output-${service.id}" class="output"></div>
                `;
                container.appendChild(card);
            });
            
            function runService(serviceId) {
                const output = document.getElementById('output-' + serviceId);
                output.style.display = 'block';
                output.innerHTML = '🔄 در حال اجرا...';
                
                setTimeout(() => {
                    output.innerHTML = `
                        ✅ سرویس اجرا شد!<br>
                        فایل خروجی ایجاد شده.<br>
                        برای مشاهده از دکمه "دستور cat" استفاده کنید.
                    `;
                }, 1000);
            }
            
            function showCatCommand(serviceId, cmd) {
                const output = document.getElementById('output-' + serviceId);
                output.style.display = 'block';
                output.innerHTML = `
                    <strong>📋 دستور cat:</strong><br>
                    <code style="background: #eee; padding: 5px; border-radius: 4px; display: block; margin: 10px 0;">${cmd}</code>
                    <button onclick="copyToClipboard('${cmd.replace("'", "\\'")}')" style="padding: 8px 15px; background: #ff9800; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        کپی دستور
                    </button>
                `;
            }
            
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('دستور cat کپی شد!');
                });
            }
        </script>
    </body>
    </html>
    '''
    return render_template_string(html)

@app.route('/health')
def health():
    return jsonify({
        "status": "active",
        "services": len(SERVICES),
        "simple_version": True,
        "message": "Gateway ساده Tetrashop"
    })

@app.route('/cat/<service_id>')
def cat_command(service_id):
    for service in SERVICES:
        if service["id"] == service_id:
            return jsonify({
                "command": service["cat_cmd"],
                "service": service["name"],
                "description": "این دستور را در ترمینال کپی کنید"
            })
    return jsonify({"error": "سرویس یافت نشد"})

if __name__ == '__main__':
    print("🚀 Gateway ساده Tetrashop")
    print("🌐 آدرس: http://localhost:5000")
    print("📋 10 سرویس با قابلیت cat")
    app.run(host='0.0.0.0', port=5000, debug=True)
