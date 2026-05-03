import requests
‌
# غیرفعال کردن هشدارهای امنیتی برای اینترنت داخلی
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
‌
TOKEN = "659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc"
url = f"https://tapi.bale.ai/bot{TOKEN}/getMe"
‌
print("📡 تست اتصال با اینترنت داخلی...")
try:
# اضافه کردن verify=False برای دور زدن چک امنیتی در شبکه ملی
r = requests.get(url, timeout=10, verify=False)
if r.status_code == 200:
print("✅ ایول! با اینترنت داخلی هم وصل شدیم.")
print("اطلاعات بات:", r.json())
else:
print(f"⚠️ وصل شدیم ولی سرور بله این کد رو داد: {r.status_code}")
except Exception as e:
print(f"❌ هنوز نمیتونیم به tapi.bale.ai وصل بشیم. خطا: {e}")
