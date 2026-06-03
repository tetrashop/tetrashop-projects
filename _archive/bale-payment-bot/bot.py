#!/usr/bin/env python3
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    PreCheckoutQueryHandler,
    filters,
    ContextTypes,
)
import config
from products import load_products, format_price
from payment import send_invoice_for_product, process_successful_payment

# تنظیمات لاگ
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# ----- دستور /start -----
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("🛍️ محصولات دیجیتال", callback_data="products")],
        [InlineKeyboardButton("ℹ️ درباره ما", callback_data="about")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        f"سلام! به فروشگاه **TetraShop** خوش آمدید.\n"
        f"برای مشاهده محصولات دیجیتال و خرید روی دکمه زیر کلیک کنید.\n\n"
        f"🌐 سایت: {config.BASE_SITE_URL}",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

# ----- نمایش محصولات -----
async def show_products(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    products = load_products()
    if not products:
        await query.edit_message_text("محصولی برای فروش وجود ندارد.")
        return

    keyboard = []
    for prod in products:
        # دکمه خرید با callback_data حاوی product ID
        keyboard.append([InlineKeyboardButton(
            f"{prod['name']} - {format_price(prod['price_rial'])}",
            callback_data=f"buy_{prod['id']}"
        )])
    keyboard.append([InlineKeyboardButton("🔙 بازگشت", callback_data="start")])
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(
        "📋 **لیست محصولات دیجیتال:**",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

# ----- درخواست خرید (نمایش جزئیات و دکمه پرداخت) -----
async def buy_product(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    product_id = query.data.replace("buy_", "")
    from products import get_product_by_id
    product = get_product_by_id(product_id)
    if not product:
        await query.edit_message_text("❌ محصول یافت نشد.")
        return

    keyboard = [
        [InlineKeyboardButton("💳 پرداخت با کیف پول بله", callback_data=f"invoice_{product_id}")],
        [InlineKeyboardButton("🔙 لیست محصولات", callback_data="products")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    text = (
        f"**{product['name']}**\n\n"
        f"{product.get('description', '')}\n\n"
        f"💰 قیمت: {format_price(product['price_rial'])}\n"
        f"📁 نوع: {product.get('type', '')}\n"
    )
    await query.edit_message_text(text, reply_markup=reply_markup, parse_mode="Markdown")

# ----- ارسال فاکتور -----
async def send_invoice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    product_id = query.data.replace("invoice_", "")
    success = send_invoice_for_product(context, query.message.chat_id, product_id)
    if success:
        await query.edit_message_text("🧾 فاکتور برای شما ارسال شد. لطفاً پرداخت را تکمیل کنید.")

# ----- تایید پیش‌پرداخت (PreCheckoutQuery) -----
async def precheckout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.pre_checkout_query
    await query.answer(ok=True)

# ----- پرداخت موفق -----
async def successful_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    process_successful_payment(context, update)

# ----- برگشت به منوی اصلی -----
async def back_to_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("🛍️ محصولات دیجیتال", callback_data="products")],
        [InlineKeyboardButton("ℹ️ درباره ما", callback_data="about")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(
        "🏠 به فروشگاه TetraShop خوش آمدید.\n"
        f"🌐 {config.BASE_SITE_URL}",
        reply_markup=reply_markup
    )

# ----- درباره ما -----
async def about(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [[InlineKeyboardButton("🔙 بازگشت", callback_data="start")]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(
        "**TetraShop** – فروشگاه محصولات دیجیتال\n\n"
        "طراحی و توسعه: رامین اجلال\n"
        "نسخه ۲.۱\n\n"
        f"🌐 سایت: {config.BASE_SITE_URL}\n"
        "📧 پشتیبانی: @Tetrashopbot",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

# ----- اجرای ربات -----
def main():
    app = ApplicationBuilder().token(config.BOT_TOKEN).build()

    # هندلرهای دستوری
    app.add_handler(CommandHandler("start", start))

    # هندلرهای دکمه‌های inline
    app.add_handler(CallbackQueryHandler(show_products, pattern="^products$"))
    app.add_handler(CallbackQueryHandler(buy_product, pattern="^buy_"))
    app.add_handler(CallbackQueryHandler(send_invoice, pattern="^invoice_"))
    app.add_handler(CallbackQueryHandler(back_to_start, pattern="^start$"))
    app.add_handler(CallbackQueryHandler(about, pattern="^about$"))

    # هندلرهای پرداخت
    app.add_handler(PreCheckoutQueryHandler(precheckout_callback))
    app.add_handler(MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment))

    logger.info("🤖 ربات شروع به کار کرد...")
    app.run_polling()

if __name__ == "__main__":
    main()
