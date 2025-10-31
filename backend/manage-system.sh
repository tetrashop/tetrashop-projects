#!/bin/bash

case "$1" in
    "start")
        echo "🚀 راه‌اندازی سیستم ناطق..."
        cd backend
        node optimized-server.js &
        echo $! > ../backend.pid
        node ../static-server.js &
        echo $! > ../ui.pid
        echo "✅ سیستم راه‌اندازی شد"
        echo "🌐 API: http://localhost:3000"
        echo "🎨 UI:  http://localhost:8080/ui"
        ;;
    "stop")
        echo "🛑 توقف سیستم..."
        if [ -f backend.pid ]; then
            kill $(cat backend.pid) 2>/dev/null
            rm backend.pid
        fi
        if [ -f ui.pid ]; then
            kill $(cat ui.pid) 2>/dev/null
            rm ui.pid
        fi
        pkill -f "node.*server.js" 2>/dev/null
        echo "✅ سیستم متوقف شد"
        ;;
    "restart")
        echo "🔄 راه‌اندازی مجدد..."
        $0 stop
        sleep 2
        $0 start
        ;;
    "status")
        echo "📊 وضعیت سیستم:"
        if pgrep -f "optimized-server.js" > /dev/null; then
            echo "✅ Backend: فعال"
        else
            echo "❌ Backend: غیرفعال"
        fi
        if pgrep -f "static-server.js" > /dev/null; then
            echo "✅ UI Server: فعال"
        else
            echo "❌ UI Server: غیرفعال"
        fi
        ;;
    *)
        echo "استفاده: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
