#!/bin/bash

echo "🧪 تست API سرویس OCR..."
echo ""

# مرحله ۱: دریافت توکن (بعد از ورود به سیستم)
echo "1. 📝 دریافت توکن دسترسی..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/generate-token \
  -H "Content-Type: application/json" \
  -d '{"service_id": "01"}')

echo "$TOKEN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data['success']:
        print('✅ توکن دریافت شد:', data['token'][:20] + '...')
        print('   سرویس:', data['service_id'])
    else:
        print('❌ خطا:', data.get('error', 'نامشخص'))
except:
    print('❌ پاسخ نامعتبر')
"
echo ""

# مرحله ۲: اجرای سرویس
echo "2. 🚀 اجرای سرویس OCR..."
RUN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/service/01/run \
  -H "Content-Type: application/json" \
  -d '{"token": "test_token"}')  # در واقعیت از توکن واقعی استفاده کنید

echo "$RUN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data['success']:
        print('✅ سرویس اجرا شد')
        print('   شناسه پردازش:', data['process_id'])
        print('   درآمد:', data['revenue'], data['currency'])
        print('   فایل خروجی:', data['output_file'])
    else:
        print('❌ خطا:', data.get('error', 'نامشخص'))
except:
    print('❌ پاسخ نامعتبر')
"
echo ""

# مرحله ۳: مشاهده خروجی‌ها
echo "3. 📄 مشاهده خروجی‌های تولید شده..."
OUTPUTS_RESPONSE=$(curl -s "http://localhost:5000/api/service/01/outputs?token=test_token")

echo "$OUTPUTS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data['success']:
        count = len(data['outputs'])
        print(f'✅ {count} فایل خروجی یافت شد')
        if count > 0:
            print('   آخرین فایل:', data['outputs'][0]['filename'])
            print('   مسیر:', data['outputs'][0]['path'])
            print('   قابل کپی:', data['outputs'][0]['can_copy'])
    else:
        print('❌ خطا:', data.get('error', 'نامشخص'))
except:
    print('❌ پاسخ نامعتبر')
"
