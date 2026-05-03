python
import requests
import time
‌
TOKEN = "659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc"
BASE_URL = f"https://tapi.bale.ai/bot{TOKEN}/"
‌
services = {
"1": {"name": "OCR فارسی", "price": 500, "result": "✅ متن از عکس استخراج شد"},
# ... بقیه سرویس‌های رامین اینجا قرار می‌گیرند
}
‌
def send_message(chat_id, text):
url = BASE_URL + "sendMessage"
requests.post(url, json={"chat_id": chat_id, "text": text})
‌
def handle_updates():
offset = 0
while True:
try:
url = BASE_URL + f"getUpdates?offset={offset}"
response = requests.get(url).json()
for update in response.get("result", []):
offset = update["update_id"] + 1
chat_id = update["message"]["chat"]["id"]
text = update["message"].get("text", "")
‌
if text == "/start":
send_message(chat_id, "🎯 به تتراشاپ خوش آمدید!\nعدد سرویس (۱-۱۰) را بفرستید.")
elif text in services:
s = services[text]
send_message(chat_id, f"🎉 {s['name']}\n💰 قیمت: {s['price']} تومان\n📊 {s['result']}")
else:
send_message(chat_id, "❌ لطفاً عددی بین ۱ تا ۱۰ وارد کنید.")
except:
pass
time.sleep(1)
‌
print("🚀 بات تتراشاپ روی بله فعال شد...")
handle_updates()
