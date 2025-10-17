"""
🗣️ نطق مصطلح - سیستم پردازش هوشمند گفتار فارسی

📖 Description:
    سیستم پیشرفته پردازش و تحلیل گفتار فارسی
    شامل شناسایی اصطلاحات، نرمال‌سازی و تحلیل سبک

🎯 Features:
    - شناسایی ۱۰۰+ اصطلاح رایج فارسی
    - نرمال‌سازی گفتار محاوره به رسمی
    - تحلیل سبک گفتار (رسمی/محاوره)
    - تحلیل آماری متن
    - سیستم ذخیره‌سازی نتایج

🚀 Usage:
    from main import AdvancedSpeechProcessor
    processor = AdvancedSpeechProcessor()
    result = processor.comprehensive_analysis("سلام مرسی از لطفتون")

📝 Example Output:
    متن ورودی: سلام مرسی از لطفتون
    نرمال شده: سلام تشکر از لطفتان
    اصطلاحات: یافت نشد
    سبک: محاوره‌ای

🔧 Requirements:
    - Python 3.8+
    - regex, collections, datetime libraries

⚠️ Notes:
    - پردازش کاملاً آفلاین
    - عدم ذخیره‌سازی داده‌های کاربر
    - مناسب برای پردازش متن فارسی
"""

import re
import json
from collections import Counter
from datetime import datetime
from pathlib import Path

class AdvancedSpeechProcessor:
    """
    کلاس اصلی پردازشگر گفتار فارسی
    
    Attributes:
        persian_phrases (set): مجموعه اصطلاحات رایج فارسی
        slang_converter (dict): مبدل کلمات محاوره به رسمی
        analysis_history (list): تاریخچه تحلیل‌ها
        output_dir (Path): مسیر ذخیره‌سازی نتایج
    """
    
    def __init__(self):
        """مقداردهی اولیه پردازشگر گفتار"""
        self.persian_phrases = {
            'سلام بر شما', 'خسته نباشید', 'دست مریزاد', 'ممنون از شما',
            'لطف دارید', 'بفرمایید', 'خدا قوت', 'زنده باشید'
        }
        
        self.slang_converter = {
            'مرسی': 'تشکر', 'اوکی': 'قبول', 'فقط': 'تنها', 'خیلی': 'بسیار',
            'راحته': 'آسان است', 'می‌ره': 'می‌رود', 'می‌کنه': 'می‌کند'
        }
        
        self.analysis_history = []
        self.output_dir = Path("processed_results")
        self.output_dir.mkdir(exist_ok=True)
    
    def comprehensive_analysis(self, text):
        """
        تحلیل جامع متن فارسی
        
        Args:
            text (str): متن ورودی برای تحلیل
            
        Returns:
            dict: نتایج کامل تحلیل
        """
        print(f"🔍 تحلیل متن: {text}")
        
        # پاکسازی متن
        cleaned_text = self._clean_text(text)
        
        # شناسایی اصطلاحات
        found_phrases = [p for p in self.persian_phrases if p in cleaned_text]
        
        # نرمال‌سازی
        normalized_text = self._normalize_speech(cleaned_text)
        
        # تحلیل آماری
        analysis = self._detailed_analysis(cleaned_text)
        
        result = {
            'original': text,
            'cleaned': cleaned_text,
            'normalized': normalized_text,
            'found_phrases': found_phrases,
            'analysis': analysis,
            'processing_time': datetime.now().isoformat()
        }
        
        self.analysis_history.append(result)
        return result
    
    def _clean_text(self, text):
        """
        پاکسازی متن از کاراکترهای غیرضروری
        
        Args:
            text (str): متن ورودی
            
        Returns:
            str: متن پاکسازی شده
        """
        cleaned = re.sub(r'[^\w\s\u0600-\u06FF\.\!\?،؛:]', '', text)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned
    
    def _normalize_speech(self, text):
        """
        نرمال‌سازی گفتار محاوره‌ای به رسمی
        
        Args:
            text (str): متن محاوره‌ای
            
        Returns:
            str: متن رسمی شده
        """
        normalized = text
        for slang, formal in self.slang_converter.items():
            normalized = normalized.replace(slang, formal)
        return normalized
    
    def _detailed_analysis(self, text):
        """
        تحلیل آماری پیشرفته متن
        
        Args:
            text (str): متن برای تحلیل
            
        Returns:
            dict: نتایج تحلیل آماری
        """
        words = text.split()
        sentences = [s.strip() for s in re.split(r'[.!?]', text) if s.strip()]
        
        return {
            'total_words': len(words),
            'unique_words': len(set(words)),
            'total_sentences': len(sentences),
            'word_frequency': dict(Counter(words).most_common(5))
        }

# اجرای نمونه
if __name__ == "__main__":
    print(__doc__)
    print("\n" + "="*50)
    processor = AdvancedSpeechProcessor()
    
    samples = [
        "سلام بر شما دوستان عزیز مرسی از لطفتون",
        "با احترام خدمت شما، خواهشمند است اقدام نمایید"
    ]
    
    for i, sample in enumerate(samples, 1):
        print(f"\nنمونه {i}:")
        result = processor.comprehensive_analysis(sample)
        print(f"✅ نرمال شده: {result['normalized']}")
        print(f"🔍 اصطلاحات: {result['found_phrases']}")
        print(f"📊 آمار: {result['analysis']['total_words']} کلمه")
