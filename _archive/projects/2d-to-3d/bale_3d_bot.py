import os
import sys
import subprocess
import requests
import json
import time

# ۱. پیکربندی مستقیم و صلب (بدون جستجوی حریصانه)
BASE_DIR = "/data/data/com.termux/files/home/tetrashop-projects/projects/2d-to-3d"
RHETORIC_CORE = os.path.join(BASE_DIR, "pages-deploy/common-rhetoric-pro/rhetoric_engine")
ZARINPAL_SERVICE = os.path.join(BASE_DIR, "services/payment/zarinpal-service.cjs")
OUTPUT_DIR = os.path.join(BASE_DIR, "public")
API_TOKEN = "659328109:QFVgG7mqkkOFzR_oflqXAb3uEUOXxwIuVVU" # توکن خودت را اینجا بگذار
BASE_URL = f"https://api.bale.ai/bot{API_TOKEN}"

class TetrashopIntegratedSystem:
    def init(self):
        self.engine_path = RHETORIC_CORE
        if not os.path.exists(OUTPUT_DIR): os.makedirs(OUTPUT_DIR)

    # --- بخش ۱: هوش تجاری و درآمدزایی ---
    def check_subscription(self, user_id):
        """استعلام مستقیم وضعیت مالی کاربر از سرویس زرین‌پال امان"""
        try:
            # فراخوانی مستقیم Node.js برای بررسی اشتراک
            result = subprocess.run(['node', ZARINPAL_SERVICE, 'check', str(user_id)],
            capture_output=True, text=True, timeout=5)
            return "active" in result.stdout.lower()
         except:
         return False

    # --- بخش ۲: موتور تبدیل مستقل (Aman Engine) ---
    def convert_to_3d(self, input_image):
        """تبدیل با بهره‌وری حداکثری لایه C++"""
        filename = os.path.basename(input_image)
        output_obj = os.path.join(OUTPUT_DIR, f"tetrashop_{int(time.time())}.obj")

        try:
            # اجرای مستقیم هسته بلاغت (بدون اتلاف وقت)
            subprocess.run([self.engine_path, input_image, "--output", output_obj, "--optimized"],
            check=True, capture_output=True)
                return output_obj if os.path.exists(output_obj) else None
        except:
            return None

    # --- بخش ۳: مدیریت پیام‌رسان بله ---
    def send_bale_message(self, chat_id, text, reply_markup=None):
        payload = {'chat_id': chat_id, 'text': text}
        if reply_markup: payload['reply_markup'] = json.dumps(reply_markup)
            requests.post(f"{BASE_URL}/sendMessage", json=payload)

    def handle_welcome(self, chat_id, first_name):
        welcome_text = f"🌟 سلام {first_name} عزیز به Tetrashop خوش آمدی!\n\nقدرتمندترین سیستم تبدیل ۲D به ۳D با هسته Aman-Rhetoric در خدمت شماست."
        markup = {
            'inline_keyboard': [
                [{'text': "🚀 شروع تبدیل (VIP)", 'callback_data': "start_process"}],
                [{'text': "💳 خرید اشتراک / تمدید", 'callback_data': "buy_premium"}]
                ]
        }
        self.send_bale_message(chat_id, welcome_text, markup)

        # --- حلقه اصلی و یکپارچه سیستم ---
        tetrashop = TetrashopIntegratedSystem()

    def main_loop():
        last_update_id = 0
        print("🚀 Tetrashop Aman-Engine is Running...")

        while True:
            try:response = requests.get(f"{BASE_URL}/getUpdates", params={'offset': last_update_id + 1}, timeout=10)
                updates = response.json().get('result', [])

                for u in updates:
                    last_update_id = u['update_id']
                    msg = u.get('message', {})
                    chat_id = msg.get('chat', {}).get('id')
                    user_id = msg.get('from', {}).get('id')
                    user_name = msg.get('from', {}).get('first_name', 'کاربر')

                    # ۱. منطق خوشآمدگویی
                    if msg.get('text') == "/start":
                        tetrashop.handle_welcome(chat_id, user_name)

                    # ۲. منطق دریافت تصویر و درآمدزایی
                    elif 'photo' in msg:
                        # بررسی اشتراک قبل از هرگونه پردازش سنگین (بهره‌وری مالی)
                        if not tetrashop.check_subscription(user_id):
                            tetrashop.send_bale_message(chat_id, "⚠️ رامین جان، برای استفاده از موتور اختصاصی امان، نیاز به اشتراک فعال داری.",
                            {'inline_keyboard': [[{'text': "💳 خرید آنی اشتراک", 'callback_data': "buy"}]]})
                            continue

                        tetrashop.send_bale_message(chat_id, "🌀 تصویر دریافت شد. در حال فراخوانی هسته C++ امان... (لطفاً صبور باشید)")

                        # دانلود تصویر از سرور بله (ساده شده)
                        file_id = msg['photo'][-1]['file_id']
                        file_info = requests.get(f"{BASE_URL}/getFile", params={'file_id': file_id}).json()
                        file_path = file_info['result']['file_path']
                        img_data = requests.get(f"https://api.bale.ai/file/bot{API_TOKEN}/{file_path}").content

                        local_img = "input.jpg"
                        with open(local_img, 'wb') as f: f.write(img_data)

                        # ۳. تبدیل (بهره‌وری الگوریتمیک)
                        obj_result = tetrashop.convert_to_3d(local_img)

                        if obj_result:
                            with open(obj_result, 'rb') as f:
                                requests.post(f"{BASE_URL}/sendDocument", params={'chat_id': chat_id}, files={'document': f})
                            tetrashop.send_bale_message(chat_id, "✅ مدل سه بعدی با موفقیت از لایه Rhetoric استخراج شد.")
                        else:
                            tetrashop.send_bale_message(chat_id, "❌ خطا در پردازش تصویر. لطفاً تصویر واضح‌تری ارسال کنید.")
‌
            except Exception as e:
                print(f"Loop Error: {e}")
                time.sleep(2)

if name == "main":
     main_loop()
