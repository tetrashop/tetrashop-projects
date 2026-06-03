import re
import os
‌
def scan_logic(file_path):
if not os.path.exists(file_path):
print(f"❌ فایل {file_path} یافت نشد.")
return
‌
with open(file_path, 'r', encoding='utf-8') as f:
content = f.read()
‌
# جستجوی کلاس‌ها یا توابعی که احتمالاً مربوط به ۳‌بعدی‌سازی هستند
# دنبال کلماتی مثل 'convert', 'render', 'reconstruct', 'process' می‌گردیم
keywords = ['convert', 'render', 'process', 'reconstruct', 'generate']
found = []
‌
for word in keywords:
matches = re.findall(rf'function\s+(\w*{word}\w*)|class\s+(\w*{word}\w*)', content, re.IGNORECASE)
if matches:
found.extend([m[0] or m[1] for m in matches])
‌
print("🍎 گزارشِ هوشمندِ Tetrashop (بخش منطقِ JS/WASM):")
print("-" * 45)
if found:
print(f"⚡ توابع/کلاس‌های کلیدی پیدا شده: {set(found)}")
print("\n💡 رامین، این‌ها همان موتورهای محرکِ پروژه تو هستند.")
else:
print("🔍 تابعی با نام مستقیم پیدا نشد. احتمالاً کدها در یک آبجکتِ بزرگ بسته‌بندی شده‌اند.")
print("-" * 45)
‌
if __name__ == "__main__":
scan_logic("2d-to-3d-real/main.js")
