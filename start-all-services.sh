#!/bin/bash

echo "🚀 راه‌اندازی تمام 23 سرویس TetraSaaS"
echo "===================================="

# توقف سرویس‌های قبلی
echo "🛑 توقف سرویس‌های قبلی..."
./manage-services.sh stop
sleep 3

# ایجاد پوشه PID
PID_DIR="$HOME/tetra-pids"
mkdir -p "$PID_DIR"

# لیست تمام سرویس‌ها با پورت‌هایشان
SERVICES=(
    "quantum-writer:3001"
    "ai-writer:3002"
    "secret-garden:3003"
    "3d-converter:3004"
    "2d-to-3d:3005"
    "content-analyzer:3006"
    "anti-fragmentation:3007"
    "formula-solver:3008"
    "code-cleaner:3009"
    "graphic-2d:3010"
    "anti-smoke:3011"
    "telescope-design:3012"
    "teleport-system:3013"
    "image-processor:3014"
    "audio-converter:3015"
    "video-editor:3016"
    "data-encryptor:3017"
    "network-scanner:3018"
    "battery-optimizer:3019"
    "file-organizer:3020"
    "password-generator:3021"
    "system-monitor:3022"
    "backup-manager:3023"
)

# راه‌اندازی میکروسرویس‌ها
echo "🔧 راه‌اندازی 23 میکروسرویس..."
count=0
for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r name port <<< "$service_info"
    
    echo "   📦 راه‌اندازی $name (پورت: $port)..."
    
    # بررسی آیا پورت آزاد است
    if netstat -tuln 2>/dev/null | grep ":$port " >/dev/null; then
        echo "   ⚠️  پورت $port در حال استفاده است - رد شدن"
        continue
    fi
    
    # رفتن به پوشه سرویس
    cd "tetra-saas-platform/microservices/$name" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "   ❌ پوشه $name پیدا نشد"
        cd - > /dev/null
        continue
    fi
    
    # راه‌اندازی سرویس
    python app.py >/dev/null 2>&1 &
    pid=$!
    
    # ذخیره PID
    echo $pid > "$PID_DIR/tetra_$name.pid"
    echo "   ✅ $name راه‌اندازی شد (PID: $pid)"
    
    ((count++))
    
    # کمی تاخیر بین راه‌اندازی سرویس‌ها
    sleep 1
    
    cd - > /dev/null
done

# راه‌اندازی API Gateway
echo "🌉 راه‌اندازی API Gateway..."
cd tetra-saas-platform/api-gateway

# بررسی پورت 8080
if netstat -tuln 2>/dev/null | grep ":8080 " >/dev/null; then
    echo "   ⚠️  پورت 8080 در حال استفاده است - متوقف کردن فرآیند قبلی"
    pkill -f "node server-simple.js" 2>/dev/null
    sleep 2
fi

# راه‌اندازی Gateway
node server-simple.js >/dev/null 2>&1 &
GATEWAY_PID=$!
echo $GATEWAY_PID > "$PID_DIR/tetra_gateway.pid"
echo "   ✅ API Gateway راه‌اندازی شد (PID: $GATEWAY_PID)"

cd - > /dev/null

# منتظر بمان تا سرویس‌ها کاملاً راه‌اندازی شوند
echo "⏳ منتظر بمانید تا سرویس‌ها کاملاً راه‌اندازی شوند..."
sleep 5

# نمایش اطلاعات
echo ""
echo "=========================================="
echo "🎉 پلتفرم TetraSaaS راه‌اندازی شد!"
echo "=========================================="
echo ""
echo "📊 آمار:"
echo "   • $count از 23 سرویس راه‌اندازی شدند"
echo "   • API Gateway فعال است"
echo ""
echo "📡 آدرس‌های مهم:"
echo "   • API Gateway:  http://localhost:8080"
echo "   • پنل مدیریت:   http://localhost:8080"
echo ""
echo "🧪 تست سریع:"
echo "   curl http://localhost:8080/health"
echo "   curl http://localhost:3008/health"
echo ""
echo "🛠️  مدیریت:"
echo "   ./manage-services.sh status  # وضعیت سرویس‌ها"
echo "   ./manage-services.sh stop    # توقف همه سرویس‌ها"
