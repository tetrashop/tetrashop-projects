#!/bin/bash
# دستورات سرویس 01 - OCR فارسی
# تاریخ تولید: Sun Jan  4 16:09:57 +0330 2026

echo "🛠️ دستورات سرویس 01: OCR فارسی"
echo ""

# 1. مشاهده پیکربندی سرویس
echo "1. 📋 مشاهده پیکربندی سرویس:"
echo "cat config/service_01.conf"
echo ""

# 2. اجرای سرویس
echo "2. 🚀 اجرای سرویس:"
echo "cd services/01-service && python app.py"
echo ""

# 3. مشاهده لاگ
echo "3. 📄 مشاهده لاگ سرویس:"
echo "tail -f logs/service_01.log"
echo ""

# 4. مشاهده خروجی‌ها
echo "4. 📁 مشاهده خروجی‌های تولید شده:"
echo "ls -la services/01-service/outputs/"
echo ""

# 5. کپی مسیر فایل نمونه
echo "5. 📋 کپی مسیر فایل نمونه خروجی:"
echo "echo 'services/01-service/outputs/sample_output.txt' | pbcopy"
echo ""

# 6. دستور cat برای نمایش فایل نمونه
echo "6. 👁️ نمایش محتوای فایل نمونه:"
echo "cat services/01-service/outputs/sample_output.txt"
echo ""
