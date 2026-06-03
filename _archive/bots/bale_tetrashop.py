python
import requests
import time
‌
# رامین جان، توکن باتت را که از BotFather بله گرفتی، اینجا بگذار
TOKEN = "659328109:gES26796I8r-yi7q-woZbXjPB9uHUClflWc"
BASE_URL = f"https://tapi.bale.ai/bot{TOKEN}/"
‌
services = {
"1": {"name": "📸 OCR فارسی", "price": 500, "result": "متن استخراج شده: 'نمونه متن از عکس شما'"},
"2": {"name": "📝 خلاصه‌سازی", "price": 300, "result": "خلاصه متن شما با موفقیت آماده شد."},
"3": {"name": "🔤 ترجمه", "price": 400, "result": "ترجمه: 'Translated Text successfully'"},
"4": {"name": "💬 چت‌بات هوشمند", "price": 600, "result": "سلام رامین عزیز! چطور می‌توانم کمکت کنم؟"},
"11": {"name": "🎨 تبدیل ۲بعدی به ۳بعدی", "price": "تست", "result": "در حال پردازش مدل ۳بعدی شما... (بزودی)"}
}
‌
def send_message(chat_id, text):
url = BASE_URL + "sendMessage"
try:
requests.post(url, json={"chat_id": chat_id, "text": text})
except:
print("❌ خطا در اتصال به سرور بله")
‌
def handle_updates():
offset = 0
print("🚀 تتراشاپ روی بله استارت خورد...")
while True:
try:
url = BASE_URL + f"getUpdates?offset={offset}&timeout=30"
response = requests.get(url).json()
if "result" in response:
for update in response["result"]:
offset = update["update_id"] + 1
if "message" in update:
chat_id = update["message"]["chat"]["id"]
user_text = update["message"].get("text", "")
‌
if user_text == "/start":
welcome = ("🎯 به تتراشاپ خوش آمدید!\n"
"سیستم خدمات هوش مصنوعی رامین اجلال\n\n"
"لطفاً عدد سرویس مورد نظر را بفرستید:\n" +
"\n".join([f"{k}. {v['name']} ({v['price']} ت)" for k, v in services.items()]))
send_message(chat_id, welcome)
‌
elif user_text in services:
s = services[user_text]
res = f"🎉 سرویس: {s['name']}\n💰 هزینه: {s['price']} تومان\n\n📊 نتیجه موقت:\n{s['result']}"
send_message(chat_id, res)
‌
else:
send_message(chat_id, "❌ رامین عزیز، لطفاً یک عدد معتبر (۱ تا ۱۱) بفرست.")
except Exception as e:
print(f"Error: {e}")
time.sleep(1)
‌
if __name__ == "__main__":
handle_updates()
