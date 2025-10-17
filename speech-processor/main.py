print("🗣️ نطق مصطلح - پردازش گفتار فارسی")

class SpeechProcessor:
    def process(self, text):
        return f"پردازش شده: {text}"
    
    def find_phrases(self, text):
        return ["سلام", "تشکر"]

processor = SpeechProcessor()
print(processor.process("سلام بر همه"))
print(processor.find_phrases("سلام و تشکر"))
