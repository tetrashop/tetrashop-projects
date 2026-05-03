# 🤖 ربات پرداخت بله – TetraShop

این ربات امکان فروش محصولات دیجیتال مجموعهٔ TetraShop را از طریق پیام‌رسان **بله** و کیف پول متصل فراهم می‌کند.

🌐 **سایت اصلی:** [tetrashop-projects.vercel.app](https://tetrashop-projects.vercel.app/)

## نحوه استفاده
1. ربات را در بله استارت کنید: `@Tetrashopbot`
2. روی دکمه «محصولات دیجیتال» کلیک کنید.
3. محصول مورد نظر را انتخاب و فاکتور پرداخت را دریافت کنید.
4. پس از پرداخت موفق، لینک صفحه محصول در سایت دریافت می‌شود.

## تنظیمات
- کیف پول: `WALLET-YHmDnapsnsVghjHX`
- توکن ربات: در `config.py` ذخیره شده است.
- محصولات از فایل `digitalProducts.json` بارگذاری می‌شوند.

## نصب و اجرا
```bash
cd ~/tetrashop-projects/bale-payment-bot
bash run.sh
