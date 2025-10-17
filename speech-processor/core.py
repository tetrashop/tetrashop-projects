"""
🗣️ نطق مصطلح - سیستم کشف حقیقت در گفتار
"""

import json
from datetime import datetime

class حقیقت_گفتار:
    def __init__(self):
        self.پایگاه_دانش = "گفتار_حقیقی.json"
        self.بارگذاری_دانش()
    
    def بارگذاری_دانش(self):
        try:
            with open(self.پایگاه_دانش, 'r', encoding='utf-8') as فایل:
                self.دانش = json.load(فایل)
        except FileNotFoundError:
            self.دانش = {
                "تاریخ_ایجاد": datetime.now().isoformat(),
                "خالق": "tetrashop",
                "تحلیل_ها": []
            }
            self.ذخیره_دانش()
    
    def ذخیره_دانش(self):
        with open(self.پایگاه_دانش, 'w', encoding='utf-8') as فایل:
            json.dump(self.دانش, فایل, ensure_ascii=False, indent=2)
    
    def تحلیل_گفتار(self, متن):
        تحلیل = {
            "متن": متن,
            "زمان": datetime.now().isoformat(),
            "طول": len(متن),
            "کلمات": len(متن.split())
        }
        
        self.دانش["تحلیل_ها"].append(تحلیل)
        self.ذخیره_دانش()
        return تحلیل

# تست سیستم
سیستم = حقیقت_گفتار()
نتیجه = سیستم.تحلیل_گفتار("این یک تست است")
print("🗣️ نطق مصطلح فعال شد")
print(f"✅ تحلیل: {نتیجه}")
