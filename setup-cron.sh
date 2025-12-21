#!/bin/bash

echo "⏰ تنظیم بروزرسانی خودکار با cron"
echo "================================"

PROJECT_DIR="/data/data/com.termux/files/home/tetrashop-projects"
CRON_JOB="0 */2 * * * cd $PROJECT_DIR && ./auto-git-update.sh"

# بررسی وجود crontab
if ! command -v crontab &> /dev/null; then
    echo "❌ crontab یافت نشد. نصب کنید:"
    echo "   pkg install cronie"
    exit 1
fi

# ایجاد crontab جدید
echo "در حال تنظیم cron job..."
(crontab -l 2>/dev/null | grep -v "auto-git-update.sh"; echo "$CRON_JOB") | crontab -

if [ $? -eq 0 ]; then
    echo "✅ Cron job تنظیم شد:"
    echo "   هر ۲ ساعت اجرا می‌شود"
    echo ""
    echo "📋 لیست cron jobs فعلی:"
    crontab -l
else
    echo "❌ خطا در تنظیم cron job"
fi

# تست اجرا
echo ""
echo "🧪 تست اجرای اسکریپت..."
cd "$PROJECT_DIR" && ./auto-git-update.sh

echo ""
echo "🔧 برای مشاهده لاگ‌ها:"
echo "   tail -f $PROJECT_DIR/git-auto-update.log"
