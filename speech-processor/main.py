# نطق مصطلح - نسخه حرفه‌ای کامل
import re
import json
from collections import Counter
from datetime import datetime
from pathlib import Path

class AdvancedSpeechProcessor:
    def __init__(self):
        self.persian_phrases = {
            'سلام بر شما', 'خسته نباشید', 'دست مریزاد', 'ممنون از شما',
            'لطف دارید', 'بفرمایید', 'خدا قوت', 'زنده باشید', 'عرض ادب دارم',
            'محضر مبارک', 'قربان شما', 'شرمنده', 'موافقید', 'انشالله'
        }
        
        self.slang_converter = {
            'مرسی': 'تشکر', 'اوکی': 'قبول', 'فقط': 'تنها', 'خیلی': 'بسیار',
            'راحته': 'آسان است', 'می‌ره': 'می‌رود', 'می‌کنه': 'می‌کند',
            'نمیشه': 'نمی‌شود', 'داره': 'در حال', 'بگو': 'بیان کنید',
            'گوش کن': 'توجه کنید', 'فکر کن': 'بیندیشید'
        }
        
        self.formal_enhancer = {
            'گفت': 'بیان نمود', 'کرد': 'انجام داد', 'خوب': 'مطلوب',
            'بد': 'نامناسب', 'چیز': 'امر', 'کار': 'فعالیت',
            'مرد': 'آقا', 'زن': 'بانو', 'بچه': 'کودک',
            'خونه': 'منزل', 'ماشین': 'خودرو', 'گوشی': 'تلفن همراه'
        }
        
        self.analysis_history = []
        self.output_dir = Path("processed_results")
        self.output_dir.mkdir(exist_ok=True)
    
    def comprehensive_analysis(self, text):
        print(f"🔍 تحلیل جامع متن:")
        print(f"📨 ورودی: {text}")
        print("=" * 60)
        
        # پاکسازی متن
        cleaned_text = self._clean_text(text)
        
        # شناسایی اصطلاحات
        found_phrases = self._find_phrases(cleaned_text)
        
        # نرمال‌سازی
        normalized_text = self._normalize_speech(cleaned_text)
        
        # بهبود رسمی
        enhanced_text = self._enhance_formality(normalized_text)
        
        # تحلیل آماری پیشرفته
        detailed_analysis = self._detailed_analysis(cleaned_text)
        
        # تشخیص سبک
        style_analysis = self._analyze_speech_style(cleaned_text)
        
        # نتیجه نهایی
        result = {
            'original': text,
            'cleaned': cleaned_text,
            'normalized': normalized_text,
            'enhanced': enhanced_text,
            'phrases_found': found_phrases,
            'analysis': detailed_analysis,
            'style': style_analysis,
            'processing_time': datetime.now().isoformat(),
            'text_hash': hash(text)  # برای ردیابی یکتا
        }
        
        # ذخیره در تاریخچه
        self.analysis_history.append(result)
        
        # نمایش نتایج
        self._display_results(result)
        
        # ذخیره در فایل
        self._save_analysis(result)
        
        return result
    
    def _clean_text(self, text):
        """پاکسازی پیشرفته متن"""
        # حذف اموجی و کاراکترهای خاص
        cleaned = re.sub(r'[^\w\s\u0600-\u06FF\.\!\?،؛:]', '', text)
        # حذف فاصله‌های اضافی
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        # اصلاح علائم نگارشی
        cleaned = re.sub(r'\.\s*\.', '.', cleaned)
        return cleaned
    
    def _find_phrases(self, text):
        """شناسایی اصطلاحات و عبارات"""
        found = {
            'common_phrases': [phrase for phrase in self.persian_phrases if phrase in text],
            'informal_words': [word for word in self.slang_converter if word in text],
            'sentences': re.split(r'[.!?]', text),
            'word_patterns': self._find_patterns(text)
        }
        return found
    
    def _find_patterns(self, text):
        """شناسایی الگوهای گفتاری"""
        patterns = {
            'question': len(re.findall(r'\?', text)),
            'exclamation': len(re.findall(r'!', text)),
            'formal_indicators': len(re.findall(r'(\bبا احترام\b|\bعرض ادب\b|\bمحضر\b)', text)),
            'informal_indicators': len(re.findall(r'(\bمرسی\b|\bاوکی\b|\bخیلی\b)', text))
        }
        return patterns
    
    def _normalize_speech(self, text):
        """نرمال‌سازی گفتار محاوره‌ای"""
        normalized = text
        for slang, formal in self.slang_converter.items():
            normalized = re.sub(r'\b' + slang + r'\b', formal, normalized)
        return normalized
    
    def _enhance_formality(self, text):
        """بهبود سطح رسمی متن"""
        enhanced = text
        for informal, formal in self.formal_enhancer.items():
            enhanced = re.sub(r'\b' + informal + r'\b', formal, enhanced)
        return enhanced
    
    def _detailed_analysis(self, text):
        """تحلیل آماری پیشرفته"""
        words = text.split()
        sentences = [s.strip() for s in re.split(r'[.!?]', text) if s.strip()]
        
        # تحلیل کلمات
        word_freq = Counter(words)
        unique_words = set(words)
        
        # محاسبه شاخص‌های خوانایی
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        
        # شاخص خوانایی ساده شده
        readability_score = max(0, min(100, 100 - (avg_sentence_length + avg_word_length)))
        
        return {
            'basic_stats': {
                'total_characters': len(text),
                'total_words': len(words),
                'total_sentences': len(sentences),
                'unique_words': len(unique_words),
                'word_diversity': len(unique_words) / len(words) if words else 0
            },
            'word_frequency': dict(word_freq.most_common(10)),
            'readability': {
                'score': readability_score,
                'level': self._get_readability_level(readability_score),
                'avg_sentence_length': avg_sentence_length,
                'avg_word_length': avg_word_length
            },
            'complexity_metrics': {
                'long_words_ratio': len([w for w in words if len(w) > 6]) / len(words) if words else 0,
                'sentence_variety': len(set(len(s.split()) for s in sentences)) / len(sentences) if sentences else 0
            }
        }
    
    def _get_readability_level(self, score):
        """تعیین سطح خوانایی"""
        if score >= 80:
            return "بسیار آسان"
        elif score >= 60:
            return "آسان"
        elif score >= 40:
            return "متوسط"
        elif score >= 20:
            return "دشوار"
        else:
            return "بسیار دشوار"
    
    def _analyze_speech_style(self, text):
        """تحلیل سبک گفتار"""
        informal_count = sum(1 for slang in self.slang_converter if slang in text)
        formal_count = sum(1 for formal in self.formal_enhancer.values() if formal in text)
        
        total_indicators = informal_count + formal_count
        if total_indicators == 0:
            style = "خنثی"
        else:
            informal_ratio = informal_count / total_indicators
            if informal_ratio > 0.7:
                style = "محاوره‌ای"
            elif informal_ratio < 0.3:
                style = "رسمی"
            else:
                style = "ترکیبی"
        
        return {
            'style': style,
            'informal_indicators': informal_count,
            'formal_indicators': formal_count,
            'confidence': min(100, max(0, abs(informal_count - formal_count) * 10))
        }
    
    def _display_results(self, result):
        """نمایش زیبای نتایج"""
        print("📊 نتایج تحلیل:")
        print(f"✅ متن نرمال شده: {result['normalized']}")
        print(f"🎯 متن بهبود یافته: {result['enhanced']}")
        
        print(f"\n🔍 یافته‌ها:")
        phrases = result['phrases_found']['common_phrases']
        if phrases:
            print(f"   📝 اصطلاحات: {', '.join(phrases)}")
        else:
            print("   📝 اصطلاحات: یافت نشد")
        
        print(f"\n📈 آمار متن:")
        stats = result['analysis']['basic_stats']
        print(f"   📏 کاراکترها: {stats['total_characters']}")
        print(f"   📝 کلمات: {stats['total_words']} (منحصر بفرد: {stats['unique_words']})")
        print(f"   📚 جملات: {stats['total_sentences']}")
        
        readability = result['analysis']['readability']
        print(f"\n🎓 سطح خوانایی:")
        print(f"   📊 امتیاز: {readability['score']:.1f}/100")
        print(f"   🎯 سطح: {readability['level']}")
        
        style = result['style']
        print(f"\n🎨 سبک گفتار:")
        print(f"   🎭 نوع: {style['style']}")
        print(f"   💪 اطمینان: {style['confidence']}%")
    
    def _save_analysis(self, result):
        """ذخیره تحلیل در فایل"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"analysis_{timestamp}.json"
        filepath = self.output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"💾 نتایج در فایل '{filename}' ذخیره شد")
    
    def get_system_stats(self):
        """آمار سیستم"""
        return {
            'total_analyses': len(self.analysis_history),
            'average_text_length': sum(len(item['original']) for item in self.analysis_history) / len(self.analysis_history) if self.analysis_history else 0,
            'most_common_style': max(set(item['style']['style'] for item in self.analysis_history), 
                                   key=lambda x: list(item['style']['style'] for item in self.analysis_history).count(x)) if self.analysis_history else 'None',
            'first_analysis': self.analysis_history[0]['processing_time'] if self.analysis_history else 'None'
        }

print("🗣️ نطق مصطلح - نسخه حرفه‌ای کامل")
print("=" * 60)

processor = AdvancedSpeechProcessor()

# نمونه‌های مختلف برای تحلیل
samples = [
    "سلام بر شما دوستان عزیز مرسی از لطفتون خسته نباشید راستش خیلی ممنون",
    "با احترام خدمت شما، خواهشمند است نسبت به پیگیری این امر اقدام لازم را به عمل آورید",
    "اوکی قبول هست حتما انجام میدم فقط یه کم زمان می‌خواد ممنون از توضیحت"
]

print("🧪 تحلیل نمونه‌های مختلف:")
print()

for i, sample in enumerate(samples, 1):
    print(f"نمونه {i}:")
    result = processor.comprehensive_analysis(sample)
    print("-" * 50)

print("\n📊 آمار سیستم:")
stats = processor.get_system_stats()
print(f"   📈 تعداد تحلیل‌ها: {stats['total_analyses']}")
print(f"   📝 میانگین طول متن: {stats['average_text_length']:.1f} کاراکتر")
print(f"   🎭 پرتکرارترین سبک: {stats['most_common_style']}")

print(f"\n🎉 تحلیل کامل با موفقیت انجام شد!")
