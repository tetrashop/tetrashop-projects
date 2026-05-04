import json, logging
from telegram import Bot, Update, InlineKeyboardButton, InlineKeyboardMarkup, ParseMode
from .config import BOT_TOKEN
from .products import load_products, format_price
from .payment import send_invoice, handle_successful_payment

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
bot = Bot(token=BOT_TOKEN)

def main_menu():
    kb = [
        [InlineKeyboardButton("🛍️ محصولات دیجیتال", callback_data="products")],
        [InlineKeyboardButton("ℹ️ درباره ما", callback_data="about")],
    ]
    return InlineKeyboardMarkup(kb)

def products_list():
    prods = load_products()
    kb = []
    for p in prods:
        kb.append([InlineKeyboardButton(f"{p['name']} - {format_price(p['price_rial'])}", callback_data=f"buy_{p['id']}")])
    kb.append([InlineKeyboardButton("🔙 بازگشت", callback_data="start")])
    return InlineKeyboardMarkup(kb)

def handler(request):
    if request.method != "POST":
        return {"status": "ok"}

    try:
        data = request.get_json()
        update = Update.de_json(data, bot)

        # /start
        if update.message and update.message.text and update.message.text.startswith('/start'):
            msg = "به فروشگاه TetraShop خوش آمدید! 🛍️"
            update.message.reply_text(msg, reply_markup=main_menu(), parse_mode=ParseMode.MARKDOWN)
            return {"status": "ok"}

        # pre‑checkout
        if update.pre_checkout_query:
            update.pre_checkout_query.answer(ok=True)
            return {"status": "ok"}

        # successful payment
        if update.message and update.message.successful_payment:
            handle_successful_payment(bot, update.message.chat.id, update.message.successful_payment)
            return {"status": "ok"}

        # callback buttons
        if update.callback_query:
            query = update.callback_query
            query.answer()
            chat_id = query.message.chat.id
            msg_id = query.message.message_id
            data_cb = query.data

            if data_cb == "start":
                query.edit_message_text("🏠 منوی اصلی", reply_markup=main_menu())
            elif data_cb == "products":
                query.edit_message_text("📋 **محصولات دیجیتال:**", reply_markup=products_list(), parse_mode=ParseMode.MARKDOWN)
            elif data_cb.startswith("buy_"):
                pid = data_cb[4:]
                from .products import get_product_by_id
                prod = get_product_by_id(pid)
                if prod:
                    txt = f"**{prod['name']}**\n\n{prod.get('description','')}\n💰 قیمت: {format_price(prod['price_rial'])}"
                    kb = InlineKeyboardMarkup([
                        [InlineKeyboardButton("💳 پرداخت با کیف پول بله", callback_data=f"invoice_{pid}")],
                        [InlineKeyboardButton("🔙 لیست محصولات", callback_data="products")],
                    ])
                    query.edit_message_text(txt, reply_markup=kb, parse_mode=ParseMode.MARKDOWN)
                else:
                    query.edit_message_text("محصول پیدا نشد.")
            elif data_cb.startswith("invoice_"):
                pid = data_cb[8:]
                if send_invoice(bot, chat_id, pid):
                    query.edit_message_text("🧾 فاکتور ارسال شد. لطفاً پرداخت را تکمیل کنید.")
                else:
                    query.edit_message_text("خطا در ایجاد فاکتور. دوباره تلاش کنید.")
            elif data_cb == "about":
                kb = InlineKeyboardMarkup([[InlineKeyboardButton("🔙 بازگشت", callback_data="start")]])
                query.edit_message_text("**TetraShop** – فروشگاه محصولات دیجیتال\n\nنسخه ۲.۱\nتوسعه‌دهنده: رامین اجلال", reply_markup=kb, parse_mode=ParseMode.MARKDOWN)

        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Handler error: {e}", exc_info=True)
        return {"status": "error", "message": str(e)}
