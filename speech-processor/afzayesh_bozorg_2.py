from گسترش_پایگاه_داده import NatiqMosatalah

natiq = NatiqMosatalah()

# لیست بزرگی از عبارات برای اضافه کردن
عبارات_عظیم = [
    # ضرب‌المثل‌های بیشتر
    {"ebarat": "گر صبر کنی ز غوره حلوا سازی", "daste": "zarbolmasalha", "mani": "با صبر و حوصله می‌توان به نتیجه خوب رسید"},
    {"ebarat": "خواستن توانستن است", "daste": "zarbolmasalha", "mani": "اگر واقعاً بخواهی، می‌توانی انجام دهی"},
    
    # اصطلاحات روزمره
    {"ebarat": "چشمم روشن", "daste": "estelahat", "mani": "خوشحال شدم از دیدن تو"},
    {"ebarat": "دلم تنگ شده", "daste": "estelahat", "mani": "دلت برای کسی یا چیزی تنگ شده"},
    
    # کنایه‌های طنز
    {"ebarat": "پاشنه آشیل", "daste": "kenayeha", "mani": "نقطه ضعف اصلی یک شخص یا چیز"},
]

for عبارت in عبارات_عظیم:
    natiq.afzoodan_ebarat_jadid(
        عبارت["daste"], 
        عبارت["ebarat"], 
        {
            "mani": عبارت["mani"],
            "karbord": "متنوع",
            "freakvens": 70,
            "mesal": f"مثال برای {عبارت['ebarat']}",
            "ehsas": "خنثی"
        }
    )

natiq.zakhire_paygah_dade()
print(f"🚀 پایگاه داده به {natiq.dadeha['etelaat_paygah']['tedad_ebarat']} عبارت رسید!")
