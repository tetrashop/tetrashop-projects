import logging
from .config import WALLET_ID, CURRENCY, PAYMENT_DESCRIPTION
from .products import get_product_by_id, format_price

logger = logging.getLogger(__name__)

def send_invoice_for_product(bot, chat_id, product_id):
    product = get_product_by_id(product_id)
    if not product:
        bot.send_message(chat_id, "محصول یافت نشد.")
        return False
    title = product['name'][:32]
    description = PAYMENT_DESCRIPTION
    payload = f"product_{product_id}"
    prices = [{'label': title, 'amount': product['price_rial']}]
    try:
        bot.send_invoice(
            chat_id=chat_id,
            title=title,
            description=description,
            payload=payload,
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
        logger.error(f"Error sending invoice: {e}")
        bot.send_message(chat_id, "خطا در ایجاد فاکتور.")
        return False

def process_successful_payment(bot, chat_id, successful_payment):
    payload = successful_payment['invoice_payload']
    product_id = payload.replace("product_", "")
    product = get_product_by_id(product_id)
    if not product:
        bot.send_message(chat_id, "خطا: محصول یافت نشد.")
        return
    download_link = f"https://tetrashop-projects.vercel.app/download/{product_id}"  # آدرس موقت
    text = f"✅ پرداخت موفق\n\nمحصول: {product['name']}\nلینک دانلود: {download_link}\nبا تشکر از خرید شما!"
    bot.send_message(chat_id, text)
