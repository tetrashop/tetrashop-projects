import http.client
import json
import base64
import os
‌
def send_to_3d_api(image_path, api_key):
# تنظیمات پیش‌فرض برای API سه‌بعدی‌ساز (قابل تغییر بر اساس سرویس انتخابی)
host = "api.meshy.ai"
path = "/v1/2d-to-3d"
‌
print(f"🔄 در حال خواندن فایلِ معماری: {image_path}")
if not os.path.exists(image_path):
return "❌ فایل پیدا نشد! احتمالاً مسیر فایلِ عکس اشتباه است."
‌
try:
with open(image_path, "rb") as image_file:
encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
‌
# تنظیم بدنه با منطق Base64 برای عبور از موانعِ شبکه‌ای
payload = json.dumps({
"image_data": encoded_string,
"mode": "preview"
})
‌
headers = {
'Authorization': f'Bearer {api_key}',
'Content-Type': 'application/json'
}
‌
print("🚀 در حالِ ارسال اطلاعات به موتورِ پردازش سه‌بعدی...")
conn = http.client.HTTPSConnection(host)
conn.request("POST", path, payload, headers)
‌
res = conn.getresponse()
data = res.read()
‌
print(f"📡 وضعیت پاسخِ سرور: {res.status}")
return data.decode("utf-8")
‌
except Exception as e:
return f"❌ خطای ارتباطی در معماری سیستم: {str(e)}"
‌
# رامین، برای تست سریع می‌توانی تابع را اینجا فراخوانی کنی:
# print(send_to_3d_api("path_to_your_image.jpg", "YOUR_API_KEY"))
