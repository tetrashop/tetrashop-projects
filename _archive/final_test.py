import requests
import sys
‌
TOKEN = "659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc"
url = f"https://tapi.bale.ai/bot{TOKEN}/getMe"
‌
print("🔍 در حال بررسی اتصال به بله...")
try:
r = requests.get(url, timeout=10)
if r.status_code == 200:
data = r.json()
bot_name = data.get('result', {}).get('first_name', 'نامعلوم')
print(f"✅ ایول رامین! اتصال برقراره.")
print(f"🤖 نام بات تو: {bot_name}")
print("🚀 حالا همین الان برو توی بله به باتت پیام بده.")
else:
print(f"⚠️ اوه! سرور بله جواب داد ولی با کد: {r.status_code}")
except Exception as e:
print(f"❌ خطا! احتمالا اینترنت گوشی قطعه یا فیلترشکنت روشنه. خطا: {e}")
