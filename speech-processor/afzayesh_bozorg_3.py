from گسترش_پایگاه_داده import NatiqMosatalah

natiq = NatiqMosatalah()

# لیست عظیمی از ضرب‌المثل‌های جدید
zarbolmasalha_jadid = [
    {
        "ebarat": "آدم عاقل در یک سوراخ دو بار گزیده نمی‌شود",
        "mani": "انسان باهاش از یک اشتباه دوباره تکرار نمی‌کند",
        "mesal": "بعد از اینکه کلاهبرداری شدی، دیگر به افراد ناشناس اعتماد نکن - آدم عاقل در یک سوراخ دو بار گزیده نمی‌شود"
    },
    {
        "ebarat": "از این ستون به آن ستون فرج است", 
        "mani": "همیشه راه حل و چاره‌ای وجود دارد",
        "mesal": "نگران نباش، از این ستون به آن ستون فرج است"
    },
    {
        "ebarat": "بار خود را به بارکش نشان بده",
        "mani": "کارت را به کسی نشان بده که می‌تواند کمک کند",
        "mesal": "به من نگو، برو بار خود را به بارکش نشان بده"
    },
    {
        "ebarat": "پشت گوش انداختن",
        "mani": "به تأخیر انداختن کاری",
        "mesal": "این کار را پشت گوش نینداز، فردا دیر است"
    },
    {
        "ebarat": "ترک تازی کردن",
        "mani": "فرار کردن، در رفتن",
        "mesal": "وقتی مشکل پیش آمد، ترک تازی کرد و رفت"
    }
]

# اضافه کردن ضرب‌المثل‌ها
for zarbolmasal in zarbolmasalha_jadid:
    natiq.afzoodan_ebarat_jadid(
        "zarbolmasalha",
        zarbolmasal["ebarat"],
        {
            "mani": zarbolmasal["mani"],
            "karbord": "ضرب‌المثل",
            "freakvens": 75,
            "mesal": zarbolmasal["mesal"],
            "ehsas": "پندآموز"
        }
    )

# اصطلاحات محاوره‌ای جدید
estelahat_jadid = [
    {
        "ebarat": "دست به عصا راه رفتن",
        "mani": "با احتیاط زیاد رفتار کردن",
        "mesal": "با این مدیر جدید باید دست به عصا راه بروی"
    },
    {
        "ebarat": "قلبش برای کسی طپیدن", 
        "mani": "علاقه شدید داشتن به کسی",
        "mesal": "قلبم برای تو طپید وقتی تو را دیدم"
    },
    {
        "ebarat": "آب از آسیاب افتادن",
        "mani": "شرایط عادی شدن، هیجان پایان یافتن",
        "mesal": "بعد از انتخابات، آب از آسیاب افتاد"
    },
    {
        "ebarat": "پایش را از گلیم درازتر کردن",
        "mani": "از حد خود تجاوز کردن",
        "mesal": "مراقب باش، پایت را از گلیمت درازتر نکنی"
    }
]

for estelah in estelahat_jadid:
    natiq.afzoodan_ebarat_jadid(
        "estelahat",
        estelah["ebarat"], 
        {
            "mani": estelah["mani"],
            "karbord": "اصطلاح محاوره",
            "freakvens": 80,
            "mesal": estelah["mesal"],
            "ehsas": "عامیانه"
        }
    )

natiq.zakhire_paygah_dade()
print(f"🚀 {len(zarbolmasalha_jadid) + len(estelahat_jadid)} عبارت جدید اضافه شد!")
print(f"📚 اکنون پایگاه داده دارای {natiq.dadeha['etelaat_paygah']['tedad_ebarat']} عبارت است!")
