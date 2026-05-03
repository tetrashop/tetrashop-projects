import os

def check_system():
    print("🍎 گزارشِ وضعیتِ زیرساختِ Tetrashop برای رامین:")
    print("-" * 40)

    files_to_check = [
    "2d-to-3d-real/main.js",
    "bale_arm.py",
    "vercel.json",
    "outputs/arm_frame.jpg"
    ]

for f in files_to_check:
    status = "✅ موجود" if os.path.exists(f) else "❌ یافت نشد"
    print(f"{f:25} | {status}")

print("-" * 40)
print("💡 پیشنهاد: اگر فایل outputs/arm_frame.jpg را نداری، یک عکس در آنجا بگذار تا موتور را استارت بزنیم!")

if __name__ == "__main__":
    check_system()
