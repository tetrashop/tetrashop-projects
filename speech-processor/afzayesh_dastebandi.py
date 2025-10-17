from گسترش_پایگاه_داده import NatiqMosatalah

natiq = NatiqMosatalah()

# اضافه کردن اشعار و بیت‌های معروف
ashare_mardomi = [
    {
        "ebarat": "بنى آدم اعضای یک پیکرند",
        "mani": "همه انسانها با هم برادر و برابرند",
        "sharer": "سعدی",
        "mesal": "در گلستان سعدی: بنى آدم اعضای یک پیکرند که در آفرینش ز یک گوهرند"
    },
    {
        "ebarat": "چو عضوى به درد آورد روزگار، دگر عضوها را نماند قرار",
        "mani": "وقتی یکی رنج ببیند، دیگران نیز آرامش ندارند", 
        "sharer": "سعدی",
        "mesal": "این بیت ادامه همان شعر معروف سعدی است"
    }
]

for sheyr in ashare_mardomi:
    natiq.afzoodan_ebarat_jadid(
        "ashare_mardomi",
        sheyr["ebarat"],
        {
            "mani": sheyr["mani"],
            "karbord": "شعر و ادبیات",
            "freakvens": 90,
            "mesal": sheyr["mesal"],
            "sharer": sheyr["sharer"],
            "ehsas": "ادبی"
        }
    )

# اضافه کردن تعبیرات جدید
tabirat_jadid = [
    {
        "ebarat": "دستش به جایی بند نیست",
        "mani": "کسی که هیچ وابستگی و مسئولیتی ندارد",
        "mesal": "او دستش به جایی بند نیست، می‌تواند هر کاری بکند"
    },
    {
        "ebarat": "آبش از آسیاب افتاده",
        "mani": "قدرت و نفوذش از بین رفته",
        "mesal": "دیگر نگران او نباش، آبش از آسیاب افتاده"
    }
]

for tabir in tabirat_jadid:
    natiq.afzoodan_ebarat_jadid(
        "tabirat",
        tabir["ebarat"],
        {
            "mani": tabir["mani"],
            "karbord": "تعبیر",
            "freakvens": 70,
            "mesal": tabir["mesal"],
            "ehsas": "توصیفی"
        }
    )

natiq.zakhire_paygah_dade()
print(f"🎯 {len(ashare_mardomi) + len(tabirat_jadid)} عبارت تخصصی اضافه شد!")
print(f"📊 آمار نهایی: {natiq.dadeha['etelaat_paygah']['tedad_ebarat']} عبارت در ۵ دسته‌بندی")
