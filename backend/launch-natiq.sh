#!/bin/bash
cd ~/tetrashop-projects

echo "🚀 راه‌اندازی یکپارچه سیستم Natiq..."

# متوقف کردن سرویس‌های قبلی
pkill -f "node.*server.js" 2>/dev/null
pkill -f "npm.*run" 2>/dev/null
sleep 2

# راه‌اندازی backend
echo "🔧 راه‌اندازی Backend..."
cd ./natiq-app/backend
npm install --silent
node server.js &
BACKEND_PID=$!
echo "✅ Backend راه‌اندازی شد (PID: $BACKEND_PID)"

# راه‌اندازی frontend  
echo "🎨 راه‌اندازی Frontend..."
cd ../frontend
if [ -f "package.json" ]; then
    npm install --silent
    # بررسی نوع پروژه و راه‌اندازی مناسب
    if [ -f "next.config.js" ]; then
        npm run dev &
    else
        npm run serve -- --port 8080 &
    fi
    FRONTEND_PID=$!
    echo "✅ Frontend راه‌اندازی شد (PID: $FRONTEND_PID)"
else
    echo "⚠️ Frontend نیاز به تنظیمات خاص دارد"
fi

echo ""
echo "🎯 سیستم Natiq با موفقیت راه‌اندازی شد!"
echo "📊 Backend:  http://localhost:3000"
echo "🎨 Frontend: http://localhost:8080 (یا 3000)"
echo ""
echo "برای توقف سرویس‌ها: pkill -f 'node.*server.js' && pkill -f 'npm'"

# نگه داشتن اسکریپت فعال
wait
