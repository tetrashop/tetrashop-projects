import os
import json
from telegram import Update, Bot
from telegram.ext import Application

import config
from products import load_products, format_price
from payment import send_invoice_for_product, process_successful_payment

# تنظیم توکن ربات
TOKEN = config.BOT_TOKEN
bot = Bot(TOKEN)

def handler(request):
    """ورودی اصلی Vercel – هر درخواست POST از تلگرام را پردازش می‌کند"""
    if request.method == "POST":
        try:
            data = request.get_json()
            update = Update.de_json(data, bot)
            
            # هندل کردن PreCheckoutQuery
            if update.pre_checkout_query:
                update.pre_checkout_query.answer(ok=True)
                return {"status": "ok"}
            
            # هندل کردن پرداخت موفق
            if update.message and update.message.successful_payment:
                query = update.message.successful_payment
                # محصول تحویل داده شود
                payload = query.invoice_payload
                product_id = payload.replace("product_", "")
                from payment import get_product_by_id, format_price
                product = get_product_by_id(product_id)
                if product:
                    download_link = f"https://tetrashop-projects.vercel.app/download/{product_id}"  # موقت
                    text = f"✅ پرداخت موفق\n\nمحصول: {product['name']}\nلینک دانلود: {download_link}"
                    bot.send_message(update.effective_chat.id, text)
                return {"status": "ok"}
            
            # هندل کردن پیام‌های معمولی و callback ها
            if update.message:
                # فقط پاسخ به /start را اینجا می‌دهیم (دمو)
                if update.message.text.startswith('/start'):
                    keyboard = [
                        [{"text": "🛍️ محصولات دیجیتال", "callback_data": "products"}]
                    ]
                    reply_markup = {"inline_keyboard": keyboard}
                    bot.send_message(update.effective_chat.id, "به فروشگاه TetraShop خوش آمدید!", reply_markup=reply_markup)
            
            if update.callback_query:
                query = update.callback_query
                query.answer()
                if query.data == "products":
                    products = load_products()
                    if products:
                        keyboard = []
                        for p in products:
                            keyboard.append([{"text": f"{p['name']} - {format_price(p['price_rial'])}", "callback_data": f"buy_{p['id']}"}])
                        reply_markup = {"inline_keyboard": keyboard}
                        bot.edit_message_text("📋 محصولات دیجیتال:", query.message.chat.id, query.message.message_id, reply_markup=reply_markup)
                    else:
                        bot.edit_message_text("محصولی موجود نیست.", query.message.chat.id, query.message.message_id)
                elif query.data.startswith("buy_"):
                    product_id = query.data[4:]
                    from payment import get_product_by_id
                    product = get_product_by_id(product_id)
                    if product:
                        # ارسال فاکتور
                        chat_id = query.message.chat.id
                        title = product['name'][:32]
                        description = "خرید از فروشگاه TetraShop"
                        payload = f"product_{product_id}"
                        prices = [{"label": title, "amount": product['price_rial']}]
                        try:
                            bot.send_invoice(
                                chat_id=chat_id,
                                title=title,
                                description=description,
                                payload=payload,
                                provider_token=config.WALLET_ID,
                                currency=config.CURRENCY,
                                prices=prices,
                                need_name=False,
                                need_phone_number=False,
                                need_email=False,
                                is_flexible=False
                            )
                            bot.edit_message_text("🧾 فاکتور ارسال شد. لطفاً پرداخت را تکمیل کنید.", chat_id, query.message.message_id)
                        except Exception as e:
                            bot.send_message(chat_id, f"خطا در ایجاد فاکتور: {e}")
            
            return {"status": "ok"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    return {"status": "ok"}
