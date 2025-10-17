# هوش نگار - نسخه سازمانی کامل
from datetime import datetime
import json
import random
from pathlib import Path
import re

class EnterpriseIntelligentWriter:
    def __init__(self):
        self.templates = {
            'report': {
                'sections': ['مقدمه', 'روش‌شناسی', 'یافته‌ها', 'تجزیه و تحلیل', 'نتیجه‌گیری', 'پیشنهادات'],
                'min_words': 500,
                'max_words': 2000
            },
            'article': {
                'sections': ['عنوان', 'چکیده', 'مقدمه', 'بدنه اصلی', 'بحث', 'نتیجه‌گیری'],
                'min_words': 300,
                'max_words': 1500
            },
            'story': {
                'sections': ['شروع', 'تعلیق', 'اوج', 'فرود', 'پایان', 'پیام'],
                'min_words': 200,
                'max_words': 1000
            },
            'business_plan': {
                'sections': ['خلاصه اجرایی', 'بیانیه مسئله', 'تحلیل بازار', 'راه‌حل', 'مدل درآمدی', 'تیم اجرایی', 'نیازهای مالی'],
                'min_words': 800,
                'max_words': 3000
            }
        }
        
        self.styles = {
            'حرفه‌ای': {
                'phrases': ['با توجه به', 'بر اساس', 'نتایج نشان می‌دهد', 'می‌توان نتیجه گرفت'],
                'tone': 'رسمی',
                'complexity': 'متوسط'
            },
            'علمی': {
                'phrases': ['مطالعات نشان داده‌اند', 'با استناد به', 'تحلیل داده‌ها حاکی از'],
                'tone': 'آکادمیک', 
                'complexity': 'بالا'
            },
            'خلاقانه': {
                'phrases': ['در دنیای پر از شگفتی', 'همچون پرنده‌ای در آسمان', 'رقص کلمات آغاز می‌شود'],
                'tone': 'شاعرانه',
                'complexity': 'متغیر'
            },
            'ساده': {
                'phrases': ['به زبان ساده', 'می‌توان گفت', 'نکته مهم این است'],
                'tone': 'دوستانه',
                'complexity': 'پایین'
            }
        }
        
        self.knowledge_base = {
            'technology': ['هوش مصنوعی', 'بلاکچین', 'اینترنت اشیا', 'رایانش ابری'],
            'business': ['مدیریت پروژه', 'بازاریابی دیجیتال', 'تحلیل بازار', 'مدیریت منابع'],
            'science': ['پژوهش علمی', 'روش‌شناسی', 'تحلیل داده', 'نظریه پردازی'],
            'education': ['یادگیری الکترونیک', 'روش‌های تدریس', 'ارزیابی آموزشی', 'محتوای آموزشی']
        }
        
        self.content_history = []
        self.export_dir = Path("generated_content")
        self.export_dir.mkdir(exist_ok=True)
    
    def generate_comprehensive_content(self, topic, template_type='article', style='حرفه‌ای', target_words=500):
        print(f"🧠 تولید محتوای جامع")
        print(f"📝 موضوع: {topic}")
        print(f"📋 قالب: {template_type}")
        print(f"🎨 سبک: {style}")
        print(f"📏 هدف کلمات: {target_words}")
        print("=" * 60)
        
        template = self.templates.get(template_type, self.templates['article'])
        style_config = self.styles.get(style, self.styles['حرفه‌ای'])
        
        # تولید محتوای هر بخش
        content_sections = {}
        total_words = 0
        quality_indicators = []
        
        for section in template['sections']:
            section_content, section_quality = self._generate_section_content(
                topic, section, style_config, target_words // len(template['sections'])
            )
            content_sections[section] = section_content
            total_words += len(section_content.split())
            quality_indicators.append(section_quality)
            
            print(f"✅ {section}: {len(section_content.split())} کلمه - کیفیت: {section_quality}/10")
        
        # تحلیل نهایی محتوا
        final_analysis = self._analyze_final_content(content_sections, quality_indicators)
        
        # ایجاد ساختار نهایی
        result = {
            'metadata': {
                'topic': topic,
                'template': template_type,
                'style': style,
                'target_words': target_words,
                'actual_words': total_words,
                'completion_rate': (total_words / target_words) * 100,
                'overall_quality': sum(quality_indicators) / len(quality_indicators),
                'generated_at': datetime.now().isoformat(),
                'content_id': f"CONTENT_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            },
            'content': content_sections,
            'analysis': final_analysis,
            'recommendations': self._generate_recommendations(final_analysis)
        }
        
        # ذخیره در تاریخچه
        self.content_history.append(result)
        
        # نمایش نتایج
        self._display_generation_results(result)
        
        return result
    
    def _generate_section_content(self, topic, section, style_config, target_words):
        """تولید محتوای یک بخش"""
        base_content = self._get_section_template(topic, section, style_config)
        
        # گسترش محتوا تا رسیدن به تعداد کلمات هدف
        current_words = len(base_content.split())
        expansions = self._get_content_expansions(topic, style_config)
        
        while current_words < target_words and expansions:
            expansion = random.choice(expansions)
            base_content += " " + expansion
            current_words = len(base_content.split())
            expansions.remove(expansion)
        
        # ارزیابی کیفیت
        quality_score = self._evaluate_content_quality(base_content, style_config)
        
        return base_content, quality_score
    
    def _get_section_template(self, topic, section, style_config):
        """الگوی پایه برای هر بخش"""
        opening_phrase = random.choice(style_config['phrases'])
        
        section_templates = {
            'مقدمه': f"{opening_phrase}، در این {section} به بررسی جامع {topic} می‌پردازیم.",
            'نتیجه‌گیری': f"{opening_phrase}، می‌توان چنین نتیجه گرفت که {topic} تأثیر بسزایی در این حوزه دارد.",
            'شروع': f"{opening_phrase}، داستان {topic} در فضایی پر از رمز و راز آغاز می‌شود.",
            'پایان': f"و اینگونه ماجرای {topic} به پایان رسید، اما یادها باقی ماند.",
            'چکیده': f"این {section} مروری کوتاه بر جنبه‌های مختلف {topic} ارائه می‌دهد.",
            'بحث': f"در {section} حاضر، ابعاد گوناگون {topic} مورد تحلیل و بررسی قرار می‌گیرد."
        }
        
        return section_templates.get(section, f"{opening_phrase}، بخش {section} درباره {topic}.")
    
    def _get_content_expansions(self, topic, style_config):
        """جملات تکمیلی برای گسترش محتوا"""
        expansions = [
            f"این موضوع از اهمیت ویژه‌ای در حوزه مربوطه برخوردار است.",
            f"جنبه‌های متعددی از {topic} قابل بررسی و تحلیل هستند.",
            f"تحقیقات اخیر نشان می‌دهد که {topic} در حال توسعه و تحول است.",
            f"می‌توان دیدگاه‌های مختلفی را در زمینه {topic} مطرح نمود.",
            f"کاربردهای عملی {topic} در صنعت و کسب و کار قابل توجه است.",
            f"آینده {topic} با تحولات تکنولوژیکی گره خورده است.",
            f"چالش‌های پیش روی {topic} نیازمند راه‌حل‌های نوآورانه است."
        ]
        
        # اضافه کردن جملات مرتبط با دانش پایه
        for category, keywords in self.knowledge_base.items():
            if any(keyword in topic for keyword in keywords):
                expansions.extend([
                    f"در حوزه {category}، {topic} نقش کلیدی ایفا می‌کند.",
                    f"توسعه {topic} در {category} شتاب قابل توجهی یافته است."
                ])
        
        return expansions
    
    def _evaluate_content_quality(self, content, style_config):
        """ارزیابی کیفیت محتوا"""
        words = content.split()
        sentences = content.split('.')
        
        # معیارهای کیفیت
        word_count_score = min(10, len(words) / 10)
        sentence_variety = len(set(len(s.split()) for s in sentences if s.strip())) / len(sentences) if sentences else 0
        complexity_score = len([w for w in words if len(w) > 6]) / len(words) if words else 0
        
        # تطابق با سبک
        style_match = sum(1 for phrase in style_config['phrases'] if phrase in content) / len(style_config['phrases'])
        
        quality = (word_count_score * 0.3 + sentence_variety * 0.3 + complexity_score * 0.2 + style_match * 0.2) * 10
        
        return min(10, max(5, quality))
    
    def _analyze_final_content(self, content_sections, quality_indicators):
        """تحلیل نهایی محتوا"""
        all_text = ' '.join(content_sections.values())
        words = all_text.split()
        sentences = [s.strip() for s in all_text.split('.') if s.strip()]
        
        return {
            'total_sections': len(content_sections),
            'total_words': len(words),
            'total_sentences': len(sentences),
            'unique_words': len(set(words)),
            'avg_sentence_length': len(words) / len(sentences) if sentences else 0,
            'readability_score': self._calculate_readability(all_text),
            'coherence_rating': sum(quality_indicators) / len(quality_indicators),
            'keyword_density': self._calculate_keyword_density(all_text, words),
            'structure_score': self._evaluate_structure(content_sections)
        }
    
    def _calculate_readability(self, text):
        """محاسبه امتیاز خوانایی"""
        words = text.split()
        sentences = text.split('.')
        
        if not words or not sentences:
            return 0
        
        avg_sentence_length = len(words) / len(sentences)
        avg_word_length = sum(len(word) for word in words) / len(words)
        
        readability = 100 - (avg_sentence_length + avg_word_length * 2)
        return max(0, min(100, readability))
    
    def _calculate_keyword_density(self, text, words):
        """محاسبه تراکم کلمات کلیدی"""
        if not words:
            return {}
        
        keyword_candidates = [word for word in words if len(word) > 4]
        keyword_freq = {}
        
        for keyword in set(keyword_candidates):
            density = keyword_candidates.count(keyword) / len(words) * 100
            if density > 1.0:  # فقط کلمات با تراکم بالای ۱٪
                keyword_freq[keyword] = round(density, 2)
        
        return dict(sorted(keyword_freq.items(), key=lambda x: x[1], reverse=True)[:5])
    
    def _evaluate_structure(self, content_sections):
        """ارزیابی ساختار محتوا"""
        section_lengths = [len(content.split()) for content in content_sections.values()]
        avg_length = sum(section_lengths) / len(section_lengths)
        
        # بررسی توازن بخش‌ها
        balance_score = 1 - (max(section_lengths) - min(section_lengths)) / avg_length if avg_length > 0 else 0
        
        return max(0, min(10, balance_score * 10))
    
    def _generate_recommendations(self, analysis):
        """تولید توصیه‌های بهبود"""
        recommendations = []
        
        if analysis['readability_score'] < 60:
            recommendations.append("🔄 بهبود خوانایی با استفاده از جملات کوتاه‌تر")
        
        if analysis['coherence_rating'] < 7:
            recommendations.append("🔗 افزایش انسجام بین بخش‌های مختلف")
        
        if analysis['structure_score'] < 7:
            recommendations.append("📐 بازبینی توازن طول بخش‌ها")
        
        if not recommendations:
            recommendations.append("✅ محتوای تولید شده از کیفیت مطلوبی برخوردار است")
        
        return recommendations
    
    def _display_generation_results(self, result):
        """نمایش نتایج تولید"""
        print(f"\n🎉 تولید محتوا با موفقیت انجام شد!")
        print(f"📦 شناسه محتوا: {result['metadata']['content_id']}")
        print(f"📊 آمار نهایی:")
        print(f"   📝 کلمات تولید شده: {result['metadata']['actual_words']}")
        print(f"   🎯 نرخ تکمیل: {result['metadata']['completion_rate']:.1f}%")
        print(f"   ⭐ کیفیت کلی: {result['metadata']['overall_quality']:.1f}/10")
        
        print(f"\n📈 تحلیل محتوا:")
        analysis = result['analysis']
        print(f"   🔢 بخش‌ها: {analysis['total_sections']}")
        print(f"   📚 جملات: {analysis['total_sentences']}")
        print(f"   📖 خوانایی: {analysis['readability_score']:.1f}%")
        print(f"   🧩 انسجام: {analysis['coherence_rating']:.1f}/10")
        
        print(f"\n💡 توصیه‌ها:")
        for rec in result['recommendations']:
            print(f"   {rec}")
    
    def export_content(self, content_data, format_type='json'):
        """صدور محتوا به فرمت‌های مختلف"""
        filename = f"{content_data['metadata']['content_id']}.{format_type}"
        filepath = self.export_dir / filename
        
        if format_type == 'json':
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(content_data, f, ensure_ascii=False, indent=2)
        elif format_type == 'txt':
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(f"موضوع: {content_data['metadata']['topic']}\n")
                f.write(f"قالب: {content_data['metadata']['template']}\n")
                f.write(f"سبک: {content_data['metadata']['style']}\n")
                f.write("=" * 50 + "\n\n")
                for section, text in content_data['content'].items():
                    f.write(f"{section}:\n{text}\n\n")
        
        print(f"💾 محتوا در فایل '{filename}' ذخیره شد")
        return filepath
    
    def get_production_stats(self):
        """آمار تولید محتوا"""
        if not self.content_history:
            return {'total_productions': 0}
        
        total_words = sum(item['metadata']['actual_words'] for item in self.content_history)
        avg_quality = sum(item['metadata']['overall_quality'] for item in self.content_history) / len(self.content_history)
        
        return {
            'total_productions': len(self.content_history),
            'total_words_generated': total_words,
            'average_quality': avg_quality,
            'most_used_template': max(set(item['metadata']['template'] for item in self.content_history), 
                                    key=lambda x: list(item['metadata']['template'] for item in self.content_history).count(x)),
            'first_production': self.content_history[0]['metadata']['generated_at']
        }

print("🧠 هوش نگار - نسخه سازمانی کامل")
print("=" * 60)

writer = EnterpriseIntelligentWriter()

# تولید محتوای نمونه
print("🧪 تولید محتوای نمونه:")
content1 = writer.generate_comprehensive_content(
    topic="هوش مصنوعی در تشخیص بیماری‌ها",
    template_type="report",
    style="علمی",
    target_words=400
)

print("\n" + "=" * 60)
print("🧪 تولید محتوای دوم:")
content2 = writer.generate_comprehensive_content(
    topic="داستان سفر به مریخ",
    template_type="story", 
    style="خلاقانه",
    target_words=300
)

# ذخیره فایل
print("\n💾 ذخیره محتوا:")
saved_file = writer.export_content(content1, 'json')
writer.export_content(content2, 'txt')

print("\n📊 آمار سیستم:")
stats = writer.get_production_stats()
print(f"   📈 تعداد تولیدات: {stats['total_productions']}")
print(f"   📝 کل کلمات تولید شده: {stats['total_words_generated']}")
print(f"   ⭐ میانگین کیفیت: {stats['average_quality']:.1f}/10")
print(f"   🎯 پرکاربردترین قالب: {stats['most_used_template']}")

print(f"\n🎉 سیستم هوش نگار با موفقیت فعال شد!")
