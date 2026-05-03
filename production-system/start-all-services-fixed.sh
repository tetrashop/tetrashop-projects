#!/bin/bash

echo "🚀 راه‌اندازی سیستم تولیدی Tetrashop (نسخه تعمیر شده)"
echo "====================================================="
echo ""

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# توقف سرویس‌های قبلی
echo -e "${YELLOW}🛑 توقف سرویس‌های قبلی...${NC}"
pkill -f "python.*app.py" 2>/dev/null
sleep 2

# پاکسازی پورت‌ها
echo -e "${YELLOW}🧹 پاکسازی پورت‌ها...${NC}"
for port in {5000..5132}; do
    lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
done
sleep 1

# ایجاد پوشه‌ها
echo -e "${BLUE}📁 ایجاد ساختار پوشه‌ها...${NC}"
mkdir -p logs outputs config services/{01-ocr,02-image2dto3d,03-chess} 2>/dev/null

# راه‌اندازی Gateway
echo -e "${BLUE}🚪 راه‌اندازی Gateway مرکزی...${NC}"
cd gateway

# نصب وابستگی‌ها
echo -e "${YELLOW}📦 بررسی وابستگی‌های Python...${NC}"
python3 -c "import flask" 2>/dev/null || pip3 install flask > /dev/null 2>&1
python3 -c "import uuid" 2>/dev/null || pip3 install uuid > /dev/null 2>&1

nohup python3 app.py > ../logs/gateway_console.log 2>&1 &
GATEWAY_PID=$!
sleep 5

# بررسی Gateway
if curl -s http://localhost:5000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Gateway در پورت 5000 راه‌اندازی شد${NC}"
    echo $GATEWAY_PID > ../.gateway_pid
else
    echo -e "${RED}❌ خطا در راه‌اندازی Gateway${NC}"
    tail -20 ../logs/gateway_console.log
    exit 1
fi

# ایجاد سرویس‌های نمونه
echo -e "${BLUE}🔄 ایجاد سرویس‌های نمونه...${NC}"

# سرویس 1: OCR
echo -e "${YELLOW}   📸 ایجاد سرویس 01 (OCR)...${NC}"
cat > ../services/01-ocr/ocr_service.py << 'SERVICE_EOF'
from flask import Flask, jsonify
app = Flask(__name__)
@app.route('/')
def home():
    return jsonify({"service": "ocr", "status": "active", "port": 5101})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5101, debug=False, threaded=True)
SERVICE_EOF

cd ../services/01-ocr
nohup python3 ocr_service.py > ../../logs/service_01.log 2>&1 &
echo -e "${GREEN}   ✅ سرویس OCR راه‌اندازی شد${NC}"

# سرویس 2: تبدیل تصویر
echo -e "${YELLOW}   🎨 ایجاد سرویس 02 (Image2D3D)...${NC}"
cat > ../services/02-image2dto3d/image_service.py << 'SERVICE_EOF'
from flask import Flask, jsonify
app = Flask(__name__)
@app.route('/')
def home():
    return jsonify({"service": "image2dto3d", "status": "active", "port": 5102})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5102, debug=False, threaded=True)
SERVICE_EOF

cd ../services/02-image2dto3d
nohup python3 image_service.py > ../../logs/service_02.log 2>&1 &
echo -e "${GREEN}   ✅ سرویس تبدیل تصویر راه‌اندازی شد${NC}"

# سرویس 3: شطرنج
echo -e "${YELLOW}   ♟️ ایجاد سرویس 03 (Chess)...${NC}"
cat > ../services/03-chess/chess_service.py << 'SERVICE_EOF'
from flask import Flask, jsonify
app = Flask(__name__)
@app.route('/')
def home():
    return jsonify({"service": "chess", "status": "active", "port": 5103})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5103, debug=False, threaded=True)
SERVICE_EOF

cd ../services/03-chess
nohup python3 chess_service.py > ../../logs/service_03.log 2>&1 &
echo -e "${GREEN}   ✅ سرویس شطرنج راه‌اندازی شد${NC}"

# بازگشت به دایرکتوری اصلی
cd ../../

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}🎉 سیستم تولیدی Tetrashop راه‌اندازی شد!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}🌐 دسترسی‌های اصلی:${NC}"
echo -e "   Dashboard:  ${GREEN}http://localhost:5000${NC}"
echo -e "   مدیریت:     ${GREEN}http://localhost:5000/admin${NC}"
echo -e "   ورود:       ${GREEN}http://localhost:5000/login${NC}"
echo ""
echo -e "${YELLOW}📝 دستورات مهم:${NC}"
echo -e "   مشاهده لاگ Gateway:  ${GREEN}tail -f logs/gateway_console.log${NC}"
echo -e "   توقف سیستم:          ${GREEN}pkill -f 'python3.*app.py'${NC}"
echo -e "   بررسی وضعیت:         ${GREEN}ps aux | grep python3${NC}"
echo ""
