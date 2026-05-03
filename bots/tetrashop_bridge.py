import subprocess
import os
import json
‌
class Tetrashop3DEngine:
def __init__(self):
self.engine_path = "2d-to-3d-real/main.js"
self.output_folder = "outputs"
if not os.path.exists(self.output_folder):
os.makedirs(self.output_folder)
‌
def process_image(self, input_image_path):
"""
این متد، موتورِ اصلیِ رامین (JS/WASM) را صدا می‌زند.
"""
print(f"🚀 هسته Tetrashop در حالِ تحلیلِ تصویر: {input_image_path}")
‌
# فرمانِ منعطف برای اجرا (روی ترموکس یا هاست)
try:
# ما فرض می‌کنیم main.js ورودی را از خط فرمان می‌گیرد
# اگر پلتفرم تو به صورت وب است، این بخش را به API وصل می‌کنیم
result = subprocess.run(['node', self.engine_path, input_image_path],
capture_output=True, text=True)
‌
if result.returncode == 0:
print("✅ مدل ۳‌بعدی با موفقیت بازسازی شد.")
return f"{self.output_folder}/reconstructed_model.obj"
else:
print(f"⚠️ هشدار در موتور: {result.stderr}")
return None
except Exception as e:
print(f"❌ خطا در لایه‌ی Bridge: {e}")
return None
‌
if __name__ == "__main__":
# تستِ سریعِ رامین
engine = Tetrashop3DEngine()
sample = "outputs/arm_frame.jpg"
if os.path.exists(sample):
engine.process_image(sample)
else:
print("📍 رامین جان، فایل تست یافت نشد. موتور آماده‌ی دریافتِ دستور از بله است.")
