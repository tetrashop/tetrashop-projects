#!/bin/bash

echo "🚀 راه‌اندازی Tetrashop v2.0.0"
echo "=============================="

# توقف سرویس‌های قبلی
pkill -f "python.*tetrashop" 2>/dev/null
pkill -f "python.*gateway" 2>/dev/null
sleep 2

# پاکسازی پورت
lsof -ti:5000 2>/dev/null | xargs kill -9 2>/dev/null

# رفتن به پوشه Gateway
cd ~/tetrashop-projects/gateway_final

# نصب وابستگی
echo "📦 بررسی Flask..."
python3 -c "import flask" 2>/dev/null || pip3 install flask > /dev/null 2>&1

# اجرا
echo "🔥 در حال راه‌اندازی Gateway..."
nohup python3 tetrashop_final.py > run.log 2>&1 &
PID=$!

echo "⏳ صبر 3 ثانیه..."
sleep 3

# تست
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Tetrashop با موفقیت راه‌اندازی شد!"
    echo "🌐 آدرس: http://localhost:5000"
    echo "📊 PID: $PID"
    echo ""
    echo "📱 برای باز کردن در مرورگر:"
    echo "   termux-open-url 'http://localhost:5000'"
    echo ""
    echo "📋 تست سریع:"
    echo "   curl -s http://localhost:5000/health | python3 -m json.tool"
else
    echo "❌ مشکل در راه‌اندازی"
    tail -20 run.log
fi
