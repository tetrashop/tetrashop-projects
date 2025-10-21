# intelligent_writer_pro.py - نسخه پیشرفته
import flask
from flask import Flask, render_template, request, jsonify, send_file
import os
from datetime import datetime
import json

app = Flask(__name__)

class IntelligentWriterPro:
    def __init__(self):
        self.content_history = []
    
    def generate_content(self, topic, content_type, style):
        # شبیه‌سازی تولید محتوا با AI
        templates = {
            "مقاله وبلاگ": self.generate_blog_template(topic),
            "پست شبکه اجتماعی": self.generate_social_media_template(topic),
            "ایمیل": self.generate_email_template(topic),
            "گزارش": self.generate_report_template(topic),
            "محصول": self.generate_product_template(topic)
        }
        
        return {
            'status': 'success',
            'content': templates.get(content_type, self.generate_default_template(topic)),
            'timestamp': datetime.now().isoformat(),
            'word_count': len(templates.get(content_type, '').split())
        }
    
    def generate_blog_template(self, topic):
        return f"""
# {topic}

## مقدمه
در این مقاله به بررسی جامع {topic} می‌پردازیم. این موضوع در دنیای امروز از اهمیت ویژه‌ای برخوردار است.

## بخش اصلی
تحقیقات نشان می‌دهد که {topic} تاثیر قابل توجهی در صنعت دارد. در ادامه به جنبه‌های مختلف می‌پردازیم.

### مزایای کلیدی:
- افزایش کارایی و بهره‌وری
- کاهش هزینه‌های عملیاتی
- بهبود تجربه کاربری

## نتیجه‌گیری
با توجه به تحلیل‌های انجام شده، {topic} نقش مهمی در آینده خواهد داشت.
        """
    
    def generate_social_media_template(self, topic):
        return f"""
🎯 {topic}

✨ آیا می‌دانستید که {topic} می‌تواند زندگی شما را متحول کند؟

✅ مزیت اول: صرفه‌جویی در زمان
✅ مزیت دوم: افزایش بهره‌وری
✅ مزیت سوم: کاهش هزینه‌ها

💬 نظر شما چیست؟ در کامنت‌ها بنویسید!

#{topic.replace(' ', '')} #موفقیت #تکنولوژی
        """

    def generate_email_template(self, topic):
        return f"""
موضوع: اطلاعات مهم درباره {topic}

سلام،

امروز می‌خواهیم در مورد {topic} با شما صحبت کنیم.

این موضوع می‌تواند برای کسب و کار شما بسیار مفید باشد.

با احترام،
تیم پشتیبانی
        """
    
    def generate_report_template(self, topic):
        return f"""
گزارش تحلیلی: {topic}

تاریخ: {datetime.now().strftime('%Y-%m-%d')}

خلاصه اجرایی:
این گزارش به بررسی {topic} می‌پردازد.

یافته‌های کلیدی:
1. مورد اول
2. مورد دوم
3. مورد سوم

توصیه‌ها:
- اقدام اول
- اقدام دوم
        """
    
    def generate_product_template(self, topic):
        return f"""
معرفی محصول: {topic}

ویژگی‌های اصلی:
🔹 ویژگی منحصر به فرد اول
🔹 قابلیت ویژه دوم
🔹 مزیت رقابتی سوم

مشخصات فنی:
- مشخصه اول
- مشخصه دوم

کاربردها:
• کاربرد اول
• کاربرد دوم
        """
    
    def generate_default_template(self, topic):
        return f"""
محتوای تولید شده برای: {topic}

این یک محتوای استاندارد درباره {topic} است که توسط سیستم هوشمند تولید شده است.

می‌توانید این محتوا را ویرایش و شخصی‌سازی کنید.
        """

writer = IntelligentWriterPro()

@app.route('/')
def home():
    return render_template('index.html', 
                         title='Intelligent Writer Pro',
                         version='نسخه پیشرفته')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    topic = data.get('topic', '')
    content_type = data.get('content_type', 'مقاله وبلاگ')
    style = data.get('style', 'رسمی')
    
    if not topic:
        return jsonify({'status': 'error', 'message': 'موضوع را وارد کنید'})
    
    result = writer.generate_content(topic, content_type, style)
    return jsonify(result)

@app.route('/templates')
def get_templates():
    templates = [
        {"id": "blog", "name": "مقاله وبلاگ", "description": "قالب استاندارد برای مقالات وبلاگ"},
        {"id": "social", "name": "پست شبکه اجتماعی", "description": "پست‌های کوتاه و جذاب"},
        {"id": "email", "name": "ایمیل", "description": "قالب ایمیل‌های رسمی و غیررسمی"},
        {"id": "report", "name": "گزارش", "description": "گزارش‌های ساختاریافته"},
        {"id": "product", "name": "محصول", "description": "معرفی محصولات و خدمات"}
    ]
    return jsonify(templates)

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'Intelligent Writer Pro'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
