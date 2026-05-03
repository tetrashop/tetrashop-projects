import logging
from config import WALLET_ID, CURRENCY, PAYMENT_DESCRIPTION, BASE_SITE_URL, DOWNLOAD_LINK_TEMPLATE
from products import get_product_by_id, format_price
from telegram import LabeledPrice, InlineKeyboardButton, InlineKeyboardMarkup

logger = logging.getLogger(__name__)

def send_invoice_for_product(context, chat_id, product_id):
    """ارسال فاکتور پرداخت برای یک محصول"""
    product = get_product_by_id(product_id)
    if not product:
        context.bot.send_message(chat_id, "❌ محصول مورد نظر یافت نشد.")
        return False

    title = product['name'][:32]  # حداکثر طول ۳۲ کاراکتر
    description = PAYMENT_DESCRIPTION
    payload = f"product_{product_id}"  # داده‌ای که بعد از پرداخت برگشت می‌خورد
    prices = [LabeledPrice(title, product['price_rial'])]  # قیمت به ریال
    provider_token = WALLET_ID

    try:
        context.bot.send_invoice(
            chat_id=chat_id,
            title=title,
            description=description,
            payload=payload,
            provider_token=provider_token,
            currency=CURRENCY,
            prices=prices,
            # photo_url=product.get('image'),  # تصویر محصول (اختیاری)
            need_name=False,
            need_phone_number=False,
            need_email=False,
            is_flexible=False,
        )
        return True
    except Exception as e:
        logger.error(f"Error sending invoice: {e}")
        context.bot.send_message(chat_id, "⚠️ خطا در ایجاد فاکتور. لطفاً دوباره تلاش کنید.")
        return False

def process_successful_payment(context, update):
    """پرداخت موفق – تحویل محصول"""
    successful_payment = update.message.successful_payment
    payload = successful_payment.invoice_payload  # مثلاً product_<id>
    product_id = payload.replace("product_", "")
    product = get_product_by_id(product_id)
    chat_id = update.effective_chat.id

    if not product:
        context.bot.send_message(chat_id, "❌ خطا: محصول یافت نشد.")
        return

    # لینک واقعی به صفحه محصول در Vercel
    download_link = DOWNLOAD_LINK_TEMPLATE.format(base=BASE_SITE_URL, product_id=product_id)

    message = (
        f"✅ پرداخت با موفقیت انجام شد.\n\n"
        f"📦 محصول: {product['name']}\n"
        f"💰 قیمت: {format_price(product['price_rial'])}\n"
        f"🔗 صفحه محصول: {download_link}\n\n"
        f"با تشکر از خرید شما 🙏\n"
        f"🌐 فروشگاه: {BASE_SITE_URL}"
    )
    context.bot.send_message(chat_id, message)
