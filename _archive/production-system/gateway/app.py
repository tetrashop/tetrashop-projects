from flask import Flask, jsonify, render_template_string, request, redirect, session, send_file, send_from_directory
from datetime import datetime
import json
import os
import uuid
from functools import wraps
import hashlib
import logging

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# تنظیمات لاگ
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/gateway.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ==================== CONFIGURATION ====================
SERVICES_CONFIG = {
    "services": {
        "01": {"name": "سرویس OCR فارسی", "port": 5101, "endpoint": "/ocr", "output_dir": "services/01-ocr/outputs", "price": 1000},
        "02": {"name": "تبدیل 2D به 3D", "port": 5102, "endpoint": "/image2dto3d", "output_dir": "services/02-image2dto3d/outputs", "price": 2500},
        "03": {"name": "شطرنج هوشمند", "port": 5103, "endpoint": "/chess", "output_dir": "services/03-chess/outputs", "price": 500},
        "04": {"name": "تشخیص گفتار", "port": 5104, "endpoint": "/speech", "output_dir": "services/04-speech/outputs", "price": 1500},
        "05": {"name": "خلاصه‌سازی متن", "port": 5105, "endpoint": "/summarization", "output_dir": "services/05-summarization/outputs", "price": 800},
        "06": {"name": "ترجمه ماشینی", "port": 5106, "endpoint": "/translation", "output_dir": "services/06-translation/outputs", "price": 1200},
        "07": {"name": "چت‌بات هوشمند", "port": 5107, "endpoint": "/chatbot", "output_dir": "services/07-chatbot/outputs", "price": 3000},
        "08": {"name": "تحلیل احساسات", "port": 5108, "endpoint": "/sentiment", "output_dir": "services/08-sentiment/outputs", "price": 900},
        "09": {"name": "برچسب‌گذاری متن", "port": 5109, "endpoint": "/tagging", "output_dir": "services/09-tagging/outputs", "price": 750},
        "10": {"name": "استخراج کلیدواژه", "port": 5110, "endpoint": "/keyword", "output_dir": "services/10-keyword/outputs", "price": 600},
        "11": {"name": "تولید موسیقی", "port": 5111, "endpoint": "/music", "output_dir": "services/11-music/outputs", "price": 5000},
        "12": {"name": "تولید تصویر", "port": 5112, "endpoint": "/image-gen", "output_dir": "services/12-image-gen/outputs", "price": 4000},
        "13": {"name": "پردازش اسناد", "port": 5113, "endpoint": "/doc-process", "output_dir": "services/13-doc-process/outputs", "price": 1100},
        "14": {"name": "امنیت متن", "port": 5114, "endpoint": "/security", "output_dir": "services/14-security/outputs", "price": 2000},
        "15": {"name": "وب اسکرپینگ", "port": 5115, "endpoint": "/web-scrape", "output_dir": "services/15-web-scrape/outputs", "price": 1800},
        "16": {"name": "داده کاوی", "port": 5116, "endpoint": "/data-mining", "output_dir": "services/16-data-mining/outputs", "price": 2200},
        "17": {"name": "دستیار مجازی", "port": 5117, "endpoint": "/virtual-assistant", "output_dir": "services/17-virtual-assistant/outputs", "price": 3500},
        "18": {"name": "طبقه‌بندی متن", "port": 5118, "endpoint": "/classification", "output_dir": "services/18-classification/outputs", "price": 850},
        "19": {"name": "استخراج رابطه", "port": 5119, "endpoint": "/relation", "output_dir": "services/19-relation/outputs", "price": 950},
        "20": {"name": "تشخیص لحن", "port": 5120, "endpoint": "/tone", "output_dir": "services/20-tone/outputs", "price": 700},
        "21": {"name": "تصحیح گرامر", "port": 5121, "endpoint": "/grammar", "output_dir": "services/21-grammar/outputs", "price": 650},
        "22": {"name": "نرمال‌سازی متن", "port": 5122, "endpoint": "/normalization", "output_dir": "services/22-normalization/outputs", "price": 550},
        "23": {"name": "خوشه‌بندی متن", "port": 5123, "endpoint": "/clustering", "output_dir": "services/23-clustering/outputs", "price": 900},
        "24": {"name": "پیش‌بینی متن", "port": 5124, "endpoint": "/prediction", "output_dir": "services/24-prediction/outputs", "price": 1300},
        "25": {"name": "استخراج اطلاعات", "port": 5125, "endpoint": "/extraction", "output_dir": "services/25-extraction/outputs", "price": 1400},
        "26": {"name": "جستجوی معنایی", "port": 5126, "endpoint": "/semantic", "output_dir": "services/26-semantic/outputs", "price": 1600},
        "27": {"name": "تولید ایده", "port": 5127, "endpoint": "/idea-gen", "output_dir": "services/27-idea-gen/outputs", "price": 1700},
        "28": {"name": "تحلیل مقایسه‌ای", "port": 5128, "endpoint": "/comparative", "output_dir": "services/28-comparative/outputs", "price": 1250},
        "29": {"name": "پردازش بلادرنگ", "port": 5129, "endpoint": "/realtime", "output_dir": "services/29-realtime/outputs", "price": 4500},
        "30": {"name": "API Gateway", "port": 5130, "endpoint": "/api-gateway", "output_dir": "services/30-api-gateway/outputs", "price": 2800},
        "31": {"name": "موتور جستجو", "port": 5131, "endpoint": "/search", "output_dir": "services/31-search/outputs", "price": 3200},
        "32": {"name": "مانیتورینگ سیستم", "port": 5132, "endpoint": "/monitoring", "output_dir": "services/32-monitoring/outputs", "price": 3800}
    },
    "gateway_port": 5000,
    "revenue_enabled": True,
    "currency": "تومان"
}

# ==================== AUTHENTICATION DECORATOR ====================
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated_function

# ==================== ROUTES ====================

@app.route('/')
def home():
    """صفحه اصلی Dashboard"""
    html = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tetrashop Production - سیستم ۳۲ سرویس</title>
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
            body { background: linear-gradient(135deg, #1a2980, #26d0ce); color: white; min-height: 100vh; padding: 20px; }
            .container { max-width: 1600px; margin: 0 auto; }
            .header { text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 25px; margin-bottom: 40px; }
            h1 { font-size: 3rem; margin-bottom: 20px; }
            .stats { display: flex; gap: 25px; justify-content: center; flex-wrap: wrap; margin: 40px 0; }
            .stat { background: rgba(255,255,255,0.15); padding: 25px; border-radius: 20px; text-align: center; min-width: 200px; }
            .stat .num { font-size: 2.8rem; font-weight: bold; display: block; }
            .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
            .service-card { background: white; color: #333; border-radius: 20px; padding: 25px; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-left: 8px solid #00dbde; }
            .service-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
            .service-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .service-id { background: #1a2980; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .service-price { color: #00b09b; font-weight: bold; font-size: 1.2rem; }
            .btn { display: block; width: 100%; padding: 15px; background: linear-gradient(45deg, #00dbde, #36d1dc); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Tetrashop Production System</h1>
                <p>سیستم تولیدی ۳۲ سرویس هوش مصنوعی با قابلیت درآمدزایی</p>
                <div class="stats">
                    <div class="stat"><span class="num">۳۲</span>سرویس فعال</div>
                    <div class="stat"><span class="num">۳۱۲+</span>NLP Endpoint</div>
                    <div class="stat"><span class="num">✅</span>آماده تولید</div>
                    <div class="stat"><span class="num">💰</span>سیستم درآمدی</div>
                </div>
            </div>
            
            <div class="services-grid" id="servicesGrid">
                <!-- سرویس‌ها توسط JavaScript بارگذاری می‌شوند -->
            </div>
        </div>
        
        <script>
            // بارگذاری سرویس‌ها
            fetch('/api/services')
                .then(r => r.json())
                .then(services => {
                    const grid = document.getElementById('servicesGrid');
                    grid.innerHTML = '';
                    
                    services.forEach(s => {
                        const card = document.createElement('div');
                        card.className = 'service-card';
                        card.innerHTML = `
                            <div class="service-header">
                                <span class="service-id">${s.id}</span>
                                <span class="service-price">${s.price} تومان</span>
                            </div>
                            <h3>${s.name}</h3>
                            <p>پورت: ${s.port} | endpoint: ${s.endpoint}</p>
                            <button class="btn" onclick="openService('${s.id}')">
                                🚀 بازکردن سرویس
                            </button>
                        `;
                        grid.appendChild(card);
                    });
                });
            
            function openService(serviceId) {
                // درخواست توکن برای دسترسی
                fetch('/api/generate-token', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({service_id: serviceId})
                })
                .then(r => r.json())
                .then(data => {
                    if(data.success) {
                        // انتقال به UI سرویس
                        window.location.href = `/service/${serviceId}/ui?token=${data.token}`;
                    }
                });
            }
        </script>
    </body>
    </html>
    '''
    return render_template_string(html)

@app.route('/login')
def login():
    """صفحه ورود ساده (برای نمونه)"""
    session['user_id'] = str(uuid.uuid4())
    session['username'] = 'user_' + session['user_id'][:8]
    return redirect('/')

@app.route('/api/services')
def get_services():
    """دریافت لیست سرویس‌ها"""
    services_list = []
    for s_id, config in SERVICES_CONFIG['services'].items():
        services_list.append({
            "id": s_id,
            "name": config['name'],
            "port": config['port'],
            "endpoint": config['endpoint'],
            "price": config['price']
        })
    return jsonify(services_list)

@app.route('/api/generate-token', methods=['POST'])
def generate_token():
    """تولید توکن دسترسی برای سرویس"""
    data = request.json
    service_id = data.get('service_id')
    
    if service_id not in SERVICES_CONFIG['services']:
        return jsonify({"success": False, "error": "سرویس یافت نشد"})
    
    # ایجاد توکن ساده (در تولید واقعی از JWT استفاده کنید)
    token = hashlib.sha256(f"{service_id}_{datetime.now().isoformat()}".encode()).hexdigest()[:32]
    
    # ذخیره توکن در session
    if 'service_tokens' not in session:
        session['service_tokens'] = {}
    session['service_tokens'][service_id] = token
    
    logger.info(f"توکن جدید برای سرویس {service_id} تولید شد: {token[:8]}...")
    
    return jsonify({
        "success": True,
        "token": token,
        "service_id": service_id,
        "expires_in": 3600  # 1 ساعت
    })

@app.route('/service/<service_id>/ui')
@login_required
def service_ui(service_id):
    """UI اختصاصی سرویس"""
    if service_id not in SERVICES_CONFIG['services']:
        return "سرویس یافت نشد", 404
    
    # بررسی توکن
    token = request.args.get('token')
    if not token or session.get('service_tokens', {}).get(service_id) != token:
        return "دسترسی غیرمجاز", 403
    
    config = SERVICES_CONFIG['services'][service_id]
    
    # ایجاد UI اختصاصی سرویس
    service_html = f'''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>{config["name"]} - Tetrashop</title>
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }}
            body {{ background: #f8f9fa; color: #333; }}
            .header {{ background: linear-gradient(90deg, #1a2980, #26d0ce); color: white; padding: 30px; }}
            .container {{ max-width: 1200px; margin: 0 auto; padding: 30px; }}
            .service-info {{ background: white; padding: 25px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }}
            .output-section {{ background: white; padding: 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }}
            .output-item {{ padding: 20px; border-bottom: 1px solid #eee; }}
            .copy-btn {{ background: #00b09b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-left: 10px; }}
            .disabled {{ opacity: 0.5; cursor: not-allowed; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎯 {config["name"]}</h1>
            <p>سرویس اختصاصی Tetrashop | پورت: {config["port"]} | قیمت: {config["price"]} تومان</p>
        </div>
        
        <div class="container">
            <div class="service-info">
                <h2>📊 عملیات سرویس</h2>
                <p>این UI مختص سرویس {service_id} است. شما می‌توانید عملیات مختلف را انجام دهید.</p>
                
                <div style="margin-top: 20px;">
                    <button onclick="runService()" style="padding: 15px 30px; background: linear-gradient(45deg, #00dbde, #36d1dc); color: white; border: none; border-radius: 12px; font-size: 1.1rem; cursor: pointer;">
                        ▶️ اجرای سرویس
                    </button>
                    
                    <button onclick="checkOutputs()" style="padding: 15px 30px; background: #667eea; color: white; border: none; border-radius: 12px; font-size: 1.1rem; cursor: pointer; margin-right: 15px;">
                        📁 بررسی خروجی‌ها
                    </button>
                </div>
                
                <div id="status" style="margin-top: 20px; padding: 15px; border-radius: 10px; background: #f8f9fa; display: none;"></div>
            </div>
            
            <div class="output-section">
                <h2>📄 خروجی‌های تولید شده</h2>
                <p>پس از اجرای سرویس، خروجی‌ها اینجا نمایش داده می‌شوند.</p>
                <div id="outputsList"></div>
            </div>
        </div>
        
        <script>
            const serviceId = "{service_id}";
            const token = "{token}";
            
            function runService() {{
                document.getElementById('status').style.display = 'block';
                document.getElementById('status').innerHTML = '🔄 در حال اجرای سرویس...';
                
                fetch(`/api/service/${{serviceId}}/run`, {{
                    method: 'POST',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify({{token: token}})
                }})
                .then(r => r.json())
                .then(data => {{
                    if(data.success) {{
                        document.getElementById('status').innerHTML = `✅ سرویس با موفقیت اجرا شد.<br>شناسه پردازش: ${{data.process_id}}`;
                        // بررسی خروجی‌ها پس از 3 ثانیه
                        setTimeout(checkOutputs, 3000);
                    }} else {{
                        document.getElementById('status').innerHTML = `❌ خطا: ${{data.error}}`;
                    }}
                }});
            }}
            
            function checkOutputs() {{
                fetch(`/api/service/${{serviceId}}/outputs?token=${{token}}`)
                    .then(r => r.json())
                    .then(data => {{
                        const outputsDiv = document.getElementById('outputsList');
                        if(data.outputs && data.outputs.length > 0) {{
                            let html = '';
                            data.outputs.forEach(output => {{
                                html += `
                                    <div class="output-item">
                                        <strong>📄 ${{output.filename}}</strong><br>
                                        <small>مسیر: <code>${{output.path}}</code></small><br>
                                        <small>سایز: ${{output.size}} | تاریخ: ${{output.created_at}}</small><br>
                                        <button onclick="viewFile('${{serviceId}}', '${{output.filename}}')" class="copy-btn">👁️ نمایش</button>
                                        <button onclick="copyContent('${{output.content}}')" class="copy-btn">📋 کپی محتوا</button>
                                        <button onclick="downloadFile('${{serviceId}}', '${{output.filename}}')" class="copy-btn">💾 دانلود</button>
                                    </div>
                                `;
                            }});
                            outputsDiv.innerHTML = html;
                        }} else {{
                            outputsDiv.innerHTML = '<p>هنوز خروجی‌ای تولید نشده است.</p>';
                        }}
                    }});
            }}
            
            function viewFile(serviceId, filename) {{
                window.open(`/api/service/${{serviceId}}/view/${{encodeURIComponent(filename)}}?token=${{token}}`, '_blank');
            }}
            
            function copyContent(content) {{
                navigator.clipboard.writeText(content).then(() => {{
                    alert('محتوا با موفقیت کپی شد!');
                }});
            }}
            
            function downloadFile(serviceId, filename) {{
                window.location.href = `/api/service/${{serviceId}}/download/${{encodeURIComponent(filename)}}?token=${{token}}`;
            }}
            
            // بارگذاری اولیه خروجی‌ها
            checkOutputs();
        </script>
    </body>
    </html>
    '''
    
    return render_template_string(service_html)

@app.route('/api/service/<service_id>/run', methods=['POST'])
@login_required
def run_service(service_id):
    """اجرای یک سرویس خاص"""
    if service_id not in SERVICES_CONFIG['services']:
        return jsonify({"success": False, "error": "سرویس یافت نشد"})
    
    data = request.json
    token = data.get('token')
    
    # بررسی توکن
    if not token or session.get('service_tokens', {}).get(service_id) != token:
        return jsonify({"success": False, "error": "توکن نامعتبر"})
    
    config = SERVICES_CONFIG['services'][service_id]
    
    # ایجاد پوشه خروجی
    output_dir = config['output_dir']
    os.makedirs(output_dir, exist_ok=True)
    
    # تولید شناسه پردازش
    process_id = str(uuid.uuid4())[:8]
    
    # ایجاد فایل خروجی نمونه (در واقعیت اینجا سرویس واقعی اجرا می‌شود)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"{output_dir}/output_{service_id}_{process_id}_{timestamp}.txt"
    
    # محتوای نمونه خروجی
    sample_content = f"""# خروجی سرویس {service_id} - {config['name']}
# شناسه پردازش: {process_id}
# تاریخ تولید: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
# کاربر: {session.get('username', 'ناشناس')}

✅ سرویس با موفقیت اجرا شد.

## جزئیات پردازش:
- سرویس: {config['name']}
- پورت: {config['port']}
- نقطه پایانی: {config['endpoint']}
- هزینه سرویس: {config['price']} {SERVICES_CONFIG['currency']}
- وضعیت: تکمیل شده

## نتایج:
این یک خروجی نمونه است. در سیستم واقعی، نتایج پردازش اینجا قرار می‌گیرد.

### دستور cat برای نمایش فایل:
cat "{os.path.abspath(output_file)}"

### یا کپی این مسیر:
{os.path.abspath(output_file)}

---
سیستم تولیدی Tetrashop
برای درآمدزایی کلیدی طراحی شده است.
"""
    
    # ذخیره فایل خروجی
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sample_content)
    
    # ثبت در لاگ سیستم
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "service_id": service_id,
        "service_name": config['name'],
        "process_id": process_id,
        "user": session.get('username'),
        "output_file": output_file,
        "price": config['price'],
        "status": "completed"
    }
    
    log_file = f"logs/outputs/service_{service_id}_{timestamp}.json"
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    with open(log_file, 'w', encoding='utf-8') as f:
        json.dump(log_entry, f, ensure_ascii=False, indent=2)
    
    logger.info(f"سرویس {service_id} اجرا شد. خروجی: {output_file}")
    
    return jsonify({
        "success": True,
        "process_id": process_id,
        "output_file": output_file,
        "message": "سرویس با موفقیت اجرا شد",
        "revenue": config['price'],
        "currency": SERVICES_CONFIG['currency']
    })

@app.route('/api/service/<service_id>/outputs')
@login_required
def get_service_outputs(service_id):
    """دریافت لیست خروجی‌های یک سرویس"""
    if service_id not in SERVICES_CONFIG['services']:
        return jsonify({"success": False, "error": "سرویس یافت نشد"})
    
    token = request.args.get('token')
    if not token or session.get('service_tokens', {}).get(service_id) != token:
        return jsonify({"success": False, "error": "توکن نامعتبر"})
    
    config = SERVICES_CONFIG['services'][service_id]
    output_dir = config['output_dir']
    
    outputs = []
    
    if os.path.exists(output_dir):
        for filename in os.listdir(output_dir):
            if filename.endswith('.txt'):
                filepath = os.path.join(output_dir, filename)
                stat = os.stat(filepath)
                
                # خواندن محتوای فایل
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                outputs.append({
                    "filename": filename,
                    "path": os.path.abspath(filepath),
                    "size": f"{stat.st_size / 1024:.2f} KB",
                    "created_at": datetime.fromtimestamp(stat.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
                    "content": content,
                    "can_copy": True  # همیشه فعال است چون فایل کامل شده
                })
    
    # مرتب سازی بر اساس تاریخ (جدیدترین اول)
    outputs.sort(key=lambda x: x['created_at'], reverse=True)
    
    return jsonify({
        "success": True,
        "service_id": service_id,
        "outputs": outputs[:10]  # فقط 10 مورد آخر
    })

@app.route('/api/service/<service_id>/view/<filename>')
@login_required
def view_output_file(service_id, filename):
    """مشاهده محتوای یک فایل خروجی"""
    if service_id not in SERVICES_CONFIG['services']:
        return "سرویس یافت نشد", 404
    
    token = request.args.get('token')
    if not token or session.get('service_tokens', {}).get(service_id) != token:
        return "دسترسی غیرمجاز", 403
    
    config = SERVICES_CONFIG['services'][service_id]
    filepath = os.path.join(config['output_dir'], filename)
    
    if not os.path.exists(filepath):
        return "فایل یافت نشد", 404
    
    # خواندن محتوا و نمایش به صورت HTML
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    html_content = f'''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>مشاهده فایل: {filename}</title>
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }}
            body {{ background: #f8f9fa; padding: 30px; }}
            .container {{ max-width: 1200px; margin: 0 auto; background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }}
            pre {{ background: #1e1e1e; color: #d4d4d4; padding: 25px; border-radius: 10px; overflow-x: auto; direction: ltr; text-align: left; }}
            .actions {{ margin-bottom: 20px; }}
            .btn {{ padding: 12px 25px; background: #00b09b; color: white; border: none; border-radius: 8px; cursor: pointer; margin-left: 10px; text-decoration: none; display: inline-block; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="actions">
                <a href="/service/{service_id}/ui?token={token}" class="btn">← بازگشت به سرویس</a>
                <button onclick="copyAllContent()" class="btn">📋 کپی تمام محتوا</button>
                <a href="/api/service/{service_id}/download/{filename}?token={token}" class="btn">💾 دانلود فایل</a>
            </div>
            
            <h2>فایل: {filename}</h2>
            <p>مسیر: <code>{os.path.abspath(filepath)}</code></p>
            
            <pre id="fileContent">{content}</pre>
        </div>
        
        <script>
            function copyAllContent() {{
                const content = document.getElementById('fileContent').textContent;
                navigator.clipboard.writeText(content).then(() => {{
                    alert('تمام محتوای فایل کپی شد!');
                }});
            }}
            
            // هایلایت دستور cat
            document.addEventListener('DOMContentLoaded', () => {{
                const pre = document.getElementById('fileContent');
                let text = pre.textContent;
                // هایلایت دستورات cat
                text = text.replace(/cat\\s+"([^"]+)"/g, '<span style="color: #569cd6">cat</span> <span style="color: #ce9178">"$1"</span>');
                pre.innerHTML = text;
            }});
        </script>
    </body>
    </html>
    '''
    
    return render_template_string(html_content)

@app.route('/api/service/<service_id>/download/<filename>')
@login_required
def download_output_file(service_id, filename):
    """دانلود فایل خروجی"""
    if service_id not in SERVICES_CONFIG['services']:
        return "سرویس یافت نشد", 404
    
    token = request.args.get('token')
    if not token or session.get('service_tokens', {}).get(service_id) != token:
        return "دسترسی غیرمجاز", 403
    
    config = SERVICES_CONFIG['services'][service_id]
    directory = config['output_dir']
    
    return send_from_directory(
        directory=directory,
        path=filename,
        as_attachment=True
    )

@app.route('/api/revenue/stats')
@login_required
def revenue_stats():
    """آمار درآمد سیستم"""
    revenue_data = []
    total = 0
    
    for service_id, config in SERVICES_CONFIG['services'].items():
        # در سیستم واقعی، این اطلاعات از دیتابیس خوانده می‌شود
        service_revenue = {
            "service_id": service_id,
            "name": config['name'],
            "price": config['price'],
            "usage_count": 10,  # نمونه
            "total": config['price'] * 10
        }
        revenue_data.append(service_revenue)
        total += service_revenue['total']
    
    return jsonify({
        "total_revenue": total,
        "currency": SERVICES_CONFIG['currency'],
        "services": revenue_data,
        "summary": {
            "total_services": len(SERVICES_CONFIG['services']),
            "average_price": total / len(SERVICES_CONFIG['services']),
            "estimated_monthly": total * 30
        }
    })

@app.route('/admin')
@login_required
def admin_dashboard():
    """داشبورد مدیریت برای نظارت بر سیستم"""
    html = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>مدیریت سیستم Tetrashop</title>
        <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
            body { background: #f0f2f5; padding: 20px; }
            .container { max-width: 1400px; margin: 0 auto; }
            .header { background: white; padding: 30px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
            .card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>👑 مدیریت سیستم تولیدی Tetrashop</h1>
                <p>نظارت بر ۳۲ سرویس و سیستم درآمدزایی</p>
            </div>
            
            <div class="cards">
                <div class="card">
                    <h3>💰 آمار درآمد</h3>
                    <div id="revenueStats">در حال بارگذاری...</div>
                </div>
                
                <div class="card">
                    <h3>📊 وضعیت سرویس‌ها</h3>
                    <div id="servicesStatus">در حال بارگذاری...</div>
                </div>
                
                <div class="card">
                    <h3>📈 لاگ سیستم</h3>
                    <button onclick="viewLogs()">مشاهده لاگ‌ها</button>
                </div>
            </div>
        </div>
        
        <script>
            fetch('/api/revenue/stats')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('revenueStats').innerHTML = `
                        <p>کل درآمد: <strong>${data.total_revenue.toLocaleString()} ${data.currency}</strong></p>
                        <p>میانگین قیمت: ${data.summary.average_price.toLocaleString()}</p>
                        <p>پیش‌بینی ماهانه: ${data.summary.estimated_monthly.toLocaleString()}</p>
                    `;
                });
            
            fetch('/api/services')
                .then(r => r.json())
                .then(services => {
                    document.getElementById('servicesStatus').innerHTML = `
                        <p>تعداد سرویس‌ها: ${services.length}</p>
                        <p>سرویس‌های فعال: ${services.length}</p>
                        <p>پرت‌های فعال: ${services.map(s => s.port).join(', ')}</p>
                    `;
                });
            
            function viewLogs() {
                window.open('/logs/gateway.log', '_blank');
            }
        </script>
    </body>
    </html>
    '''
    
    return render_template_string(html)

if __name__ == '__main__':
    # ایجاد پوشه‌های لازم
    os.makedirs('logs', exist_ok=True)
    os.makedirs('logs/outputs', exist_ok=True)
    
    for service_id, config in SERVICES_CONFIG['services'].items():
        os.makedirs(config['output_dir'], exist_ok=True)
    
    print(f"🚀 Gateway تولیدی Tetrashop در حال راه‌اندازی...")
    print(f"🌐 دسترسی: http://localhost:{SERVICES_CONFIG['gateway_port']}")
    print(f"👑 مدیریت: http://localhost:{SERVICES_CONFIG['gateway_port']}/admin")
    print(f"🔒 تعداد سرویس‌ها: {len(SERVICES_CONFIG['services'])}")
    
    app.run(
        host='0.0.0.0',
        port=SERVICES_CONFIG['gateway_port'],
        debug=True,
        threaded=True
    )
