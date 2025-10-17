print("🗣️ نطق مصطلح")
print("پردازش گفتار و اصطلاحات فارسی")

class SpeechProcessor:
    def process(self, text):
        return f"پردازش شده: {text}"
    
processor = SpeechProcessor()
print(processor.process("سلام بر همه"))
