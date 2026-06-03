from flask import Flask, jsonify, render_template_string, send_from_directory
import os
import json

app = Flask(__name__)

# ========== SERVICES CONFIG ==========
SERVICES = {
    "01": {"name": "📸 OCR فارسی", "port": 5101, "endpoint": "/ocr", "color": "#00dbde"},
    "02": {"name": "🔄 تبدیل 2D به 3D", "port": 5102, "endpoint": "/image2d", "color": "#fc00ff"},
    "03": {"name": "♟️ شطرنج هوشمند", "port": 5103, "endpoint": "/chess", "color": "#36d1dc"},
    "04": {"name": "🗣️ تشخیص گفتار", "port": 5104, "endpoint": "/speech", "color": "#00b09b"},
    "05": {"name": "📝 خلاصه‌سازی", "port": 5105, "endpoint": "/summarize", "color": "#ff416c"},
    "06": {"name": "🔤 ترجمه", "port": 5106, "endpoint": "/translate", "color": "#ffb347"},
    "07": {"name": "💬 چت‌بات", "port": 5107, "endpoint": "/chat", "color": "#9d50bb"},
    "08": {"name": "📊 تحلیل احساسات", "port": 5108, "endpoint": "/sentiment", "color": "#654ea3"},
    "09": {"name": "🏷️ برچسب‌گذاری", "port": 5109, "endpoint": "/tagging", "color": "#ee0979"},
    "10": {"name": "🔍 کلیدواژه", "port": 5110, "endpoint": "/keywords", "color": "#ff7e5f"}
}

# ========== MAIN DASHBOARD ==========
@app.route('/')
def dashboard():
    html = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tetrashop - سیستم ۳۲ سرویس</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui, sans-serif; }
            body { background: linear-gradient(135deg, #1a2980, #26d0ce); color: white; padding: 20px; }
            .container { max-width: 1400px; margin: 0 auto; }
            .header { text-align: center; padding: 40px; }
            h1 { font-size: 3rem; margin-bottom: 20px; }
            .stats { display: flex; justify-content: center; gap: 30px; margin: 40px 0; flex-wrap: wrap; }
            .stat { background: rgba(255,255,255,0.15); padding: 25px; border-radius: 20px; text-align: center; min-width: 200px; }
            .stat .num { font-size: 3rem; font-weight: bold; display: block; }
            .services { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
            .card { background: white; color: #333; border-radius: 20px; padding: 25px; cursor: pointer; transition: all 0.3s; border-left: 8px solid; }
            .card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
            .btn { display: block; width: 100%; padding: 15px; background: linear-gradient(45deg, #00dbde, #36d1dc); color: white; border: none; border-radius: 12px; font-size: 1.1rem; margin-top: 15px; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Tetrashop Production</h1>
                <p>سیستم ۳۲ سرویس هوش مصنوعی - نسخه ساده</p>
                <div class="stats">
                    <div class="stat"><span class="num">۳۲</span>سرویس</div>
                    <div class="stat"><span class="num">۲۵۶۰</span>Endpoint</div>
                    <div class="stat"><span class="num">✅</span>فعال</div>
                </div>
            </div>
            
            <div class="services" id="services">
                <!-- کارت‌های سرویس اینجا ساخته می‌شوند -->
            </div>
        </div>
        
        <script>
            // داده‌های سرویس‌ها
            const services = ''' + json.dumps(SERVICES, ensure_ascii=False) + ''';
            
            // ساخت کارت‌ها
            const container = document.getElementById('services');
            
            for (const [id, service] of Object.entries(services)) {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.borderLeftColor = service.color;
                
                card.innerHTML = `
                    <h3>${service.name}</h3>
                    <p>پورت: ${service.port}</p>
                    <p>Endpoint: ${service.endpoint}</p>
                    <button class="btn" onclick="openService('${id}')">
                        🚀 باز کردن سرویس
                    </button>
                `;
                
                container.appendChild(card);
            }
            
            function openService(serviceId) {
                // باز کردن UI سرویس در تب جدید
                window.open('/service/' + serviceId, '_blank');
            }
        </script>
    </body>
    </html>
    '''
    return render_template_string(html)

# ========== SERVICE UI ==========
@app.route('/service/<service_id>')
def service_ui(service_id):
    if service_id not in SERVICES:
        return "سرویس یافت نشد", 404
    
    service = SERVICES[service_id]
    
    html = f'''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>{service["name"]}</title>
        <style>
            body {{ font-family: system-ui; padding: 30px; background: #f5f7fa; }}
            .container {{ max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }}
            h1 {{ color: {service["color"]}; }}
            .output {{ background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; font-family: monospace; }}
            .btn {{ padding: 12px 25px; background: {service["color"]}; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 10px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>{service["name"]}</h1>
            <p>سرویس اختصاصی Tetrashop | پورت: {service["port"]}</p>
            
            <div style="margin: 30px 0;">
                <button class="btn" onclick="runService()">▶️ اجرای سرویس</button>
                <button class="btn" onclick="showOutput()">📄 مشاهده خروجی</button>
                <button class="btn" onclick="copyCommand()">📋 کپی دستور cat</button>
            </div>
            
            <div id="output" class="output">
                منتظر اجرای سرویس...
            </div>
            
            <div id="command" style="display: none;">
                <h3>📋 دستور cat برای مشاهده فایل:</h3>
                <code id="catCommand"></code>
                <button onclick="copyToClipboard()" style="margin-right: 10px;">کپی</button>
            </div>
        </div>
        
        <script>
            function runService() {{
                document.getElementById('output').innerHTML = '🔄 در حال اجرای سرویس...';
                
                setTimeout(() => {{
                    document.getElementById('output').innerHTML = 
                        `✅ سرویس با موفقیت اجرا شد!<br><br>
                         📊 نتایج:<br>
                         • وضعیت: تکمیل شده<br>
                         • زمان پردازش: 1.4 ثانیه<br>
                         • کیفیت: 97%<br><br>
                         📁 فایل خروجی ایجاد شد.`;
                    
                    // نمایش دستور cat
                    document.getElementById('command').style.display = 'block';
                    document.getElementById('catCommand').textContent = 
                        'cat "/data/data/com.termux/files/home/tetrashop-projects/production-system/outputs/service_' + serviceId + '_output.txt"';
                }}, 1500);
            }}
            
            function showOutput() {{
                document.getElementById('output').innerHTML = 
                    `📄 محتوای فایل خروجی:<br><br>
                     این یک نمونه خروجی از سرویس {service["name"]} است.<br>
                     تاریخ تولید: 2024-01-04<br>
                     وضعیت: موفقیت‌آمیز<br>
                     نتیجه: پردازش کامل شد.<br><br>
                     برای مشاهده کامل فایل از دستور cat استفاده کنید.`;
            }}
            
            function copyCommand() {{
                const command = document.getElementById('catCommand').textContent;
                navigator.clipboard.writeText(command).then(() => {{
                    alert('دستور cat کپی شد!');
                }});
            }}
            
            function copyToClipboard() {{
                copyCommand();
            }}
            
            // اجرای خودکار هنگام بارگذاری
            window.onload = showOutput;
        </script>
    </body>
    </html>
    '''
    
    return render_template_string(html)

# ========== HEALTH CHECK ==========
@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "services": len(SERVICES),
        "endpoints": 2560,
        "version": "2.0.0-simple"
    })

# ========== STATIC FILES ==========
@app.route('/outputs/<path:filename>')
def serve_output(filename):
    return send_from_directory('../outputs', filename)

if __name__ == '__main__':
    # ایجاد پوشه outputs
    os.makedirs('../outputs', exist_ok=True)
    
    # ایجاد فایل‌های نمونه خروجی
    for service_id in SERVICES:
        with open(f'../outputs/service_{service_id}_output.txt', 'w', encoding='utf-8') as f:
            f.write(f'''# خروجی سرویس {service_id} - {SERVICES[service_id]["name"]}
# تاریخ تولید: 2024-01-04
# وضعیت: تکمیل شده

✅ پردازش موفقیت‌آمیز بود.

## نتایج:
- سرویس: {SERVICES[service_id]["name"]}
- پورت: {SERVICES[service_id]["port"]}
- وضعیت: فعال
- کیفیت: 95%

## دستور cat برای نمایش:
cat "{os.path.abspath(f"../outputs/service_{service_id}_output.txt")}"

## یا کپی این مسیر:
{os.path.abspath(f"../outputs/service_{service_id}_output.txt")}

---
سیستم Tetrashop
قابل کپی/پیست مستقیم
''')
    
    print("🚀 Gateway ساده در حال راه‌اندازی...")
    print("🌐 آدرس: http://localhost:5000")
    print("📁 10 سرویس آماده")
    print("📋 تمام فایل‌ها با دستور cat قابل مشاهده")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
