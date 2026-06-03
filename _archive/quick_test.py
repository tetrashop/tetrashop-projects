import requests
‌
TOKEN = "659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc"
url = f"https://tapi.bale.ai/bot{TOKEN}/getMe"
‌
try:
response = requests.get(url)
print("✅ اتصال برقرار است!")
print("اطلاعات بات تو:", response.json())
except Exception as e:
print("❌ خطا در اتصال:", e)
