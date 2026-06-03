import http.client
import json
import base64
import os
‌
def process_robot_arm(file_path):
# تنظیمات API برای تبدیل 2D به 3D (موتور پردازش Meshy)
host = "api.meshy.ai"
# رامین عزیز، کلید API شخصی‌ات را در خط پایین قرار بده:
api_key = "YOUR_API_KEY_HERE"
‌
if not os.path.exists(file_path):
print(f"❌ خطا: فایل در مسیر '{file_path}' پیدا نشد.")
return
‌
print(f"🔄 در حال آماده‌سازیِ تصویرِ بازو از مسیر: {file_path}")
‌
# تبدیل عکس بازوی رباتیک به فرمت Base64 برای ارسال سریع
try:
with open(file_path, "rb") as image_file:
img_data = base64.b64encode(image_file.read()).decode('utf-8')
except Exception as e:
print(f"❌ خطای خواندن فایل: {e}")
return
‌
# چیدمانِ معماریِ درخواست (Payload)
payload = json.dumps({
"image_url": f"data:image/jpeg;base64,{img_data}",
"enable_pbr": True
})
‌
headers = {
'Authorization': f'Bearer {api_key}',
'Content-Type': 'application/json'
}
‌
print("🚀 در حال ارسالِ «معماریِ اصیل» به موتور پردازش سه‌بعدی...")
‌
try:
conn = http.client.HTTPSConnection(host)
conn.request("POST", "/v1/2d-to-3d", payload, headers)
‌
response = conn.getresponse()
result = response.read().decode("utf-8")
‌
print(f"📡 وضعیت شبکه: {response.status} {response.reason}")
print("✅ پاسخِ نهاییِ سیستم دریافت شد:")
print(json.dumps(json.loads(result), indent=4))
‌
except Exception as e:
print(f"❌ خطای ارتباط با سرور: {e}")
‌
# برای اجرای دستی در کنسول پایتون:
# process_robot_arm("مسیر_عکس_شما.jpg")
