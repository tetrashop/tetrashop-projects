"""
🧠 هوش نگار - سیستم تولید محتوای هوشمند
"""

class IntelligentWriter:
    def __init__(self):
        self.templates = ['گزارش', 'مقاله', 'داستان']
    
    def generate_content(self, topic, template):
        return f"محتوای {template} درباره {topic}"

system = IntelligentWriter()
result = system.generate_content("هوش مصنوعی", "مقاله")
print("🧠 هوش نگار فعال شد")
print(f"✅ نتیجه: {result}")
