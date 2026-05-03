#!/bin/bash

echo "🚀 راه‌اندازی سیستم تولیدی Tetrashop"
echo "====================================="
echo ""

# رنگ‌ها برای نمایش بهتر
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# توقف سرویس‌های قبلی
echo -e "${YELLOW}🛑 توقف سرویس‌های قبلی...${NC}"
pkill -f "python.*app.py" 2>/dev/null
sleep 2

# پاکسازی پورت‌ها
echo -e "${YELLOW}🧹 پاکسازی پورت‌های 5000-5132...${NC}"
for port in {5000..5132}; do
    lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
done
sleep 1

# راه‌اندازی Gateway اصلی
echo -e "${BLUE}🚪 راه‌اندازی Gateway مرکزی...${NC}"
cd gateway
nohup python app.py > ../logs/gateway_console.log 2>&1 &
GATEWAY_PID=$!
sleep 3

# بررسی Gateway
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Gateway در پورت 5000 راه‌اندازی شد (PID: $GATEWAY_PID)${NC}"
else
    echo -e "${RED}❌ خطا در راه‌اندازی Gateway${NC}"
    tail -20 ../logs/gateway_console.log
    exit 1
fi

# ایجاد فایل PID برای مدیریت
echo $GATEWAY_PID > ../.gateway_pid

# راه‌اندازی سرویس‌های نمونه (در این مثال 3 سرویس اول)
echo -e "${BLUE}🔄 راه‌اندازی سرویس‌های نمونه...${NC}"

# سرویس 1: OCR
echo -e "${YELLOW}   📸 سرویس 01 (OCR) روی پورت 5101...${NC}"
cat > ../services/01-ocr/ocr_service.py << 'SERVICE_EOF'
from flask import Flask, jsonify
import os
app = Flask(__name__)
@app.route('/')
def home():
    return jsonify({"service": "ocr", "status": "active", "port": 5101})
if __name__ == '__main__':
    app.run(port=5101, debug=False, threaded=True)
SERVICE_EOF
cd ../services/01-ocr
nohup python ocr_service.py > ../../logs/service_01.log 2>&1 &
SERVICE1_PID=$!

# سرویس 2: تبدیل تصویر
echo -e "${YELLOW}   🎨 سرویس 02 (Image2D3D) روی پورت 5102...${NC}"
cat > ../services/02-image2dto3d/image_service.py << 'SERVICE_EOF'
from flask import Flask, jsonify
import os
app = Flask(__name__)
@app.route('/')
def home():
    return jsonify({"service": "image2dto3d", "status": "active", "port": 5102})
if __name__ == '__main__':
    app.run(port=5102, debug=False, threaded=True)
SERVICE_EOF
cd ../services/02-image2dto3d
nohup python image_service.py > ../../logs/service_02.log 2>&1 &
SERVICE2_PID=$!

# سرویس 3: شطرنج
echo -e "${YELLOW}   ♟️ سرویس 03 (Chess) روی پورت 5103...${NC}"
cat > ../services/03-chess/chess_service.py << 'SERVICE_EOF'
from flask import Flask, jsonify
import os
app = Flask(__name__)
@app.route('/')
def home():
    return jsonify({"service": "chess", "status": "active", "port": 5103})
if __name__ == '__main__':
    app.run(port=5103, debug=False, threaded=True)
SERVICE_EOF
cd ../services/03-chess
nohup python chess_service.py > ../../logs/service_03.log 2>&1 &
SERVICE3_PID=$!

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
echo -e "${BLUE}🚪 سرویس‌های نمونه:${NC}"
echo -e "   سرویس OCR:  ${GREEN}http://localhost:5000/service/01/ui${NC}"
echo -e "   تبدیل تصویر:${GREEN}http://localhost:5000/service/02/ui${NC}"
echo -e "   شطرنج:      ${GREEN}http://localhost:5000/service/03/ui${NC}"
echo ""
echo -e "${BLUE}📊 لاگ‌های سیستم:${NC}"
echo -e "   Gateway:    ${YELLOW}tail -f logs/gateway_console.log${NC}"
echo -e "   سرویس‌ها:   ${YELLOW}tail -f logs/service_*.log${NC}"
echo ""
echo -e "${YELLOW}⚠️ برای توقف سیستم: pkill -f 'python.*app.py'${NC}"
echo ""
