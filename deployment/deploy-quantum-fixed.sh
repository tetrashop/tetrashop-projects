#!/bin/bash

echo "🚀 استقرار سیستم کوانتومی اصلاح شده..."
echo "📅 تاریخ: $(date)"
echo "🔧 نسخه: Quantum v2.1 (پایدار)"

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قدیمی..."
pkill -f "node.*server" 2>/dev/null
pkill -f "node.*quantum" 2>/dev/null
sleep 3

# بررسی وابستگی‌ها
echo "📦 بررسی وابستگی‌ها..."
if [ ! -d "node_modules" ]; then
    npm install --silent
fi

# راه‌اندازی سیستم اصلاح شده
echo "⚡ راه‌اندازی سیستم کوانتومی..."
node quantum-start-fixed.js &
QUANTUM_PID=$!
echo $QUANTUM_PID > .quantum.pid

# منتظر راه‌اندازی
sleep 8

# تست سلامت
echo "🧪 تست سلامت نهایی..."
if curl -s http://localhost:3003/quantum-health > /dev/null; then
    echo "✅ سیستم کوانتومی با موفقیت راه‌اندازی شد!"
    
    # نمایش اطلاعات سیستم
    echo ""
    echo "🎯 سیستم فعال با مشخصات زیر:"
    echo "   PID: $QUANTUM_PID"
    echo "   پورت: 3003" 
    echo "   حالت: کوانتومی"
    echo "   کارایی: حداکثر"
    echo "   خود-ترمیمی: فعال"
else
    echo "❌ خطا در راه‌اندازی سیستم"
    exit 1
fi

echo ""
echo "🌐 آدرس‌های دسترسی:"
echo "   API اصلی:    http://localhost:3003"
echo "   سلامت:       http://localhost:3003/quantum-health"
echo "   ناطق:        http://localhost:3003/api/v2/natiq/speak?text=سلام"
echo "   متریک‌ها:    http://localhost:3003/api/v2/system/metrics"

echo ""
echo "📝 لاگ استقرار: deployment/deploy.log"
echo "$(date): استقرار موفقیت‌آمیز نسخه 2.1" >> deployment/deploy.log

# نگهداری process
wait
