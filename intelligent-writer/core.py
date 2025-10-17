print("🧠 هوش نگار - تولید محتوای هوشمند")

class IntelligentWriter:
    def create_content(self, topic):
        return f"محتوای هوشمند درباره {topic}"
    
    def analyze(self, text):
        return {"کلمات": len(text.split())}

writer = IntelligentWriter()
print(writer.create_content("یادگیری ماشین"))
print(writer.analyze("این یک متن نمونه است"))
