#!/bin/bash

echo "📊 وضعیت Tetrashop"
echo "=================="

# بررسی پورت
if lsof -i:5000 > /dev/null 2>&1; then
    echo "✅ پورت 5000 فعال"
    
    # تست سلامت
    echo ""
    echo "🏥 تست سلامت:"
    curl -s http://localhost:5000/health | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('   وضعیت:', data.get('status', 'نامشخص'))
    print('   سرویس‌ها:', data.get('services', 0))
    print('   نسخه:', data.get('version', 'نامشخص'))
    print('   پیام:', data.get('message', ''))
except:
    print('   ❌ Gateway پاسخ نمی‌دهد')
"
else
    echo "❌ پورت 5000 آزاد - Gateway اجرا نیست"
fi

# بررسی فرآیند
echo ""
echo "🔍 فرآیندهای فعال:"
ps aux | grep -E "(tetrashop|gateway)" | grep -v grep || echo "   هیچ فرآیندی یافت نشد"

# بررسی فایل‌ها
echo ""
echo "📁 فایل‌های خروجی:"
if [ -d "outputs" ]; then
    count=$(ls -1 outputs/*.txt 2>/dev/null | wc -l)
    echo "   تعداد: $count فایل"
    ls -1 outputs/*.txt 2>/dev/null | head -5
else
    echo "   پوشه outputs وجود ندارد"
fi
