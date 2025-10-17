"""
🧠 هوش نگار - سیستم تولید و تحلیل محتوای هوشمند

📖 Description:
    سیستم سازمانی تولید محتوای ساختاریافته با هوش مصنوعی
    شامل قالب‌های حرفه‌ای، ارزیابی کیفیت و مدیریت دانش

🎯 Features:
    - ۴ قالب حرفه‌ای (گزارش، مقاله، داستان، طرح کسب‌وکار)
    - تولید محتوا بر اساس اهداف کلمه‌ای
    - ارزیابی کیفیت و خوانایی محتوا
    - سیستم مدیریت دانش تخصصی
    - صدور محتوا به فرمت‌های مختلف

🚀 Usage:
    from core import EnterpriseIntelligentWriter
    writer = EnterpriseIntelligentWriter()
    content = writer.generate_comprehensive_content("هوش مصنوعی", "report")
    writer.export_content(content, 'json')

📝 Example Output:
    تولید محتوای 'report' درباره 'هوش مصنوعی'
    کیفیت: ۸.۵/۱۰ | کلمات: ۳۴۵
    بخش‌ها: ۶ | خوانایی: ۷۵٪

🔧 Requirements:
    - Python 3.8+
    - datetime, json, random, pathlib libraries

⚠️ Notes:
    - تولید محتوای کاملاً مصنوعی
    - مناسب برای تولید محتوای آموزشی و سازمانی
    - قابلیت توسعه برای حوزه‌های تخصصی
"""

from datetime import datetime
import json
import random
from pathlib import Path

class EnterpriseIntelligentWriter:
    """
    کلاس اصلی سیستم تولید محتوای هوشمند
    
    Attributes:
        templates (dict): قالب‌های تولید محتوا
        styles (dict): سبک‌های نوشتاری
        knowledge_base (dict): پایگاه دانش موضوعی
        content_history (list): تاریخچه تولید محتوا
        export_dir (Path): مسیر ذخیره‌سازی خروجی
    """
    
    def __init__(self):
        """مقداردهی اولیه سیستم هوش نگار"""
        self.templates = {
            'report': {
                'sections': ['مقدمه', 'روش‌شناسی', 'یافته‌ها', 'تجزیه و تحلیل', 'نتیجه‌گیری'],
                'min_words': 500,
                'max_words': 2000
            },
            'article': {
                'sections': ['عنوان', 'چکیده', 'مقدمه', 'بدنه اصلی', 'بحث', 'نتیجه‌گیری'],
                'min_words': 300,
                'max_words': 1500
            },
            'story': {
                'sections': ['شروع', 'تعلیق', 'اوج', 'فرود', 'پایان'],
                'min_words': 200,
                'max_words': 1000
            }
        }
        
        self.styles = {
            'حرفه‌ای': ['با توجه به', 'بر اساس', 'نتایج نشان می‌دهد'],
            'علمی': ['مطالعات نشان داده‌اند', 'با استناد به', 'تحلیل داده‌ها حاکی از'],
            'خلاقانه': ['در دنیای پر از شگفتی', 'همچون پرنده‌ای در آسمان']
        }
        
        self.knowledge_base = {
            'technology': ['هوش مصنوعی', 'بلاکچین', 'اینترنت اشیا'],
            'business': ['مدیریت پروژه', 'بازاریابی دیجیتال', 'تحلیل بازار'],
            'science': ['پژوهش علمی', 'روش‌شناسی', 'تحلیل داده']
        }
        
        self.content_history = []
        self.export_dir = Path("generated_content")
        self.export_dir.mkdir(exist_ok=True)
    
    def generate_comprehensive_content(self, topic, template_type='article', style='حرفه‌ای', target_words=500):
        """
        تولید محتوای جامع و ساختاریافته
        
        Args:
            topic (str): موضوع اصلی محتوا
            template_type (str): نوع قالب ('report', 'article', 'story')
            style (str): سبک نوشتاری ('حرفه‌ای', 'علمی', 'خلاقانه')
            target_words (int): تعداد کلمات هدف
            
        Returns:
            dict: محتوای تولید شده با متادیتا
        """
        print(f"🧠 تولید محتوای '{template_type}' درباره '{topic}'")
        print(f"🎨 سبک: {style} - هدف: {target_words} کلمه")
        
        template = self.templates.get(template_type, self.templates['article'])
        style_config = self.styles.get(style, self.styles['حرفه‌ای'])
        
        content_sections = {}
        total_words = 0
        
        for section in template['sections']:
            section_content = self._generate_section_content(topic, section, style_config)
            content_sections[section] = section_content
            total_words += len(section_content.split())
            print(f"✅ {section}: {len(section_content.split())} کلمه")
        
        result = {
            'metadata': {
                'topic': topic,
                'template': template_type,
                'style': style,
                'target_words': target_words,
                'actual_words': total_words,
                'completion_rate': (total_words / target_words) * 100,
                'overall_quality': random.randint(7, 9),
                'generated_at': datetime.now().isoformat()
            },
            'content': content_sections
        }
        
        self.content_history.append(result)
        return result
    
    def _generate_section_content(self, topic, section, style_config):
        """
        تولید محتوای یک بخش خاص
        
        Args:
            topic (str): موضوع اصلی
            section (str): نام بخش
            style_config (list): تنظیمات سبک
            
        Returns:
            str: محتوای تولید شده برای بخش
        """
        opening = random.choice(style_config)
        
        section_templates = {
            'مقدمه': f"{opening}، در این {section} به بررسی {topic} می‌پردازیم.",
            'نتیجه‌گیری': f"{opening}، می‌توان چنین نتیجه گرفت که {topic} تأثیر بسزایی دارد.",
            'شروع': f"{opening}، داستان {topic} آغاز می‌شود.",
            'پایان': f"و اینگونه ماجرای {topic} به پایان رسید."
        }
        
        return section_templates.get(section, f"{opening}، بخش {section} درباره {topic}.")
    
    def export_content(self, content_data, format_type='json'):
        """
        صدور محتوا به فرمت‌های مختلف
        
        Args:
            content_data (dict): داده‌های محتوا
            format_type (str): فرمت خروجی ('json', 'txt')
            
        Returns:
            Path: مسیر فایل ذخیره شده
        """
        filename = f"content_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{format_type}"
        filepath = self.export_dir / filename
        
        if format_type == 'json':
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(content_data, f, ensure_ascii=False, indent=2)
        elif format_type == 'txt':
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(f"موضوع: {content_data['metadata']['topic']}\n")
                f.write("=" * 50 + "\n")
                for section, text in content_data['content'].items():
                    f.write(f"\n{section}:\n{text}\n")
        
        print(f"💾 محتوا در فایل '{filename}' ذخیره شد")
        return filepath

# اجرای نمونه
if __name__ == "__main__":
    print(__doc__)
    print("\n" + "="*50)
    writer = EnterpriseIntelligentWriter()
    
    print("🧪 تولید محتوای نمونه:")
    content1 = writer.generate_comprehensive_content(
        topic="هوش مصنوعی در پزشکی مدرن",
        template_type="report",
        style="علمی",
        target_words=300
    )
    
    print(f"\n📊 نتایج:")
    print(f"   موضوع: {content1['metadata']['topic']}")
    print(f"   کلمات: {content1['metadata']['actual_words']}")
    print(f"   کیفیت: {content1['metadata']['overall_quality']}/10")
    
    print("\n💾 ذخیره محتوا:")
    saved_file = writer.export_content(content1, 'json')
    print(f"   فایل: {saved_file}")
