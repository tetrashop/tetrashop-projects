import os
import re
‌
def scan_csharp_project(folder_path):
print(f"🚀 در حال کالبدشکافی پوشه اختصاصی: {folder_path}")
for root, dirs, files in os.walk(folder_path):
for file in files:
if file.endswith(".cs"):
with open(os.path.join(root, file), 'r') as f:
content = f.read()
# پیدا کردن کلاس و متدهایی که احتمالا مربوط به تبدیل هستند
classes = re.findall(r'class\s+(\w+)', content)
methods = re.findall(r'public\s+[\w<>]+\s+(\w+)\s*\(', content)
if classes:
print(f"📄 فایل: {file}")
print(f"   🏛️ کلاس‌ها: {classes}")
print(f"   ⚡ متدهای کلیدی: {[m for m in methods if 'Convert' in m or 'Process' in m]}")
‌
if __name__ == "__main__":
scan_csharp_project("2d-to-3d-real")
