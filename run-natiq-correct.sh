#!/bin/bash
cd ~/natiq-app

echo "🚀 راه‌اندازی صحیح سیستم Natiq..."

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "npm.*run" 2>/dev/null
sleep 3

# بررسی و نصب وابستگی‌های backend
echo "📦 راه‌اندازی Backend..."
cd backend
if [ -f "package.json" ]; then
    npm install --silent
else
    echo "❌ package.json در backend یافت نشد"
    exit 1
fi

# راه‌اندازی backend روی پورت 3001 (برای جلوگیری از conflict)
echo "🔧 شروع سرور backend..."
PORT=3001 node optimized-server.js &
BACKEND_PID=$!
echo "✅ Backend راه‌اندازی شد (PID: $BACKEND_PID) روی پورت 3001"

# برگشت به دایرکتوری اصلی و راه‌اندازی static server
cd ..
echo "🎨 راه‌اندازی رابط کاربری..."
node backend/static-server.js &
UI_PID=$!
echo "✅ UI Server راه‌اندازی شد (PID: $UI_PID) روی پورت 8080"

# منتظر بمان و وضعیت را چک کن
sleep 5

echo ""
echo "🎉 سیستم Natiq با موفقیت راه‌اندازی شد!"
echo "📊 Backend API:  http://localhost:3001"
echo "🎨 رابط کاربری: http://localhost:8080/ui"
echo "🩺 سلامت سیستم: http://localhost:3001/health"
echo ""
echo "برای توقف: pkill -f 'node.*server.js'"

# نگه داشتن اسکریپت فعال
wait
