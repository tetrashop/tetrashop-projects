#!/bin/bash

echo "🎯 تست نهایی API TetraSaaS"
echo "============================"

API_URL="https://tetrashop-projects.vercel.app"

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

test_endpoint() {
    local name="$1"
    local endpoint="$2"
    local expected_check="$3"
    
    echo -ne "${YELLOW}• ${name}...${NC} "
    
    response=$(curl -s -w "\n%{http_code}" "${API_URL}${endpoint}")
    status_code=$(echo "$response" | tail -n1)
    content=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "200" ]; then
        if [ -n "$expected_check" ] && echo "$content" | grep -q "$expected_check"; then
            echo -e "${GREEN}✅ موفق${NC}"
            return 0
        elif [ -z "$expected_check" ]; then
            echo -e "${GREEN}✅ موفق${NC}"
            return 0
        else
            echo -e "${RED}❌ شکست (داده اشتباه)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ خطا (کد: ${status_code})${NC}"
        return 1
    fi
}

echo ""
test_endpoint "صفحه اصلی" "/" '"totalNLPosts":251'
test_endpoint "وضعیت سلامت" "/api/health" '"status":"healthy"'
test_endpoint "پست‌های NLP (صفحه 1)" "/api/nlp?page=1" '"totalItems":251'
test_endpoint "پست‌های NLP (صفحه 11 - آخرین)" "/api/nlp?page=11" '"currentPage":11'
test_endpoint "پست شماره 1" "/api/nlp/1" '"id":1'
test_endpoint "پست شماره 251" "/api/nlp/251" '"id":251'
test_endpoint "پست شماره 300 (باید خطا دهد)" "/api/nlp/300" '"error":"پست یافت نشد"'
test_endpoint "سرویس‌ها" "/api/services" '"total":26'
test_endpoint "آمار" "/api/stats" '"total":251'
test_endpoint "جستجو" "/api/search?q=تحلیل" '"success":true'

echo ""
echo "${BLUE}📊 جمع‌بندی:${NC}"
echo "API TetraSaaS با مشخصات زیر در حال اجراست:"
echo "• ${GREEN}251 پست NLP کامل${NC}"
echo "• ${GREEN}پشتیبانی از endpoint /api/nlp/1 تا /api/nlp/251${NC}"
echo "• ${GREEN}26 سرویس AI${NC}"
echo "• ${GREEN}آمار و گزارش‌گیری${NC}"
echo "• ${GREEN}سیستم جستجو${NC}"
echo "• ${GREEN}مدیریت خطا${NC}"

echo ""
echo "${BLUE}🌐 آدرس‌های مهم:${NC}"
echo "• صفحه اصلی: ${API_URL}/"
echo "• همه پست‌ها: ${API_URL}/api/nlp?page=1"
echo "• پست اول: ${API_URL}/api/nlp/1"
echo "• پست 251ام: ${API_URL}/api/nlp/251"
echo "• سرویس‌ها: ${API_URL}/api/services"
echo "• آمار: ${API_URL}/api/stats"
echo "• جستجو: ${API_URL}/api/search?q=تحلیل"

echo ""
echo "${GREEN}✅ تست کامل شد!${NC}"
