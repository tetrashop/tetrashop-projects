#!/bin/bash

echo "🎯 استقرار آسان TetraSaaS API"
echo "=============================="

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# بررسی فایل‌ها
echo -e "${YELLOW}📁 بررسی فایل‌ها...${NC}"
[ -f "api/index.js" ] && echo -e "${GREEN}✅ api/index.js موجود است${NC}" || echo -e "${RED}❌ api/index.js یافت نشد${NC}"
[ -f "package.json" ] && echo -e "${GREEN}✅ package.json موجود است${NC}" || echo -e "${RED}❌ package.json یافت نشد${NC}"
[ -f "vercel.json" ] && echo -e "${GREEN}✅ vercel.json موجود است${NC}" || echo -e "${RED}❌ vercel.json یافت نشد${NC}"

# بررسی محتوای API
echo -e "\n${YELLOW}🔍 بررسی محتوای API...${NC}"
if grep -q "251" api/index.js; then
  echo -e "${GREEN}✅ تعداد پست‌های NLP: 251${NC}"
else
  echo -e "${RED}❌ تعداد پست‌های NLP تنظیم نشده${NC}"
fi

# تست فعلی
echo -e "\n${YELLOW}🌐 تست API فعلی...${NC}"
CURRENT_URL="https://tetrashop-projects.vercel.app"
status=$(curl -s -o /dev/null -w "%{http_code}" "$CURRENT_URL")
if [ "$status" = "200" ]; then
  echo -e "${GREEN}✅ API فعلی کار می‌کند (کد: $status)${NC}"
  echo -n "   پیام: "
  curl -s "$CURRENT_URL" | grep -o '"message":"[^"]*"'
else
  echo -e "${RED}❌ API فعلی مشکل دارد (کد: $status)${NC}"
fi

# گزینه‌های deploy
echo -e "\n${YELLOW}🚀 گزینه‌های deploy:${NC}"
echo "1. استفاده از Vercel CLI (توصیه می‌شود)"
echo "2. از طریق وب Vercel"
echo "3. ایجاد repo جدید در GitHub"
echo ""
echo -n "گزینه مورد نظر را انتخاب کنید (1-3): "
read option

case $option in
  1)
    echo -e "\n${GREEN}📦 در حال deploy با Vercel CLI...${NC}"
    if command -v vercel &> /dev/null; then
      vercel --prod --yes
    else
      echo -e "${RED}❌ Vercel CLI نصب نیست. نصب کنید:${NC}"
      echo "npm install -g vercel"
    fi
    ;;
  2)
    echo -e "\n${GREEN}🌐 دستورات برای deploy از طریق وب:${NC}"
    echo "1. به https://vercel.com بروید"
    echo "2. وارد حساب خود شوید"
    echo "3. پروژه 'tetrashop-projects' را انتخاب کنید"
    echo "4. روی دکمه 'Redeploy' کلیک کنید"
    echo "5. یا از قسمت Deployments -> Latest -> Redeploy"
    ;;
  3)
    echo -e "\n${GREEN}🐙 ایجاد repo جدید:${NC}"
    echo "1. به https://github.com/new بروید"
    echo "2. نام: tetrasaas-api-v3"
    echo "3. Create repository"
    echo "4. سپس دستورات زیر را اجرا کنید:"
    echo ""
    echo "   git remote remove origin"
    echo "   git remote add origin https://github.com/YOUR_USER/tetrasaas-api-v3.git"
    echo "   git push -u origin main"
    ;;
  *)
    echo -e "${RED}❌ گزینه نامعتبر${NC}"
    ;;
esac

echo -e "\n${GREEN}✅ دستورات کامل شد.${NC}"
echo "بعد از deploy، آدرس‌های زیر را تست کنید:"
echo "• https://tetrashop-projects.vercel.app"
echo "• https://tetrashop-projects.vercel.app/api/nlp"
echo "• https://tetrashop-projects.vercel.app/api/nlp/251"
