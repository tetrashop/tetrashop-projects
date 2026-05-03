import sys
# اضافه کردنِ پلِ هوشمند به رباتِ بله
try:
from tetrashop_bridge import Tetrashop3DEngine
engine = Tetrashop3DEngine()
print("🤖 هوشِ مصنوعیِ ۳‌بعدی به ربات بله متصل شد.")
except ImportError:
print("❌ خطا: فایل tetrashop_bridge را پیدا نکردم.")
‌
# منطقی که باید در فایل bale_arm.py رامین قرار بگیرد:
def on_receive_photo(photo_path):
print("📸 تصویر از بازوی رباتیک دریافت شد.")
model_path = engine.process_image(photo_path)
if model_path:
print(f"📦 مدل تولید شد: {model_path}")
# اینجا رامین می‌تواند مدل را برای کاربر در بله پس بفرستد
