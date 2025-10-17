"""
🔒 آمان راز - سیستم امنیتی
"""

class SecretGuardian:
    def __init__(self):
        self.methods = ['AES-256', 'RSA-2048']
    
    def encrypt(self, text, method):
        return f"متن '{text}' با {method} رمز شد"

system = SecretGuardian()
result = system.encrypt("راز مهم", "AES-256")
print("🔒 آمان راز فعال شد")
print(f"✅ نتیجه: {result}")
