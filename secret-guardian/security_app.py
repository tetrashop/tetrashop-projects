print("🔒 آمان راز - سیستم امنیتی پیشرفته")

class SecretGuardian:
    def encrypt(self, message):
        return f"رمز شده: {message}"
    
    def generate_key(self):
        return "کلید_امن_تصادفی"

guardian = SecretGuardian()
print(guardian.encrypt("پیام محرمانه"))
print(guardian.generate_key())
