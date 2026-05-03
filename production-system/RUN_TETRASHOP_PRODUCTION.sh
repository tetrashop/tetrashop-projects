#!/bin/bash

clear
echo "======================================================"
echo "🚀 TETRASHOP PRODUCTION SYSTEM - v2.0"
echo "سیستم تولیدی ۳۲ سرویس با درآمدزایی"
echo "======================================================"
echo ""

# بررسی Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 یافت نشد. لطفاً نصب کنید:"
    echo "   apt update && apt install python3 python3-pip"
    exit 1
fi

# بررسی pip
if ! command -v pip3 &> /dev/null; then
    echo "📦 نصب pip3..."
    apt install python3-pip -y
fi

# نصب وابستگی‌ها
echo "📦 نصب وابستگی‌های Python..."
pip3 install flask uuid

# ایجاد پوشه‌ها
echo "📁 ایجاد ساختار پوشه‌ها..."
mkdir -p logs outputs services config

# کپی کدها
echo "📋 کپی فایل‌های سیستم..."
cp -r gateway/ ./ 2>/dev/null || true
cp start-all-services.sh ./ 2>/dev/null || true

# اجرای سیستم
echo "🚀 راه‌اندازی سیستم..."
chmod +x start-all-services.sh
./start-all-services.sh

echo ""
echo "✅ سیستم آماده است!"
echo ""
echo "📋 دستورات مفید:"
echo "   مشاهده لاگ:          tail -f logs/gateway_console.log"
echo "   توقف سیستم:          pkill -f 'python.*app.py'"
echo "   مشاهده PIDها:        ps aux | grep python"
echo "   بررسی پورت‌ها:       netstat -tlnp | grep python"
echo ""
echo "📁 ساختار پروژه:"
echo "   gateway/            - Gateway مرکزی"
echo "   services/           - ۳۲ سرویس"
echo "   outputs/            - خروجی‌ها و دستورات"
echo "   logs/               - لاگ سیستم"
echo "   config/             - پیکربندی‌ها"
echo ""
