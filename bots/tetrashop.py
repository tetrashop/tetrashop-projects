import logging
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackQueryHandler

logging.basicConfig(level=logging.INFO)
TOKEN = '659328109:wgtP8s2g-VZ_xPzCmBuLdCQNVWdgZIFN6TA'
BALE_BASE_URL = 'https://tapi.bale.ai/'

def start(update, context):
    user = update.effective_user
    kb = [
         [InlineKeyboardButton("1️⃣ متن‌خوان", callback_data='1'), InlineKeyboardButton("2️⃣ تحلیل داده", callback_data='2')],
         [InlineKeyboardButton("3️⃣ طراحی گرافیک", callback_data='3'), InlineKeyboardButton("4️⃣ کوانتوم", callback_data='4')],
         [InlineKeyboardButton("📚 مدل ۱۱ جلد", callback_data='11')],
         [InlineKeyboardButton("💰 کیف پول", callback_data='wallet'), InlineKeyboardButton("📞 پشتیبانی", callback_data='support')]
         ]

update.message.reply_text(f"سلام {user.first_name}!\nبه تتراشاپ خوش آمدید:", reply_markup=InlineKeyboardMarkup(kb))

def handle(update, context):
     q = update.callback_query
     q.answer()
     t = "📚 مدل ۱۱ جلد کتاب آماده است.\n💵 ۵۰,۰۰۰ تومان" if q.data == '11' else f"سرویس {q.data} انتخاب شد."
     q.edit_message_text(text=t)

def main():
    try:
        up = Updater(TOKEN, base_url=BALE_BASE_URL, use_context=True)
        up.dispatcher.add_handler(CommandHandler("start", start))
        up.dispatcher.add_handler(CallbackQueryHandler(handle))
        print("🚀 تتراشاپ با موفقیت آنلاین شد!")
        up.start_polling()
        up.idle()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
