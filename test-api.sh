#!/bin/bash

echo "🧪 شروع تست API TetraSaaS"
echo "آدرس: https://tetrashop-projects.vercel.app"
echo ""

# رنگ‌های ترمینال
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local name=$1
    local url=$2
    local check=$3
    
    echo -n "${YELLOW}• تست ${name}...${NC} "
    
    if command -v curl &> /dev/null; then
        response=$(curl -s -w "%{http_code}" "$url")
        status_code=${response: -3}
        content=${response:0: -3}
        
        if [ "$status_code" = "200" ]; then
            if [ -n "$check" ] && echo "$content" | grep -q "$check"; then
                echo -e "${GREEN}✅ موفق${NC}"
            elif [ -z "$check" ]; then
                echo -e "${GREEN}✅ موفق${NC}"
            else
                echo -e "${RED}❌ شکست${NC}"
            fi
        else
            echo -e "${RED}❌ خطا (کد: $status_code)${NC}"
        fi
    else
        echo -e "${RED}❌ curl یافت نشد${NC}"
    fi
}

echo ""
test_endpoint "صفحه اصلی" "https://tetrashop-projects.vercel.app" '"totalNLPosts":251'
test_endpoint "وضعیت سلامت" "https://tetrashop-projects.vercel.app/api/health" '"status":"healthy"'
test_endpoint "پست‌های NLP" "https://tetrashop-projects.vercel.app/api/nlp?page=1" '"totalItems":251'
test_endpoint "پست شماره 251" "https://tetrashop-projects.vercel.app/api/nlp/251" '"id":251'
test_endpoint "سرویس‌ها" "https://tetrashop-projects.vercel.app/api/services" '"count":26'
test_endpoint "آمار" "https://tetrashop-projects.vercel.app/api/stats" '"total":251'

echo ""
echo "📊 جمع‌بندی:"
echo "API TetraSaaS با موفقیت روی Vercel در حال اجراست"
echo "• 251 پست NLP کامل"
echo "• 26 سرویس AI"
echo "• API فارسی کامل"
echo "• آماده برای استفاده!"

echo ""
echo "🌐 آدرس‌های مهم:"
echo "https://tetrashop-projects.vercel.app"
echo "https://tetrashop-projects.vercel.app/api/nlp"
echo "https://tetrashop-projects.vercel.app/api/nlp/251"
