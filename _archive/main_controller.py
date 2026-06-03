import subprocess
import os
‌
class TetrashopEvolution:
def __init__(self):
self.engine_js = "2d-to-3d-real/main.js"
print("🏛️ هسته مرکزی Tetrashop (نسخه هوشمند) فعال شد.")
‌
def analyze_and_convert(self, image_path, width=1920, height=1080, quality="high"):
"""
این متد از کلاس TimeEstimator تو در جاوااسکریپت استفاده می‌کند
تا قبل از تبدیل، زمان را به رامین گزارش دهد.
"""
print(f"🔍 در حال تحلیل تصویر {image_path} با کیفیت {quality}...")
‌
# فرمانِ رانندگی برای Node.js (ارسال پارامترها به main.js)
# فرض بر این است که main.js ورودی‌ها را می‌گیرد
cmd = ["node", self.engine_js, image_path, str(width), str(height), quality]
‌
try:
# اجرای موتور و گرفتن خروجی (تخمین زمان + تبدیل)
process = subprocess.run(cmd, capture_output=True, text=True)
‌
if process.returncode == 0:
print("⏳ تخمین زمان و پردازش با موفقیت انجام شد.")
print(f"📝 خروجی موتور: {process.stdout[:100]}...") # نمایش بخشی از خروجی
return True
else:
print(f"⚠️ خطا در موتور: {process.stderr}")
return False
except Exception as e:
print(f"❌ خطای زیرساختی: {e}")
return False
‌
if __name__ == "__main__":
app = TetrashopEvolution()
‌
# تست روی یکی از فریم‌های بازوی رباتیک
test_file = "outputs/arm_frame.jpg"
if os.path.exists(test_file):
app.analyze_and_convert(test_file)
else:
print(f"📍 رامین جان، فایل {test_file} در پوشه outputs نیست.")
