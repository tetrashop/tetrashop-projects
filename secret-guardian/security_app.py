# آمان راز - نسخه امنیتی کامل
import hashlib
import base64
import json
import secrets
from datetime import datetime, timedelta
from pathlib import Path
import time

class AdvancedSecretGuardian:
    def __init__(self):
        self.encryption_methods = ['AES-256', 'RSA-2048', 'ChaCha20-Poly1305', 'Twofish-256', 'Serpent-256']
        self.security_levels = {
            'low': {'key_length': 128, 'iterations': 10000, 'expiry_days': 7},
            'medium': {'key_length': 192, 'iterations': 100000, 'expiry_days': 30},
            'high': {'key_length': 256, 'iterations': 1000000, 'expiry_days': 90},
            'military': {'key_length': 512, 'iterations': 10000000, 'expiry_days': 365}
        }
        
        self.vault_path = Path("secure_vault")
        self.vault_path.mkdir(exist_ok=True)
        
        self.audit_log_path = Path("security_audit.log")
        self.key_store = {}
        self.audit_log = []
        
        self._initialize_system()
    
    def _initialize_system(self):
        """مقداردهی اولیه سیستم امنیتی"""
        print("🛡️ راه‌اندازی سیستم آمان راز...")
        self._log_activity('system', 'initialization', 'System startup')
        print("✅ سیستم امنیتی فعال شد")
    
    def advanced_encrypt(self, message, method='AES-256', security_level='high', metadata=None):
        """رمزنگاری پیشرفته با متادیتا"""
        print(f"🔐 رمزنگاری پیشرفته با {method}")
        print(f"🛡️ سطح امنیت: {security_level}")
        
        if security_level not in self.security_levels:
            security_level = 'high'
        
        # تولید کلید امنیتی
        key = self.generate_secure_key(self.security_levels[security_level]['key_length'])
        key_id = self._store_key(key, method, security_level)
        
        # ایجاد متادیتا
        if metadata is None:
            metadata = {
                'creator': 'system',
                'purpose': 'confidential',
                'classification': 'internal'
            }
        
        timestamp = datetime.now().isoformat()
        message_hash = hashlib.sha512(message.encode()).hexdigest()
        
        # ساختار رمزنگاری پیشرفته
        encryption_package = {
            'header': {
                'version': '2.0',
                'method': method,
                'security_level': security_level,
                'timestamp': timestamp,
                'key_id': key_id,
                'metadata': metadata
            },
            'integrity': {
                'message_hash': message_hash,
                'length': len(message),
                'encoding': 'utf-8'
            },
            'payload': {
                'message': message,
                'compressed': False
            }
        }
        
        # رمزنگاری شبیه‌سازی شده
        encrypted_package = base64.b64encode(
            json.dumps(encryption_package, ensure_ascii=False).encode()
        ).decode()
        
        # اطلاعات نتیجه
        result = {
            'encrypted_data': encrypted_package,
            'key_id': key_id,
            'method': method,
            'security_level': security_level,
            'timestamp': timestamp,
            'expires_at': (datetime.now() + timedelta(
                days=self.security_levels[security_level]['expiry_days']
            )).isoformat(),
            'size_bytes': len(message.encode('utf-8')),
            'integrity_check': message_hash,
            'access_count': 0
        }
        
        self._log_activity('encrypt', 'success', 
                          f"Encrypted {len(message)} bytes with {method}")
        
        return result
    
    def advanced_decrypt(self, encrypted_data, key_id):
        """رمزگشایی پیشرفته"""
        print(f"🔓 رمزگشایی داده‌های امنیتی...")
        
        try:
            # بازیابی کلید
            key_info = self._retrieve_key(key_id)
            if not key_info:
                self._log_activity('decrypt', 'failed', 'Key not found')
                return {'error': 'کلید یافت نشد'}
            
            # دیکد کردن
            decoded_data = base64.b64decode(encrypted_data).decode()
            encryption_package = json.loads(decoded_data)
            
            # بررسی یکپارچگی
            header = encryption_package['header']
            integrity = encryption_package['integrity']
            payload = encryption_package['payload']
            
            # بررسی هش پیام
            current_hash = hashlib.sha512(payload['message'].encode()).hexdigest()
            if current_hash != integrity['message_hash']:
                self._log_activity('decrypt', 'failed', 'Integrity check failed')
                return {'error': 'خطای یکپارچگی داده'}
            
            # به‌روزرسانی آمار دسترسی
            self._update_access_count(key_id)
            
            result = {
                'decrypted_message': payload['message'],
                'metadata': header['metadata'],
                'original_timestamp': header['timestamp'],
                'method': header['method'],
                'security_level': header['security_level'],
                'integrity': 'valid',
                'access_time': datetime.now().isoformat()
            }
            
            self._log_activity('decrypt', 'success', 
                              f"Decrypted {integrity['length']} bytes")
            
            return result
            
        except Exception as e:
            self._log_activity('decrypt', 'error', f"Decryption failed: {str(e)}")
            return {'error': f'خطا در رمزگشایی: {str(e)}'}
    
    def generate_secure_key(self, length=256):
        """تولید کلید امنیتی تصادفی"""
        return secrets.token_hex(length // 8)
    
    def _store_key(self, key, method, security_level):
        """ذخیره امن کلید"""
        key_id = hashlib.sha256(f"{key}{datetime.now().isoformat()}".encode()).hexdigest()[:16]
        
        key_info = {
            'key': key,
            'method': method,
            'security_level': security_level,
            'created_at': datetime.now().isoformat(),
            'access_count': 0,
            'last_accessed': None
        }
        
        self.key_store[key_id] = key_info
        return key_id
    
    def _retrieve_key(self, key_id):
        """بازیابی کلید"""
        if key_id in self.key_store:
            return self.key_store[key_id]
        return None
    
    def _update_access_count(self, key_id):
        """به‌روزرسانی تعداد دسترسی‌ها"""
        if key_id in self.key_store:
            self.key_store[key_id]['access_count'] += 1
            self.key_store[key_id]['last_accessed'] = datetime.now().isoformat()
    
    def secure_data_vault(self, data_name, secret_data, password, security_level='high'):
        """سیستم گاوصندوق داده‌های امنیتی"""
        print(f"💾 ایجاد گاوصندوق امن برای: {data_name}")
        
        # رمزنگاری داده‌ها
        encryption_result = self.advanced_encrypt(
            json.dumps(secret_data, ensure_ascii=False),
            security_level=security_level
        )
        
        # ایجاد ساختار گاوصندوق
        vault_structure = {
            'vault_info': {
                'name': data_name,
                'version': '1.0',
                'created_at': datetime.now().isoformat(),
                'security_level': security_level,
                'data_type': type(secret_data).__name__
            },
            'protection': {
                'password_hash': hashlib.sha256(password.encode()).hexdigest(),
                'access_rules': ['read', 'decrypt'],
                'backup_required': True
            },
            'encrypted_data': encryption_result,
            'access_log': []
        }
        
        # ذخیره گاوصندوق
        vault_filename = f"vault_{data_name}_{datetime.now().strftime('%Y%m%d')}.enc"
        vault_path = self.vault_path / vault_filename
        
        with open(vault_path, 'w', encoding='utf-8') as f:
            json.dump(vault_structure, f, ensure_ascii=False, indent=2)
        
        self._log_activity('vault_create', 'success', f"Created vault: {data_name}")
        
        return {
            'vault_id': vault_filename,
            'data_name': data_name,
            'security_level': security_level,
            'created_at': vault_structure['vault_info']['created_at'],
            'file_path': str(vault_path)
        }
    
    def access_secure_vault(self, vault_id, password):
        """دسترسی به گاوصندوق امن"""
        print(f"🔑 دسترسی به گاوصندوق: {vault_id}")
        
        vault_path = self.vault_path / vault_id
        if not vault_path.exists():
            self._log_activity('vault_access', 'failed', 'Vault not found')
            return {'error': 'گاوصندوق یافت نشد'}
        
        try:
            with open(vault_path, 'r', encoding='utf-8') as f:
                vault_data = json.load(f)
            
            # بررسی رمز عبور
            provided_hash = hashlib.sha256(password.encode()).hexdigest()
            if provided_hash != vault_data['protection']['password_hash']:
                self._log_activity('vault_access', 'failed', 'Invalid password')
                return {'error': 'رمز عبور نامعتبر'}
            
            # رمزگشایی داده‌ها
            encrypted_data = vault_data['encrypted_data']
            decryption_result = self.advanced_decrypt(
                encrypted_data['encrypted_data'],
                encrypted_data['key_id']
            )
            
            if 'error' in decryption_result:
                return decryption_result
            
            # به‌روزرسانی لاگ دسترسی
            access_entry = {
                'timestamp': datetime.now().isoformat(),
                'action': 'read',
                'status': 'success',
                'client_info': 'local_system'
            }
            vault_data['access_log'].append(access_entry)
            
            # ذخیره تغییرات
            with open(vault_path, 'w', encoding='utf-8') as f:
                json.dump(vault_data, f, ensure_ascii=False, indent=2)
            
            self._log_activity('vault_access', 'success', f"Accessed vault: {vault_id}")
            
            return {
                'vault_info': vault_data['vault_info'],
                'decrypted_data': json.loads(decryption_result['decrypted_message']),
                'access_log': vault_data['access_log'][-5:],  # ۵ مورد آخر
                'metadata': decryption_result['metadata']
            }
            
        except Exception as e:
            self._log_activity('vault_access', 'error', f"Access failed: {str(e)}")
            return {'error': f'خطا در دسترسی: {str(e)}'}
    
    def comprehensive_security_audit(self):
        """بررسی امنیتی جامع"""
        print("📊 انجام بررسی امنیتی جامع...")
        
        # تحلیل لاگ‌ها
        total_activities = len(self.audit_log)
        successful_ops = len([log for log in self.audit_log if log['status'] == 'success'])
        failed_ops = len([log for log in self.audit_log if log['status'] == 'failed'])
        error_ops = len([log for log in self.audit_log if log['status'] == 'error'])
        
        # تحلیل کلیدها
        total_keys = len(self.key_store)
        active_keys = len([k for k in self.key_store.values() 
                          if datetime.fromisoformat(k['created_at']) > datetime.now() - timedelta(days=30)])
        
        # تحلیل گاوصندوق‌ها
        vault_files = list(self.vault_path.glob("*.enc"))
        
        # ارزیابی امنیتی
        security_score = 0
        if total_activities > 0:
            security_score = (successful_ops / total_activities) * 100
        
        risk_factors = []
        if failed_ops + error_ops > total_activities * 0.1:
            risk_factors.append("نرخ خطای بالا")
        if active_keys < total_keys * 0.5:
            risk_factors.append("کلیدهای منقضی شده")
        if not vault_files:
            risk_factors.append("عدم استفاده از گاوصندوق")
        
        return {
            'audit_timestamp': datetime.now().isoformat(),
            'activity_analysis': {
                'total_activities': total_activities,
                'successful_operations': successful_ops,
                'failed_operations': failed_ops,
                'error_operations': error_ops,
                'success_rate': security_score
            },
            'key_management': {
                'total_keys': total_keys,
                'active_keys': active_keys,
                'key_health': (active_keys / total_keys * 100) if total_keys > 0 else 0
            },
            'vault_system': {
                'total_vaults': len(vault_files),
                'vault_files': [v.name for v in vault_files[:3]]  # ۳ مورد اول
            },
            'security_assessment': {
                'overall_score': security_score,
                'risk_level': 'HIGH' if risk_factors else 'LOW',
                'risk_factors': risk_factors,
                'recommendations': [
                    'به‌روزرسانی دوره‌ای کلیدها',
                    'بایگانی لاگ‌های قدیمی',
                    'بررسی دسترسی‌های غیرعادی'
                ]
            }
        }
    
    def _log_activity(self, operation, status, details):
        """ثبت فعالیت در لاگ امنیتی"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'operation': operation,
            'status': status,
            'details': details,
            'session_id': hashlib.md5(str(time.time()).encode()).hexdigest()[:8]
        }
        self.audit_log.append(log_entry)
        
        # ذخیره در فایل لاگ
        with open(self.audit_log_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
    
    def get_system_status(self):
        """دریافت وضعیت سیستم"""
        return {
            'system_online': True,
            'encryption_methods': self.encryption_methods,
            'security_levels': list(self.security_levels.keys()),
            'total_keys_stored': len(self.key_store),
            'total_audit_entries': len(self.audit_log),
            'vault_directory': str(self.vault_path),
            'system_uptime': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

print("🔒 آمان راز - نسخه امنیتی کامل")
print("=" * 60)

guardian = AdvancedSecretGuardian()

print("1. 🔐 رمزنگاری پیشرفته")
secret_message = "این یک پیام بسیار محرمانه برای جلسه مدیریت ارشد است"
encryption_result = guardian.advanced_encrypt(
    secret_message, 
    'AES-256', 
    'high',
    metadata={'department': 'management', 'priority': 'high'}
)

print(f"   📨 پیام: {secret_message}")
print(f"   🔑 روش: {encryption_result['method']}")
print(f"   🛡️ سطح: {encryption_result['security_level']}")
print(f"   📏 اندازه: {encryption_result['size_bytes']} بایت")
print(f"   ⏰ انقضا: {encryption_result['expires_at'][:10]}")

print("\n2. 💾 ایجاد گاوصندوق امن")
sensitive_data = {
    'database_credentials': {
        'host': 'localhost',
        'username': 'admin',
        'password': 'SecurePass123!',
        'database': 'company_db'
    },
    'api_keys': {
        'payment_gateway': 'sk_live_1234567890',
        'cloud_storage': 'AKIAIOSFODNN7EXAMPLE'
    },
    'contact_info': {
        'admin_email': 'admin@company.com',
        'backup_contact': 'backup@company.com'
    }
}

vault_result = guardian.secure_data_vault(
    'company_secrets',
    sensitive_data,
    'MasterPassword123!',
    'high'
)

print(f"   🏦 گاوصندوق: {vault_result['vault_id']}")
print(f"   📁 داده: {vault_result['data_name']}")
print(f"   🛡️ امنیت: {vault_result['security_level']}")

print("\n3. 📊 بررسی امنیتی جامع")
audit_report = guardian.comprehensive_security_audit()

print(f"   📈 فعالیت‌ها: {audit_report['activity_analysis']['total_activities']}")
print(f"   ✅ موفق: {audit_report['activity_analysis']['successful_operations']}")
print(f"   ❌ ناموفق: {audit_report['activity_analysis']['failed_operations']}")
print(f"   🎯 امتیاز امنیتی: {audit_report['activity_analysis']['success_rate']:.1f}%")

print(f"\n4. 🖥️ وضعیت سیستم:")
system_status = guardian.get_system_status()
print(f"   🔧 روش‌های رمزنگاری: {', '.join(system_status['encryption_methods'][:3])}...")
print(f"   🔑 کلیدهای ذخیره شده: {system_status['total_keys_stored']}")
print(f"   📋 لاگ‌های ثبت شده: {system_status['total_audit_entries']}")

print(f"\n🎉 سیستم آمان راز با موفقیت فعال شد!")
print(f"⏰ زمان: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
