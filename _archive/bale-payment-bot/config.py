import os

# شناسه کیف پول بله
WALLET_ID = "WALLET-YHmDnapsnsVghjHX"
# توکن ربات بله
BOT_TOKEN = "152652039:shHdzxVcnxF8KV0zWN7uBI8wmMJHzOBdcmU"
# نام کاربری ربات (بدون @)
BOT_USERNAME = "Tetrashopbot"
# مسیر فایل محصولات دیجیتال (از ریشه پروژه tetra)
DIGITAL_PRODUCTS_PATH = os.path.expanduser("~/tetrashop-projects/frontend/src/data/digitalProducts.json")
# ارز پیش‌فرض (ریال ایران)
CURRENCY = "IRR"
# توضیح پرداخت
PAYMENT_DESCRIPTION = "پرداخت بابت خرید محصول دیجیتال از فروشگاه TetraShop"
# پیام پس از خرید موفق
SUCCESS_MESSAGE = "✅ پرداخت با موفقیت انجام شد. محصول شما:\n\n{title}\n\n📎 لینک دانلود: {link}"
# آدرس اصلی سایت (Vercel)
BASE_SITE_URL = "https://tetrashop-projects.vercel.app"
# قالب لینک دانلود – با product_id جایگزین می‌شود
DOWNLOAD_LINK_TEMPLATE = "{base}/digital/{product_id}"
