from flask import Flask, render_template, request, jsonify
import os
import json
from datetime import datetime

app = Flask(__name__)

class IntelligentWriterPro:
    def __init__(self):
        self.templates = {
            "مقاله وبلاگ": {"words": 800, "style": "رسمی"},
            "پست شبکه اجتماعی": {"words": 150, "style": "خودمانی"},
            "ایمیل بازاریابی": {"words": 300, "style": "تبلیغاتی"},
            "گزارش فنی": {"words": 1200, "style": "آکادمیک"},
            "محتوای محصول": {"words": 500, "style": "تبلیغاتی"}
        }
    
    def generate_content(self, topic, content_type, style, language="fa"):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
        
        content_templates = {
            "مقاله وبلاگ": f"""# {topic}

## مقدمه
در این مقاله جامع به بررسی {topic} می‌پردازیم. با توجه به اهمیت روزافزون این موضوع، در ادامه جنبه‌های مختلف آن را تحلیل خواهیم کرد.

## مزایای کلیدی
- **کارایی بالا**: بهبود قابل توجه در روندهای موجود
- **صرفه‌جویی اقتصادی**: کاهش هزینه‌ها و افزایش بهره‌وری
- **تجربه کاربری**: ارتقاء کیفیت خدمات و محصولات

## کاربردهای عملی
در حوزه‌های مختلف، {topic} کاربردهای متعددی دارد که می‌توان به موارد زیر اشاره کرد:

### در کسب‌وکار
- اتوماسیون فرآیندها
- تحلیل داده‌های بزرگ
- بهینه‌سازی استراتژی‌ها

## نتیجه‌گیری
با توجه به تحلیل‌های ارائه شده، {topic} نقش حیاتی در آینده صنایع خواهد داشت.

---
*تولید شده توسط Intelligent Writer Pro - {timestamp}*
""",
            
            "پست شبکه اجتماعی": f"""🎯 **{topic}** - تحولی شگفت‌انگیز! ✨

آیا می‌دانستید {topic} می‌تواند زندگی شما را متحول کند؟ 🤔

✅ **مزیت اول**: صرفه‌جویی در زمان و انرژی
✅ **مزیت دوم**: افزایش بهره‌وری و کارایی  
✅ **مزیت سوم**: کاهش هزینه‌ها و اتلاف منابع

💡 **نکته طلایی**: از امروز شروع کنید!

👇 نظر شما چیست؟ در کامنت‌ها به ما بگویید...

#{topic.replace(' ', '')} #تکنولوژی #موفقیت
📅 {timestamp}
""",
            
            "ایمیل بازاریابی": f"""موضوع: فرصت استثنایی در زمینه {topic}

سلام،

ما مفتخریم که سرویس جدید خود در زمینه **{topic}** را به شما معرفی کنیم.

**مزایای اصلی:**
🔸 صرفه‌جویی تا ۴۰٪ در هزینه‌ها
🔸 افزایش ۶۰٪ی بهره‌وری
🔸 پشتیبانی ۲۴ ساعته

📞 برای اطلاعات بیشتر با ما تماس بگیرید.

با احترام،
تیم Intelligent Writer Pro

---
تاریخ: {timestamp}
"""
        }
        
        return content_templates.get(content_type, f"# {topic}\n\nمحتوای تولید شده برای {topic}\n\n---\n*تولید شده در {timestamp}*")

writer = IntelligentWriterPro()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/generate', methods=['POST'])
def generate_content():
    try:
        data = request.get_json()
        topic = data.get('topic', '').strip()
        content_type = data.get('content_type', 'مقاله وبلاگ')
        style = data.get('style', 'رسمی')
        
        if not topic:
            return jsonify({
                'status': 'error',
                'message': 'لطفاً موضوع محتوا را وارد کنید'
            }), 400
        
        content = writer.generate_content(topic, content_type, style)
        
        return jsonify({
            'status': 'success',
            'content': content,
            'word_count': len(content.split()),
            'timestamp': datetime.now().isoformat(),
            'content_type': content_type
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'خطا در تولید محتوا: {str(e)}'
        }), 500

@app.route('/api/templates')
def get_templates():
    return jsonify(writer.templates)

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'Intelligent Writer Pro'})

if __name__ == '__main__':
    print("🚀 Intelligent Writer Pro Running on: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
