# نطق مصطلح - نسخه حرفه‌ای
import re
from collections import Counter
from datetime import datetime

class AdvancedSpeechProcessor:
    def __init__(self):
        self.persian_phrases = {
            'سلام بر شما', 'خسته نباشید', 'دست مریزاد', 'ممنون از شما',
            'لطف دارید', 'بفرمایید', 'خدا قوت', 'زنده باشید'
        }
        self.slang_converter = {
            'مرسی': 'تشکر', 'اوکی': 'قبول', 'فقط': 'تنها', 'خیلی': 'بسیار',
            'راحته': 'آسان است', 'می‌ره': 'می‌رود', 'می‌کنه': 'می‌کند'
        }
    
    def process_text(self, text):
        print(f"📨 متن ورودی: {text}")
        print("-" * 50)
        
        found_phrases = [phrase for phrase in self.persian_phrases if phrase in text]
        
        normalized = text
        for slang, formal in self.slang_converter.items():
            normalized = normalized.replace(slang, formal)
        
        words = text.split()
        analysis = {
            'total_words': len(words),
            'unique_words': len(set(words)),
            'word_frequency': dict(Counter(words).most_common(5)),
            'sentence_count': len(re.split(r'[.!?]', text)),
            'avg_word_length': sum(len(word) for word in words) / len(words) if words else 0
        }
        
        return {
            'original': text,
            'normalized': normalized,
            'found_phrases': found_phrases,
            'analysis': analysis,
            'processing_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

print("🗣️ نطق مصطلح - نسخه حرفه‌ای")
print("=" * 50)

processor = AdvancedSpeechProcessor()
result = processor.process_text("سلام بر شما دوستان عزیز مرسی از لطفتون خسته نباشید")

print(f"✅ نرمال شده: {result['normalized']}")
print(f"🔍 اصطلاحات: {', '.join(result['found_phrases']) if result['found_phrases'] else 'یافت نشد'}")
print(f"📊 آمار: {result['analysis']['total_words']} کلمه, {result['analysis']['unique_words']} کلمه منحصر بفرد")
print(f"⏰ زمان پردازش: {result['processing_time']}")
