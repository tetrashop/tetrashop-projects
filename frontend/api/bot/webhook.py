import json
import logging
from telegram import Bot, Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.constants import ParseMode
from .config import BOT_TOKEN, BOT_USERNAME
from .products import load_products, format_price
from .payment import send_invoice_for_product, process_successful_payment

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bot = Bot(token=BOT_TOKEN)

def build_main_menu():
    keyboard = [
        [InlineKeyboardButton("🛍️ محصولات دیجیتال", callback_data="products")],
        [InlineKeyboardButton("ℹ️ درباره ما", callback_data="about")],
    ]
    return InlineKeyboardMarkup(keyboard)

def build_products_list():
    products = load_products()
    keyboard = []
    for p in products:
        lbl = f"{p['name']} - {format_price(p['price_rial'])}"
        keyboard.append([InlineKeyboardButton(lbl, callback_data=f"buy_{p['id']}")])
    keyboard.append([InlineKeyboardButton("🔙 بازگشت", callback_data="start")])
    return InlineKeyboardMarkup(keyboard)

def build_product_detail(product_id):
    from .products import get_product_by_id
    product = get_product_by_id(product_id)
    if not product:
        return None, None
    keyboard = [
        [InlineKeyboardButton("💳 پرداخت با کیف پول بله", callback_data=f"invoice_{product_id}")],
        [InlineKeyboardButton("🔙 لیست محصولات", callback_data="products")],
    ]
    text = f"**{product['name']}**\n\n{product.get('description', '')}\n\n💰 قیمت: {format_price(product['price_rial'])}"
    return text, InlineKeyboardMarkup(keyboard)

def handler(request):
    if request.method == "POST":
        try:
            data = request.get_json()
            update = Update.de_json(data, bot)

            if update.message and update.message.text and update.message.text.startswith('/start'):
                chat_id = update.message.chat.id
                bot.send_message(chat_id, "به فروشگاه TetraShop خوش آمدید! 🛍️", reply_markup=build_main_menu(), parse_mode=ParseMode.MARKDOWN)
                return {"status": "ok"}

            if update.callback_query:
                query = update.callback_query
                query.answer()
                chat_id = query.message.chat.id
                message_id = query.message.message_id
                data_cb = query.data

                if data_cb == "start":
                    bot.edit_message_text("🏠 منوی اصلی", chat_id, message_id, reply_markup=build_main_menu())
                elif data_cb == "products":
                    bot.edit_message_text("📋 **محصولات دیجیتال:**", chat_id, message_id, reply_markup=build_products_list(), parse_mode=ParseMode.MARKDOWN)
                elif data_cb.startswith("buy_"):
                    product_id = data_cb[4:]
                    text, markup = build_product_detail(product_id)
                    if text:
                        bot.edit_message_text(text, chat_id, message_id, reply_markup=markup, parse_mode=ParseMode.MARKDOWN)
                    else:
                        bot.edit_message_text("محصول پیدا نشد.", chat_id, message_id)
                elif data_cb.startswith("invoice_"):
                    product_id = data_cb[8:]
                    success = send_invoice_for_product(bot, chat_id, product_id)
                    if success:
                        bot.edit_message_text("🧾 فاکتور ارسال شد. لطفاً پرداخت را تکمیل کنید.", chat_id, message_id)
                elif data_cb == "about":
                    bot.edit_message_text("**TetraShop** – فروشگاه محصولات دیجیتال\n\nتوسعه‌دهنده: رامین اجلال\nنسخه ۲.۱", chat_id, message_id, reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("🔙 بازگشت", callback_data="start")]]), parse_mode=ParseMode.MARKDOWN)
                return {"status": "ok"}

            if update.pre_checkout_query:
                update.pre_checkout_query.answer(ok=True)
                return {"status": "ok"}

            if update.message and update.message.successful_payment:
                process_successful_payment(bot, update.message.chat.id, update.message.successful_payment)
                return {"status": "ok"}

            return {"status": "ok"}
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return {"status": "error", "message": str(e)}
    return {"status": "ok"}
