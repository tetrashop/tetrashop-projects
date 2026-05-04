import logging
from .config import WALLET_ID, CURRENCY, PAYMENT_DESCRIPTION
from .products import get_product_by_id, format_price

logger = logging.getLogger(__name__)

def send_invoice(bot, chat_id, product_id):
    product = get_product_by_id(product_id)
    if not product:
        bot.send_message(chat_id, "❌ محصول یافت نشد.")
        return False
    title = product['name'][:32]
    prices = [{'label': title, 'amount': product['price_rial']}]
    try:
        bot.send_invoice(
            chat_id=chat_id,
            title=title,
            description=PAYMENT_DESCRIPTION,
            payload=f"product_{product_id}",
            provider_token=WALLET_ID,
            currency=CURRENCY,
            prices=prices,
            need_name=False,
            need_phone_number=False,
            need_email=False,
            is_flexible=False
        )
        return True
    except Exception as e:
        logger.error(f"send_invoice error: {e}")
        bot.send_message(chat_id, "⚠️ خطا در صدور فاکتور. لطفاً دوباره تلاش کنید.")
        return False

def handle_successful_payment(bot, chat_id, payment):
    product_id = payment['invoice_payload'].replace("product_", "")
    product = get_product_by_id(product_id)
    if product:
        download_link = f"https://tetrashop-projects.vercel.app/download/{product_id}"
        text = f"✅ پرداخت موفق!\n\nمحصول: {product['name']}\n🔗 لینک دانلود: {download_link}"
        bot.send_message(chat_id, text)
    else:
        bot.send_message(chat_id, "❌ محصول پرداخت شده یافت نشد.")
