from گسترش_پایگاه_داده import NatiqMosatalah

natiq = NatiqMosatalah()

# اضافه کردن صدها عبارت جدید
zarbolmasalha_jadid = [
    {
        "ebarat": "نابرده رنج گنج میسر نمی‌شود",
        "etelaat": {
            "mani": "بدون زحمت کشیدن نمی‌توان به موفقیت رسید",
            "karbord": "انگیزه‌دهی و تشویق به تلاش",
            "freakvens": 95,
            "mesal": "برای قبولی در دانشگاه باید سخت درس بخوانی، نابرده رنج گنج میسر نمی‌شود"
        }
    },
    {
        "ebarat": "کبوتر با کبوتر، باز با باز",
        "etelaat": {
            "mani": "اشخاص با افراد هم‌فکر و هم‌سطح خود معاشرت می‌کنند",
            "karbord": "روابط اجتماعی",
            "freakvens": 82,
            "mesal": "همیشه با کتابخوان‌ها هستی، کبوتر با کبوتر باز با باز"
        }
    }
]

for zarbolmasal in zarbolmasalha_jadid:
    natiq.afzoodan_ebarat_jadid("zarbolmasalha", zarbolmasal["ebarat"], zarbolmasal["etelaat"])

# اضافه کردن کنایه‌های طنز
kenayeha_jadid = [
    {
        "ebarat": "ماهی را هر وقت از آب بگیری تازه است",
        "etelaat": {
            "mani": "هر وقت فرصت داشته باشی می‌توانی کاری را انجام دهی (کنایه طنز به تعلل)",
            "karbord": "طنز و شوخی",
            "freakvens": 76,
            "mesal": "می‌گوید فردا درس می‌خوانم، ماهی را هر وقت از آب بگیری تازه است!"
        }
    }
]

for kenaye in kenayeha_jadid:
    natiq.afzoodan_ebarat_jadid("kenayeha", kenaye["ebarat"], kenaye["etelaat"])

natiq.zakhire_paygah_dade()

print(f"🎊 پایگاه داده اکنون دارای {natiq.dadeha['etelaat_paygah']['tedad_ebarat']} عبارت است!")
