print("🔒 آمان راز")
print("سیستم رمزنگاری و امنیت")

class SecretGuardian:
    def encrypt(self, message):
        return f"رمز شده: {message}"
    
guardian = SecretGuardian()
print(guardian.encrypt("پیام محرمانه"))
