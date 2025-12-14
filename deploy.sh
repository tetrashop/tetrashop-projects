#!/bin/bash

set -e

echo "🚀 شروع فرآیند deploy..."

# رنگ‌ها برای نمایش بهتر
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 بررسی وضعیت Git...${NC}"
git status

echo -e "${BLUE}➕ اضافه کردن تغییرات...${NC}"
git add .

echo -e "${BLUE}💾 کامیت تغییرات...${NC}"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "deploy: بروزرسانی پروژه در $TIMESTAMP" || echo "⚠️  No changes to commit"

echo -e "${BLUE}📤 Push به GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ کامیت‌ها با موفقیت push شدند!${NC}"

echo -e "${YELLOW}⏳ منتظر deploy خودکار Vercel...${NC}"
echo -e "${BLUE}🌐 آدرس پروژه: https://tetrashop-projects.vercel.app${NC}"
echo -e "${BLUE}📱 آدرس موبایل: https://tetrashop-projects.vercel.app?mobile=1${NC}"

# نمایش اطلاعات پروژه
echo -e "\n${GREEN}📋 اطلاعات پروژه:${NC}"
echo "تعداد پروژه‌ها: ۷"
echo "آخرین بروزرسانی: $TIMESTAMP"
echo "وضعیت: ✅ فعال"

# باز کردن مرورگر
if command -v xdg-open &> /dev/null; then
    xdg-open "https://tetrashop-projects.vercel.app"
elif command -v open &> /dev/null; then
    open "https://tetrashop-projects.vercel.app"
fi
