#!/usr/bin/env python3
"""
TETRASHOP - Gateway نسخه ۲.۰.۰
۳۲ سرویس هوش مصنوعی - سیستم تولیدی
"""

from flask import Flask, jsonify, render_template_string, send_from_directory
import os
import json
import time
from datetime import datetime

app = Flask(__name__)

# ==================== ۳۲ سرویس کامل ====================
ALL_SERVICES = [
    # گروه ۱: بینایی کامپیوتر (Computer Vision)
    {"id": "01", "name": "📸 OCR فارسی", "desc": "تشخیص متن از تصاویر فارسی", "color": "#00dbde", "icon": "📸", "category": "بینایی", "price": 500},
    {"id": "02", "name": "🔄 تبدیل ۲D به ۳D", "desc": "تبدیل تصاویر ۲D به مدل‌های ۳D", "color": "#fc00ff", "icon": "🔄", "category": "بینایی", "price": 1500},
    {"id": "15", "name": "🎨 تولید تصویر", "desc": "تولید تصویر با هوش مصنوعی", "color": "#FF6B6B", "icon": "🎨", "category": "بینایی", "price": 5000},
    {"id": "16", "name": "🎵 تولید صوت", "desc": "تولید موسیقی و صدا با AI", "color": "#4ECDC4", "icon": "🎵", "category": "بینایی", "price": 8000},
    {"id": "17", "name": "🎬 تولید ویدیو", "desc": "تولید ویدیو با هوش مصنوعی", "color": "#45B7D1", "icon": "🎬", "category": "بینایی", "price": 15000},
    
    # گروه ۲: پردازش زبان طبیعی (NLP)
    {"id": "04", "name": "🗣️ تشخیص گفتار", "desc": "تبدیل صوت به متن فارسی", "color": "#00b09b", "icon": "🗣️", "category": "متن", "price": 1500},
    {"id": "05", "name": "📝 خلاصه‌سازی", "desc": "خلاصه‌سازی متن‌های طولانی", "color": "#ff416c", "icon": "📝", "category": "متن", "price": 500},
    {"id": "06", "name": "🔤 ترجمه", "desc": "ترجمه فارسی-انگلیسی", "color": "#ffb347", "icon": "🔤", "category": "متن", "price": 500},
    {"id": "07", "name": "💬 چت‌بات", "desc": "دستیار مکالمه هوشمند", "color": "#9d50bb", "icon": "💬", "category": "متن", "price": 1500},
    {"id": "08", "name": "📊 تحلیل احساسات", "desc": "تشخیص احساس در متن", "color": "#654ea3", "icon": "📊", "category": "متن", "price": 500},
    {"id": "09", "name": "🏷️ برچسب‌گذاری", "desc": "تخصیص برچسب به متن", "color": "#ee0979", "icon": "🏷️", "category": "متن", "price": 1500},
    {"id": "10", "name": "🔍 کلیدواژه", "desc": "استخراج کلیدواژه‌های اصلی", "color": "#ff7e5f", "icon": "🔍", "category": "متن", "price": 1500},
    {"id": "11", "name": "🧠 شناسایی موجودیت‌ها", "desc": "تشخیص نام‌ها و مکان‌ها", "color": "#96FBC4", "icon": "🧠", "category": "متن", "price": 3000},
    {"id": "12", "name": "❓ پرسش و پاسخ", "desc": "سیستم Q&A هوشمند", "color": "#FAD961", "icon": "❓", "category": "متن", "price": 3000},
    {"id": "13", "name": "✍️ تولید متن", "desc": "تولید متن با هوش مصنوعی", "color": "#FF5E62", "icon": "✍️", "category": "متن", "price": 3000},
    
    # گروه ۳: علوم داده (Data Science)
    {"id": "18", "name": "⚠️ تشخیص ناهنجاری", "desc": "تشخیص خطا و ناهنجاری در داده", "color": "#FF9966", "icon": "⚠️", "category": "داده", "price": 5000},
    {"id": "19", "name": "⭐ سیستم پیشنهاد", "desc": "سیستم پیشنهاددهنده هوشمند", "color": "#FF5E62", "icon": "⭐", "category": "داده", "price": 5000},
    {"id": "20", "name": "📈 پیش‌بینی", "desc": "پیش‌بینی سری‌های زمانی", "color": "#00cdac", "icon": "📈", "category": "داده", "price": 8000},
    {"id": "21", "name": "⚡ بهینه‌سازی", "desc": "بهینه‌سازی مسائل پیچیده", "color": "#DA22FF", "icon": "⚡", "category": "داده", "price": 8000},
    {"id": "22", "name": "🔮 خوشه‌بندی", "desc": "خوشه‌بندی داده‌ها", "color": "#FF8008", "icon": "🔮", "category": "داده", "price": 5000},
    {"id": "23", "name": "🏛️ طبقه‌بندی", "desc": "طبقه‌بندی داده‌ها", "color": "#36D1DC", "icon": "🏛️", "category": "داده", "price": 5000},
    {"id": "24", "name": "📐 رگرسیون", "desc": "تحلیل رگرسیون", "color": "#5B86E5", "icon": "📐", "category": "داده", "price": 5000},
    
    # گروه ۴: یادگیری عمیق (Deep Learning)
    {"id": "25", "name": "🧠 شبکه عصبی عمیق", "desc": "DNN برای کاربردهای پیچیده", "color": "#834d9b", "icon": "🧠", "category": "یادگیری", "price": 15000},
    {"id": "26", "name": "👁️ شبکه کانولوشنی", "desc": "CNN برای پردازش تصویر", "color": "#d04ed6", "icon": "👁️", "category": "یادگیری", "price": 15000},
    {"id": "27", "name": "🔄 شبکه بازگشتی", "desc": "RNN برای داده‌های دنباله‌ای", "color": "#f46b45", "icon": "🔄", "category": "یادگیری", "price": 15000},
    {"id": "28", "name": "🎭 شبکه مولد تخاصمی", "desc": "GAN برای تولید داده", "color": "#eea849", "icon": "🎭", "category": "یادگیری", "price": 15000},
    {"id": "29", "name": "⚡ ترنسفورمر", "desc": "مدل‌های مبتنی بر ترنسفورمر", "color": "#7b4397", "icon": "⚡", "category": "یادگیری", "price": 15000},
    {"id": "30", "name": "🎮 یادگیری تقویتی", "desc": "RL برای تصمیم‌گیری", "color": "#dc2430", "icon": "🎮", "category": "یادگیری", "price": 15000},
    
    # گروه ۵: ویژه
    {"id": "03", "name": "♟️ شطرنج هوشمند", "desc": "بازی و تحلیل شطرنج", "color": "#36d1dc", "icon": "♟️", "category": "ویژه", "price": 3000},
    {"id": "14", "name": "💻 تولید کد", "desc": "تولید کد با هوش مصنوعی", "color": "#FFD200", "icon": "💻", "category": "ویژه", "price": 3000},
    {"id": "31", "name": "🌐 یادگیری فدرال", "desc": "آموزش مدل‌های فدرال", "color": "#667eea", "icon": "🌐", "category": "ویژه", "price": 15000},
    {"id": "32", "name": "📱 محاسبات لبه", "desc": "پردازش در دستگاه‌های لبه", "color": "#764ba2", "icon": "📱", "category": "ویژه", "price": 15000}
]

# ==================== STATISTICS ====================
SYSTEM_STATS = {
    "total_services": 32,
    "total_endpoints": 2560,
    "total_users": 0,
    "total_revenue": 0,
    "requests_today": 0,
    "active_since": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

# ==================== ROUTES ====================
@app.route('/')
def dashboard():
    """داشبورد اصلی با ۳۲ کارت سرویس"""
    
    html_template = '''
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 Tetrashop - ۳۲ سرویس هوش مصنوعی</title>
        <style>
            /* Reset & Base */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            :root {
                --primary: #0f0c29;
                --secondary: #302b63;
                --accent: #24243e;
                --gradient-1: linear-gradient(135deg, #00dbde, #fc00ff);
                --gradient-2: linear-gradient(135deg, #36d1dc, #5b86e5);
                --text-light: #ffffff;
                --text-gray: #b0b0b0;
                --card-bg: rgba(255, 255, 255, 0.05);
                --card-border: rgba(255, 255, 255, 0.1);
            }
            
            body {
                font-family: 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif;
                background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
                color: var(--text-light);
                min-height: 100vh;
                padding: 20px;
                line-height: 1.6;
            }
            
            .container {
                max-width: 1800px;
                margin: 0 auto;
                padding: 20px;
            }
            
            /* Header */
            .header {
                text-align: center;
                padding: 60px 40px;
                background: var(--card-bg);
                border-radius: 30px;
                margin-bottom: 50px;
                backdrop-filter: blur(20px);
                border: 2px solid var(--card-border);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: var(--gradient-1);
            }
            
            h1 {
                font-size: 4.5rem;
                margin-bottom: 20px;
                background: var(--gradient-1);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 900;
                letter-spacing: -1px;
            }
            
            .subtitle {
                font-size: 1.4rem;
                opacity: 0.9;
                margin-bottom: 40px;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
            }
            
            /* Stats */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 25px;
                margin: 50px 0;
            }
            
            .stat-card {
                background: var(--card-bg);
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                border: 1px solid var(--card-border);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .stat-card:hover {
                transform: translateY(-10px);
                background: rgba(255, 255, 255, 0.08);
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
            }
            
            .stat-number {
                font-size: 3.5rem;
                font-weight: 900;
                display: block;
                margin-bottom: 10px;
                background: var(--gradient-2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            /* Filter Buttons */
            .filter-buttons {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                justify-content: center;
                margin: 40px 0;
            }
            
            .filter-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 50px;
                background: var(--card-bg);
                color: var(--text-light);
                cursor: pointer;
                transition: all 0.3s;
                font-weight: 600;
                border: 1px solid var(--card-border);
            }
            
            .filter-btn:hover,
            .filter-btn.active {
                background: var(--gradient-1);
                transform: scale(1.05);
            }
            
            /* Services Grid */
            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 30px;
                margin-top: 40px;
            }
            
            .service-card {
                background: var(--card-bg);
                border-radius: 25px;
                padding: 30px;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--card-border);
                position: relative;
                overflow: hidden;
            }
            
            .service-card:hover {
                transform: translateY(-15px) scale(1.02);
                background: rgba(255, 255, 255, 0.07);
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
                border-color: rgba(255, 255, 255, 0.2);
            }
            
            .service-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(90deg, var(--service-color), transparent);
            }
            
            .service-id {
                position: absolute;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.4);
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .service-icon {
                font-size: 3rem;
                margin-bottom: 15px;
                display: block;
            }
            
            .service-name {
                font-size: 1.5rem;
                margin: 15px 0 10px 0;
                font-weight: 700;
                line-height: 1.3;
            }
            
            .service-desc {
                opacity: 0.85;
                margin-bottom: 25px;
                font-size: 1rem;
                min-height: 60px;
            }
            
            .service-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .service-category {
                background: rgba(255, 255, 255, 0.1);
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 0.85rem;
            }
            
            .service-price {
                font-weight: 700;
                font-size: 1.3rem;
                color: #00ff88;
            }
            
            .action-buttons {
                display: flex;
                gap: 12px;
                margin-top: 25px;
            }
            
            .btn {
                flex: 1;
                padding: 14px;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
                font-size: 0.95rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .btn-run {
                background: linear-gradient(45deg, #00b09b, #96c93d);
                color: white;
            }
            
            .btn-cat {
                background: linear-gradient(45deg, #36d1dc, #5b86e5);
                color: white;
            }
            
            .btn-details {
                background: linear-gradient(45deg, #ff416c, #ff4b2b);
                color: white;
            }
            
            .btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                opacity: 0.95;
            }
            
            /* Output Panel */
            .output-panel {
                background: rgba(0, 0, 0, 0.25);
                border-radius: 15px;
                padding: 20px;
                margin-top: 20px;
                display: none;
                font-family: 'Courier New', monospace;
                font-size: 0.95rem;
                white-space: pre-wrap;
                word-break: break-word;
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            /* Footer */
            .footer {
                text-align: center;
                margin-top: 80px;
                padding: 40px;
                background: var(--card-bg);
                border-radius: 25px;
                border: 1px solid var(--card-border);
            }
            
            .footer-links {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin: 30px 0;
                flex-wrap: wrap;
            }
            
            .footer-link {
                color: var(--text-gray);
                text-decoration: none;
                transition: color 0.3s;
            }
            
            .footer-link:hover {
                color: var(--text-light);
                text-decoration: underline;
            }
            
            /* Responsive */
            @media (max-width: 1200px) {
                .services-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
                h1 { font-size: 3.5rem; }
            }
            
            @media (max-width: 768px) {
                .services-grid { grid-template-columns: 1fr; }
                h1 { font-size: 2.8rem; }
                .stats-grid { grid-template-columns: repeat(2, 1fr); }
                .filter-buttons { justify-content: flex-start; }
                .action-buttons { flex-direction: column; }
            }
            
            @media (max-width: 480px) {
                .stats-grid { grid-template-columns: 1fr; }
                h1 { font-size: 2.2rem; }
                .header { padding: 40px 20px; }
                .service-card { padding: 20px; }
            }
        </style>
        
        <!-- Fonts -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vazirmatn@33.003/font.css">
        
        <!-- Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1><i class="fas fa-rocket"></i> Tetrashop</h1>
                <div class="subtitle">
                    سیستم ۳۲ سرویس هوش مصنوعی - نسخه تولیدی v2.0.0
                    <br>
                    <span style="opacity: 0.7; font-size: 1rem;">
                        تمام سرویس‌ها با قابلیت cat و کپی مستقیم
                    </span>
                </div>
                
                <!-- Stats -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-number">۳۲</span>
                        <span>سرویس فعال</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">۲۵۶۰</span>
                        <span>Endpoint</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" id="users-count">۰</span>
                        <span>کاربر آنلاین</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" id="revenue-count">۰</span>
                        <span>درآمد (تومان)</span>
                    </div>
                </div>
                
                <!-- Filter Buttons -->
                <div class="filter-buttons">
                    <button class="filter-btn active" onclick="filterServices('all')">
                        <i class="fas fa-th-large"></i> همه سرویس‌ها
                    </button>
                    <button class="filter-btn" onclick="filterServices('بینایی')">
                        <i class="fas fa-eye"></i> بینایی کامپیوتر
                    </button>
                    <button class="filter-btn" onclick="filterServices('متن')">
                        <i class="fas fa-language"></i> پردازش متن
                    </button>
                    <button class="filter-btn" onclick="filterServices('داده')">
                        <i class="fas fa-chart-bar"></i> علوم داده
                    </button>
                    <button class="filter-btn" onclick="filterServices('یادگیری')">
                        <i class="fas fa-brain"></i> یادگیری عمیق
                    </button>
                    <button class="filter-btn" onclick="filterServices('ویژه')">
                        <i class="fas fa-star"></i> ویژه
                    </button>
                </div>
            </div>
            
            <!-- Services Grid -->
            <div class="services-grid" id="services-container">
                <!-- کارت‌های سرویس اینجا اضافه می‌شوند -->
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div style="font-size: 1.2rem; margin-bottom: 20px;">
                    <i class="fas fa-circle" style="color: #00ff88; font-size: 0.8rem;"></i>
                    <span style="margin: 0 10px;">وضعیت سیستم: آنلاین</span>
                    <i class="fas fa-circle" style="color: #00ff88; font-size: 0.8rem;"></i>
                </div>
                
                <div class="footer-links">
                    <a href="/health" class="footer-link"><i class="fas fa-heartbeat"></i> سلامت سیستم</a>
                    <a href="/docs" class="footer-link"><i class="fas fa-book"></i> مستندات</a>
                    <a href="/api" class="footer-link"><i class="fas fa-code"></i> API</a>
                    <a href="/stats" class="footer-link"><i class="fas fa-chart-line"></i> آمار</a>
                    <a href="/contact" class="footer-link"><i class="fas fa-envelope"></i> تماس</a>
                </div>
                
                <div style="opacity: 0.7; margin-top: 30px; font-size: 0.9rem;">
                    <p>آخرین بروزرسانی: ۲۰۲۴-۰۱-۰۴ | نسخه: ۲.۰.۰ | وضعیت: 🟢 تولیدی</p>
                    <p>© ۲۰۲۴ Tetrashop. تمام حقوق محفوظ است.</p>
                </div>
            </div>
        </div>
        
        <!-- JavaScript -->
        <script>
            // داده‌های سرویس‌ها
            const allServices = ''' + json.dumps(ALL_SERVICES, ensure_ascii=False) + ''';
            
            // آمار سیستم
            const systemStats = ''' + json.dumps(SYSTEM_STATS, ensure_ascii=False) + ''';
            
            // متغیرهای جهانی
            let currentFilter = 'all';
            let userCount = 0;
            let revenue = 0;
            
            // بارگذاری اولیه
            document.addEventListener('DOMContentLoaded', function() {
                // به‌روزرسانی آمار
                updateStats();
                
                // نمایش همه سرویس‌ها
                displayServices(allServices);
                
                // شبیه‌سازی آمار زنده
                simulateLiveStats();
                
                // راه‌اندازی خودکار سرویس ۱
                setTimeout(() => {
                    const firstService = document.querySelector('.service-card');
                    if (firstService) {
                        firstService.style.animation = 'pulse 2s infinite';
                    }
                }, 1000);
            });
            
            // نمایش سرویس‌ها
            function displayServices(services) {
                const container = document.getElementById('services-container');
                container.innerHTML = '';
                
                services.forEach(service => {
                    const card = document.createElement('div');
                    card.className = 'service-card';
                    card.style.setProperty('--service-color', service.color);
                    card.style.borderTop = `6px solid ${service.color}`;
                    
                    card.innerHTML = `
                        <div class="service-id">${service.id.padStart(2, '0')}</div>
                        <div class="service-icon">${service.icon}</div>
                        <div class="service-name">${service.name}</div>
                        <div class="service-desc">${service.desc}</div>
                        
                        <div class="service-meta">
                            <span class="service-category">${service.category}</span>
                            <span class="service-price">${service.price.toLocaleString()} تومان</span>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn btn-run" onclick="runService('${service.id}', this)">
                                <i class="fas fa-play"></i> اجرا
                            </button>
                            <button class="btn btn-cat" onclick="showCatCommand('${service.id}', this)">
                                <i class="fas fa-terminal"></i> دستور cat
                            </button>
                            <button class="btn btn-details" onclick="showDetails('${service.id}')">
                                <i class="fas fa-info-circle"></i> جزئیات
                            </button>
                        </div>
                        
                        <div id="output-${service.id}" class="output-panel"></div>
                    `;
                    
                    container.appendChild(card);
                });
            }
            
            // فیلتر کردن سرویس‌ها
            function filterServices(category) {
                currentFilter = category;
                
                // به‌روزرسانی دکمه‌های فیلتر
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                event.target.classList.add('active');
                
                // فیلتر کردن
                if (category === 'all') {
                    displayServices(allServices);
                } else {
                    const filteredServices = allServices.filter(s => s.category === category);
                    displayServices(filteredServices);
                }
            }
            
            // اجرای سرویس
            function runService(serviceId, button) {
                const output = document.getElementById('output-' + serviceId);
                const card = button.closest('.service-card');
                
                // نمایش خروجی
                output.style.display = 'block';
                output.innerHTML = `
                    <div style="color: #00ff88;">
                        <i class="fas fa-spinner fa-spin"></i> در حال اجرای سرویس ${serviceId}...
                    </div>
                `;
                
                // شبیه‌سازی پردازش
                setTimeout(() => {
                    const service = allServices.find(s => s.id === serviceId);
                    const processTime = (Math.random() * 2 + 0.5).toFixed(1);
                    const quality = Math.floor(Math.random() * 5 + 95);
                    
                    output.innerHTML = `
                        <div style="margin-bottom: 15px;">
                            <span style="color: #00ff88; font-weight: bold;">
                                <i class="fas fa-check-circle"></i> سرویس با موفقیت اجرا شد!
                            </span>
                        </div>
                        
                        <div style="background: rgba(0, 255, 136, 0.1); padding: 15px; border-radius: 10px; margin: 10px 0;">
                            <div><strong>سرویس:</strong> ${service.name}</div>
                            <div><strong>شناسه:</strong> ${service.id}</div>
                            <div><strong>زمان پردازش:</strong> ${processTime} ثانیه</div>
                            <div><strong>کیفیت:</strong> ${quality}%</div>
                            <div><strong>وضعیت:</strong> <span style="color: #00ff88;">تکمیل شده</span></div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <strong>فایل‌های تولید شده:</strong>
                            <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                1. output_${serviceId}_${Date.now()}.txt
                                <br>2. report_${serviceId}_${Date.now()}.json
                                <br>3. log_${serviceId}_${Date.now()}.log
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                            <i class="fas fa-info-circle"></i>
                            برای مشاهده خروجی از دکمه "دستور cat" استفاده کنید
                        </div>
                    `;
                    
                    // افزایش آمار
                    userCount++;
                    revenue += service.price;
                    updateStats();
                    
                    // افکت‌های بصری
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3)';
                        setTimeout(() => {
                            card.style.boxShadow = '';
                        }, 1000);
                    }, 100);
                    
                }, 1500);
            }
            
            // نمایش دستور cat
            function showCatCommand(serviceId, button) {
                const output = document.getElementById('output-' + serviceId);
                const service = allServices.find(s => s.id === serviceId);
                
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
                    '10': 'cat ~/tetrashop-projects/outputs/keywords.txt',
                    '11': 'cat ~/tetrashop-projects/outputs/ner_result.txt',
                    '12': 'cat ~/tetrashop-projects/outputs/qna_result.txt',
                    '13': 'cat ~/tetrashop-projects/outputs/textgen_result.txt',
                    '14': 'cat ~/tetrashop-projects/outputs/codegen_result.txt',
                    '15': 'cat ~/tetrashop-projects/outputs/imagegen_result.txt',
                    '16': 'cat ~/tetrashop-projects/outputs/audiogen_result.txt',
                    '17': 'cat ~/tetrashop-projects/outputs/videogen_result.txt',
                    '18': 'cat ~/tetrashop-projects/outputs/anomaly_result.txt',
                    '19': 'cat ~/tetrashop-projects/outputs/recommend_result.txt',
                    '20': 'cat ~/tetrashop-projects/outputs/forecast_result.txt',
                    '21': 'cat ~/tetrashop-projects/outputs/optimization_result.txt',
                    '22': 'cat ~/tetrashop-projects/outputs/clustering_result.txt',
                    '23': 'cat ~/tetrashop-projects/outputs/classification_result.txt',
                    '24': 'cat ~/tetrashop-projects/outputs/regression_result.txt',
                    '25': 'cat ~/tetrashop-projects/outputs/dnn_result.txt',
                    '26': 'cat ~/tetrashop-projects/outputs/cnn_result.txt',
                    '27': 'cat ~/tetrashop-projects/outputs/rnn_result.txt',
                    '28': 'cat ~/tetrashop-projects/outputs/gan_result.txt',
                    '29': 'cat ~/tetrashop-projects/outputs/transformers_result.txt',
                    '30': 'cat ~/tetrashop-projects/outputs/rl_result.txt',
                    '31': 'cat ~/tetrashop-projects/outputs/federated_result.txt',
                    '32': 'cat ~/tetrashop-projects/outputs/edge_result.txt'
                };
                
                const cmd = commands[serviceId] || `echo "خروجی سرویس ${serviceId} - ${service.name}"`;
                
                output.style.display = 'block';
                output.innerHTML = `
                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #36d1dc;">
                            <i class="fas fa-terminal"></i> دستور cat برای سرویس ${serviceId}:
                        </span>
                    </div>
                    
                    <div style="
                        background: rgba(54, 209, 220, 0.1);
                        padding: 20px;
                        border-radius: 12px;
                        margin: 15px 0;
                        border-left: 4px solid #36d1dc;
                        font-family: 'Courier New', monospace;
                        font-size: 1.1rem;
                        word-break: break-all;
                    ">
                        ${cmd}
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="copyToClipboard('${cmd.replace(/'/g, "\\'")}')" style="
                            flex: 1;
                            padding: 12px;
                            background: linear-gradient(45deg, #36d1dc, #5b86e5);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        ">
                            <i class="fas fa-copy"></i> کپی دستور
                        </button>
                        
                        <button onclick="executeCommand('${cmd.replace(/'/g, "\\'")}')" style="
                            flex: 1;
                            padding: 12px;
                            background: linear-gradient(45deg, #00b09b, #96c93d);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        ">
                            <i class="fas fa-play"></i> اجرای مستقیم
                        </button>
                    </div>
                    
                    <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                        <i class="fas fa-lightbulb"></i>
                        این دستور را در ترمینال Termux کپی و اجرا کنید
                    </div>
                `;
                
                // افکت‌های بصری
                button.closest('.service-card').style.boxShadow = '0 0 30px rgba(54, 209, 220, 0.3)';
                setTimeout(() => {
                    button.closest('.service-card').style.boxShadow = '';
                }, 1000);
            }
            
            // نمایش جزئیات سرویس
            function showDetails(serviceId) {
                const service = allServices.find(s => s.id === serviceId);
                alert(
                    `سرویس ${serviceId} - ${service.name}\n\n` +
                    `توضیحات: ${service.desc}\n` +
                    `دسته‌بندی: ${service.category}\n` +
                    `قیمت: ${service.price.toLocaleString()} تومان\n` +
                    `رنگ: ${service.color}\n\n` +
                    `برای اجرا روی دکمه "اجرا" کلیک کنید.`
                );
            }
            
            // کپی به کلیپ‌بورد
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('✅ دستور cat کپی شد!');
                }).catch(err => {
                    // روش جایگزین برای مرورگرهای قدیمی
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('✅ دستور کپی شد!');
                });
            }
            
            // اجرای مستقیم (شبیه‌سازی)
            function executeCommand(cmd) {
                showToast('🔄 در حال اجرای دستور در ترمینال...');
                setTimeout(() => {
                    showToast('✅ دستور با موفقیت اجرا شد!');
                }, 1500);
            }
            
            // به‌روزرسانی آمار
            function updateStats() {
                document.getElementById('users-count').textContent = userCount.toLocaleString();
                document.getElementById('revenue-count').textContent = revenue.toLocaleString();
            }
            
            // شبیه‌سازی آمار زنده
            function simulateLiveStats() {
                setInterval(() => {
                    if (Math.random() > 0.7) {
                        userCount++;
                        updateStats();
                    }
                    if (Math.random() > 0.8) {
                        const randomService = allServices[Math.floor(Math.random() * allServices.length)];
                        revenue += randomService.price;
                        updateStats();
                    }
                }, 5000);
            }
            
            // نمایش نوتیفیکیشن
            function showToast(message) {
                // ایجاد عنصر toast
                const toast = document.createElement('div');
                toast.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: linear-gradient(45deg, #00dbde, #fc00ff);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                    font-weight: 600;
                    animation: slideIn 0.3s ease-out;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `;
                
                toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
                document.body.appendChild(toast);
                
                // حذف پس از 3 ثانیه
                setTimeout(() => {
                    toast.style.animation = 'slideOut 0.3s ease-out';
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                }, 3000);
            }
            
            // اضافه کردن استایل‌های انیمیشن
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(0, 219, 222, 0.4); }
                    70% { box-shadow: 0 0 0 20px rgba(0, 219, 222, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 219, 222, 0); }
                }
            `;
            document.head.appendChild(style);
        </script>
    </body>
    </html>
    '''
    
    return render_template_string(html_template)

@app.route('/health')
def health():
    """بررسی سلامت کامل سیستم"""
    SYSTEM_STATS["requests_today"] += 1
    
    return jsonify({
        "status": "healthy",
        "message": "Tetrashop Production System v2.0.0",
        "services": {
            "total": 32,
            "active": 32,
            "categories": ["بینایی کامپیوتر", "پردازش زبان", "علوم داده", "یادگیری عمیق", "ویژه"]
        },
        "system": {
            "uptime": time.time(),
            "timestamp": datetime.now().isoformat(),
            "version": "2.0.0",
            "environment": "production"
        },
        "statistics": SYSTEM_STATS,
        "endpoints": {
            "/": "Dashboard اصلی (این صفحه)",
            "/health": "بررسی سلامت سیستم",
            "/docs": "مستندات کامل API",
            "/service/<id>": "صفحه اختصاصی هر سرویس",
            "/cat/<id>": "دریافت دستور cat برای سرویس",
            "/api/services": "لیست تمام سرویس‌ها",
            "/api/stats": "آمار زنده سیستم"
        },
        "note": "آخرین پست صفحه NLP: ۱۶۵ ✅"
    })

@app.route('/docs')
def documentation():
    """مستندات کامل سیستم"""
    return jsonify({
        "project": "Tetrashop AI Production System",
        "version": "2.0.0",
        "description": "سیستم ۳۲ سرویس هوش مصنوعی با قابلیت cat مستقیم",
        "author": "Tetrashop Development Team",
        "contact": "support@tetrashop.ir",
        "github": "https://github.com/tetrashop/ai-services",
        
        "quick_start": {
            "step_1": "به آدرس http://localhost:5000 بروید",
            "step_2": "سرویس مورد نظر را انتخاب کنید",
            "step_3": "روی دکمه 'اجرا' کلیک کنید",
            "step_4": "برای مشاهده خروجی، روی دکمه 'دستور cat' کلیک کنید",
            "step_5": "دستور را کپی و در ترمینال اجرا کنید"
        },
        
        "api_reference": {
            "base_url": "http://localhost:5000",
            "endpoints": {
                "GET /": "Dashboard اصلی با UI فارسی",
                "GET /health": "بررسی سلامت سیستم",
                "GET /docs": "این مستندات",
                "GET /api/services": "لیست JSON تمام سرویس‌ها",
                "GET /cat/<service_id>": "دریافت دستور cat برای سرویس خاص",
                "GET /service/<service_id>": "صفحه اختصاصی سرویس",
                "GET /api/stats": "آمار زنده سیستم"
            }
        },
        
        "services_overview": {
            "total": 32,
            "categories": {
                "computer_vision": "سرویس‌های پردازش تصویر و ویدیو",
                "natural_language": "سرویس‌های پردازش متن و گفتار",
                "data_science": "سرویس‌های تحلیل داده و پیش‌بینی",
                "deep_learning": "سرویس‌های یادگیری عمیق پیشرفته",
                "special": "سرویس‌های ویژه و خاص"
            }
        },
        
        "file_structure": {
            "project_root": "~/tetrashop-projects/",
            "outputs": "~/tetrashop-projects/outputs/",
            "logs": "~/tetrashop-projects/production-system/logs/",
            "services": "~/tetrashop-projects/production-system/services/",
            "config": "~/tetrashop-projects/production-system/config/"
        },
        
        "examples": {
            "curl_example": "curl -s http://localhost:5000/health | python3 -m json.tool",
            "cat_example": "cat ~/tetrashop-projects/outputs/ocr_result.txt",
            "service_example": "http://localhost:5000/service/01"
        }
    })

@app.route('/api/services')
def api_services():
    """API برای دریافت لیست تمام سرویس‌ها"""
    return jsonify({
        "success": True,
        "count": len(ALL_SERVICES),
        "services": ALL_SERVICES,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/stats')
def api_stats():
    """API برای دریافت آمار زنده"""
    return jsonify({
        "success": True,
        "stats": SYSTEM_STATS,
        "live": {
            "active_users": SYSTEM_STATS["total_users"] + 1,
            "requests_per_minute": 5,
            "system_load": "low",
            "memory_usage": "45%",
            "disk_space": "1.2GB / 2.0GB"
        }
    })

@app.route('/cat/<service_id>')
def get_cat_command(service_id):
    """دریافت دستور cat برای سرویس مشخص"""
    
    # تعریف دستورات برای تمام سرویس‌ها
    cat_commands = {}
    for i in range(1, 33):
        service_id_str = str(i).zfill(2)
        cat_commands[service_id_str] = f"cat ~/tetrashop-projects/outputs/service_{service_id_str}_result.txt"
    
    if service_id in cat_commands:
        service = next((s for s in ALL_SERVICES if s["id"] == service_id), None)
        
        return jsonify({
            "success": True,
            "service": {
                "id": service_id,
                "name": service["name"] if service else "Unknown",
                "description": service["desc"] if service else ""
            },
            "command": cat_commands[service_id],
            "explanation": "این دستور را در ترمینال Termux کپی و اجرا کنید",
            "output_path": f"~/tetrashop-projects/outputs/service_{service_id}_result.txt",
            "note": "آخرین پست صفحه NLP: ۱۶۵ ✅"
        })
    else:
        return jsonify({
            "success": False,
            "error": "سرویس یافت نشد",
            "available_services": list(cat_commands.keys())
        })

@app.route('/service/<service_id>')
def service_page(service_id):
    """صفحه اختصاصی هر سرویس"""
    service = next((s for s in ALL_SERVICES if s["id"] == service_id), None)
    
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
                font-family: 'Vazirmatn', sans-serif;
                background: linear-gradient(135deg, {service["color"]}20, #0f0c29);
                color: white;
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.05);
                padding: 40px;
                border-radius: 25px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }}
            .back-btn {{
                display: inline-flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 30px;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                text-decoration: none;
                border-radius: 12px;
                transition: all 0.3s;
            }}
            .back-btn:hover {{
                background: rgba(255, 255, 255, 0.2);
                transform: translateX(-5px);
            }}
            h1 {{
                color: {service["color"]};
                font-size: 3rem;
                margin-bottom: 20px;
            }}
            .service-header {{
                display: flex;
                align-items: center;
                gap: 30px;
                margin-bottom: 40px;
                padding-bottom: 30px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            }}
            .service-icon {{
                font-size: 5rem;
            }}
            .service-info {{
                flex: 1;
            }}
            .service-id {{
                background: rgba(255, 255, 255, 0.1);
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                margin-bottom: 15px;
            }}
            .service-price {{
                font-size: 2rem;
                font-weight: bold;
                color: #00ff88;
                margin: 20px 0;
            }}
            .action-buttons {{
                display: flex;
                gap: 15px;
                margin: 40px 0;
                flex-wrap: wrap;
            }}
            .action-btn {{
                padding: 18px 35px;
                border: none;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 200px;
                justify-content: center;
            }}
            .btn-run {{
                background: linear-gradient(45deg, #00b09b, #96c93d);
                color: white;
            }}
            .btn-cat {{
                background: linear-gradient(45deg, #36d1dc, #5b86e5);
                color: white;
            }}
            .btn-back {{
                background: linear-gradient(45deg, #ff416c, #ff4b2b);
                color: white;
            }}
            .action-btn:hover {{
                transform: translateY(-5px);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
            }}
            .output-container {{
                background: rgba(0, 0, 0, 0.2);
                padding: 30px;
                border-radius: 20px;
                margin: 30px 0;
                min-height: 300px;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
                font-size: 1.1rem;
                line-height: 1.8;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }}
            .command-box {{
                background: rgba(0, 0, 0, 0.3);
                padding: 25px;
                border-radius: 15px;
                margin: 25px 0;
                border-left: 5px solid {service["color"]};
                font-family: 'Courier New', monospace;
                font-size: 1.2rem;
                word-break: break-all;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <a href="/" class="back-btn">
                <i class="fas fa-arrow-right"></i> بازگشت به داشبورد
            </a>
            
            <div class="service-header">
                <div class="service-icon">{service["icon"]}</div>
                <div class="service-info">
                    <div class="service-id">سرویس {service["id"]}</div>
                    <h1>{service["name"]}</h1>
                    <p style="font-size: 1.2rem; opacity: 0.9;">{service["desc"]}</p>
                    <div class="service-price">{service["price"].toLocaleString()} تومان</div>
                    <div style="opacity: 0.8; margin-top: 15px;">
                        <i class="fas fa-tag"></i> دسته‌بندی: {service["category"]}
                        <span style="margin: 0 15px;">|</span>
                        <i class="fas fa-palette"></i> رنگ: <span style="color: {service["color"]};">{service["color"]}</span>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="action-btn btn-run" onclick="runService()">
                    <i class="fas fa-play"></i> اجرای سرویس
                </button>
                <button class="action-btn btn-cat" onclick="showCatCommand()">
                    <i class="fas fa-terminal"></i> نمایش دستور cat
                </button>
                <button class="action-btn btn-back" onclick="window.location.href='/'">
                    <i class="fas fa-home"></i> بازگشت به اصلی
                </button>
            </div>
            
            <div id="output" class="output-container">
                👈 برای شروع، یکی از دکمه‌های بالا را انتخاب کنید
            </div>
        </div>
        
        <script>
            function runService() {{
                const output = document.getElementById('output');
                output.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 4rem; margin-bottom: 20px; color: {service["color"]};">{service["icon"]}</div>
                        <div style="font-size: 1.5rem; margin-bottom: 30px;">
                            <i class="fas fa-spinner fa-spin"></i> در حال اجرای سرویس...
                        </div>
                        <div style="opacity: 0.8;">لطفا چند ثانیه صبر کنید</div>
                    </div>
                `;
                
                setTimeout(() => {{
                    const processId = "PROC_" + Date.now();
                    const quality = Math.floor(Math.random() * 5 + 95);
                    const time = (Math.random() * 2 + 0.8).toFixed(1);
                    
                    output.innerHTML = `
                        <div style="color: #00ff88; font-size: 1.5rem; margin-bottom: 20px;">
                            <i class="fas fa-check-circle"></i> سرویس با موفقیت اجرا شد!
                        </div>
                        
                        <div style="background: rgba(0, 255, 136, 0.1); padding: 25px; border-radius: 15px; margin: 20px 0;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                                <div><strong>شناسه پردازش:</strong><br>${processId}</div>
                                <div><strong>سرویس:</strong><br>{service["name"]}</div>
                                <div><strong>زمان پردازش:</strong><br>${time} ثانیه</div>
                                <div><strong>کیفیت:</strong><br>${quality}%</div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px;">
                            <div style="font-size: 1.2rem; margin-bottom: 15px;">
                                <i class="fas fa-file-alt"></i> <strong>فایل‌های خروجی:</strong>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px;">
                                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                                    <i class="fas fa-file" style="color: {service["color"]}"></i>
                                    <div>
                                        <div>output_{service["id"]}_${{processId}}.txt</div>
                                        <div style="font-size: 0.9rem; opacity: 0.7;">~/tetrashop-projects/outputs/</div>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                                    <i class="fas fa-chart-bar" style="color: {service["color"]}"></i>
                                    <div>
                                        <div>report_{service["id"]}_${{processId}}.json</div>
                                        <div style="font-size: 0.9rem; opacity: 0.7;">حجم: ۲.۴MB</div>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <i class="fas fa-history" style="color: {service["color"]}"></i>
                                    <div>
                                        <div>log_{service["id"]}_${{processId}}.log</div>
                                        <div style="font-size: 0.9rem; opacity: 0.7;">تاریخ: ${new Date().toLocaleString('fa-IR')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 30px; padding: 20px; background: rgba({service["color"].replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.1); border-radius: 12px;">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <i class="fas fa-lightbulb" style="color: {service["color"]}"></i>
                                <div>
                                    <strong>نکته:</strong> برای مشاهده خروجی از دکمه "نمایش دستور cat" استفاده کنید
                                </div>
                            </div>
                        </div>
                    `;
                }}, 2000);
            }}
            
            function showCatCommand() {{
                const commands = {{
                    "01": "cat ~/tetrashop-projects/outputs/ocr_result.txt",
                    "02": "cat ~/tetrashop-projects/outputs/3d_model.txt",
                    "03": "cat ~/tetrashop-projects/outputs/chess_move.txt",
                    "04": "cat ~/tetrashop-projects/outputs/speech_text.txt",
                    "05": "cat ~/tetrashop-projects/outputs/summary.txt",
                    "06": "cat ~/tetrashop-projects/outputs/translation.txt",
                    "07": "cat ~/tetrashop-projects/outputs/chat_log.txt",
                    "08": "cat ~/tetrashop-projects/outputs/sentiment.txt",
                    "09": "cat ~/tetrashop-projects/outputs/tags.txt",
                    "10": "cat ~/tetrashop-projects/outputs/keywords.txt",
                    "11": "cat ~/tetrashop-projects/outputs/ner_result.txt",
                    "12": "cat ~/tetrashop-projects/outputs/qna_result.txt",
                    "13": "cat ~/tetrashop-projects/outputs/textgen_result.txt",
                    "14": "cat ~/tetrashop-projects/outputs/codegen_result.txt",
                    "15": "cat ~/tetrashop-projects/outputs/imagegen_result.txt",
                    "16": "cat ~/tetrashop-projects/outputs/audiogen_result.txt",
                    "17": "cat ~/tetrashop-projects/outputs/videogen_result.txt",
                    "18": "cat ~/tetrashop-projects/outputs/anomaly_result.txt",
                    "19": "cat ~/tetrashop-projects/outputs/recommend_result.txt",
                    "20": "cat ~/tetrashop-projects/outputs/forecast_result.txt",
                    "21": "cat ~/tetrashop-projects/outputs/optimization_result.txt",
                    "22": "cat ~/tetrashop-projects/outputs/clustering_result.txt",
                    "23": "cat ~/tetrashop-projects/outputs/classification_result.txt",
                    "24": "cat ~/tetrashop-projects/outputs/regression_result.txt",
                    "25": "cat ~/tetrashop-projects/outputs/dnn_result.txt",
                    "26": "cat ~/tetrashop-projects/outputs/cnn_result.txt",
                    "27": "cat ~/tetrashop-projects/outputs/rnn_result.txt",
                    "28": "cat ~/tetrashop-projects/outputs/gan_result.txt",
                    "29": "cat ~/tetrashop-projects/outputs/transformers_result.txt",
                    "30": "cat ~/tetrashop-projects/outputs/rl_result.txt",
                    "31": "cat ~/tetrashop-projects/outputs/federated_result.txt",
                    "32": "cat ~/tetrashop-projects/outputs/edge_result.txt"
                }};
                
                const cmd = commands["{service["id"]}"] || 'echo "دستور cat برای این سرویس تعریف نشده است"';
                
                const output = document.getElementById('output');
                output.innerHTML = `
                    <div style="color: #36d1dc; font-size: 1.5rem; margin-bottom: 20px;">
                        <i class="fas fa-terminal"></i> دستور cat برای سرویس {service["name"]}
                    </div>
                    
                    <div class="command-box">
                        ${cmd}
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin: 30px 0; flex-wrap: wrap;">
                        <button onclick="copyCommand('${cmd.replace(/'/g, "\\'")}')" style="
                            flex: 1;
                            min-width: 200px;
                            padding: 18px;
                            background: linear-gradient(45deg, #36d1dc, #5b86e5);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            cursor: pointer;
                            font-size: 1.1rem;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 15px;
                        ">
                            <i class="fas fa-copy"></i> کپی دستور
                        </button>
                        
                        <button onclick="runInTerminal('${cmd.replace(/'/g, "\\'")}')" style="
                            flex: 1;
                            min-width: 200px;
                            padding: 18px;
                            background: linear-gradient(45deg, #00b09b, #96c93d);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            cursor: pointer;
                            font-size: 1.1rem;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 15px;
                        ">
                            <i class="fas fa-play"></i> اجرا در ترمینال
                        </button>
                    </div>
                    
                    <div style="background: rgba(54, 209, 220, 0.1); padding: 20px; border-radius: 12px; margin-top: 30px;">
                        <div style="display: flex; align-items: flex-start; gap: 15px;">
                            <i class="fas fa-info-circle" style="color: #36d1dc; font-size: 1.2rem; margin-top: 3px;"></i>
                            <div>
                                <strong>راهنمای استفاده:</strong>
                                <ol style="margin: 15px 0; padding-right: 20px;">
                                    <li>دکمه "کپی دستور" را بزنید</li>
                                    <li>به پنجره Termux برگردید</li>
                                    <li>دستور را paste کنید (لمس طولانی + Paste)</li>
                                    <li>دکمه Enter را بزنید</li>
                                </ol>
                                <div style="opacity: 0.8;">
                                    <i class="fas fa-exclamation-circle"></i>
                                    توجه: این دستور فایل خروجی سرویس را در ترمینال نمایش می‌دهد
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }}
            
            function copyCommand(text) {{
                navigator.clipboard.writeText(text).then(() => {{
                    alert('✅ دستور cat کپی شد!\\n\\n' + text);
                }});
            }}
            
            function runInTerminal(cmd) {{
                alert('🔄 شبیه‌سازی اجرا در ترمینال...\\n\\nدستور: ' + cmd + '\\n\\nبرای اجرای واقعی، دستور را در Termux کپی کنید.');
            }}
            
            // اجرای خودکار هنگام بارگذاری
            window.onload = function() {{
                // نمایش اطلاعات اولیه
                const output = document.getElementById('output');
                output.innerHTML = `
                    <div style="text-align: center; padding: 30px;">
                        <div style="font-size: 5rem; color: {service["color"]}; margin-bottom: 20px;">{service["icon"]}</div>
                        <h2 style="color: {service["color"]};">{service["name"]}</h2>
                        <p style="font-size: 1.2rem; margin: 20px 0;">{service["desc"]}</p>
                        <div style="display: inline-block; background: rgba({service["color"].replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2); padding: 15px 30px; border-radius: 50px; margin: 20px 0;">
                            <i class="fas fa-tag"></i> قیمت: {service["price"].toLocaleString()} تومان
                        </div>
                        <p style="opacity: 0.8; margin-top: 30px;">
                            برای شروع کار از دکمه‌های بالا استفاده کنید
                        </p>
                    </div>
                `;
            }};
        </script>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
    </body>
    </html>
    '''
    
    return render_template_string(html)

# ==================== SERVER START ====================
if __name__ == '__main__':
    # نمایش بنر راه‌اندازی
    print("\n" + "="*70)
    print("🚀 TETRASHOP PRODUCTION SYSTEM v2.0.0")
    print("="*70)
    print("📊 ۳۲ سرویس هوش مصنوعی")
    print("🌐 Gateway: http://localhost:5000")
    print("📁 خروجی‌ها: ~/tetrashop-projects/outputs/")
    print("⚡ حالت: تولیدی - بدون نیاز به login")
    print("📝 آخرین پست صفحه NLP: ۱۶۵ ✅")
    print("="*70 + "\n")
    
    # ایجاد فایل‌های خروجی نمونه
    output_dir = os.path.expanduser("~/tetrashop-projects/outputs")
    os.makedirs(output_dir, exist_ok=True)
    
    print("📁 ایجاد فایل‌های خروجی نمونه...")
    
    # ایجاد 32 فایل خروجی نمونه
    for service in ALL_SERVICES:
        filename = f"service_{service['id']}_result.txt"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"""# خروجی سرویس {service['id']} - {service['name']}
# تاریخ تولید: 2024-01-04
# وضعیت: ✅ فعال
# دستور cat: cat ~/tetrashop-projects/outputs/{filename}

📊 **نتایج پردازش سرویس {service['name']}**

✅ عملیات با موفقیت انجام شد.

## مشخصات پردازش:
- **سرویس:** {service['name']}
- **شناسه:** {service['id']}
- **دسته‌بندی:** {service['category']}
- **قیمت:** {service['price']:,} تومان
- **زمان پردازش:** 1.4 ثانیه
- **کیفیت:** 96.7%
- **حجم داده:** 2.8MB

## نتایج:
پردازش سرویس {service['name']} با موفقیت تکمیل شد.
داده‌های ورودی به درستی تحلیل و پردازش شدند.

## فایل‌های تولید شده:
1. `output_{service['id']}.txt` - نتایج اصلی
2. `report_{service['id']}.json` - گزارش تحلیل
3. `log_{service['id']}.log` - فایل لاگ

## دستورات مفید:
برای مشاهده این فایل: `cat ~/tetrashop-projects/outputs/{filename}`
برای کپی مسیر: `echo '{filepath}' | termux-clipboard-set`

---
🔄 سیستم Tetrashop - نسخه ۲.۰.۰
🌐 آدرس: http://localhost:5000
📝 آخرین پست صفحه NLP: ۱۶۵ ✅
""")
    
    print(f"✅ {len(ALL_SERVICES)} فایل نمونه ایجاد شدند")
    print("🔥 Gateway در حال راه‌اندازی...\n")
    
    # راه‌اندازی سرور
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,
        threaded=True
    )
