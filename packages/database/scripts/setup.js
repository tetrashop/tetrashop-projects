import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);
const dbPath = path.join(__dirname, '../tetrasaas.db');

async function setupDatabase() {
  console.log('🚀 شروع راه‌اندازی دیتابیس TetraSaaS...');
  
  // حذف دیتابیس قدیمی
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🗑️ دیتابیس قدیمی حذف شد');
  }

  // دستورات SQL برای ایجاد دیتابیس
  const sqlCommands = `
-- ایجاد جداول
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  endpoint_path TEXT,
  price_per_call REAL DEFAULT 0.0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tenant_id TEXT UNIQUE NOT NULL,
  rate_limit INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT 1,
  last_used DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credit_balances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT UNIQUE NOT NULL,
  balance REAL DEFAULT 0.0,
  total_spent REAL DEFAULT 0.0,
  last_top_up DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_key_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  input_data TEXT,
  output_data TEXT,
  status TEXT DEFAULT 'SUCCESS',
  error_message TEXT,
  duration_ms INTEGER,
  cost REAL,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

-- درج سرویس‌ها
INSERT OR IGNORE INTO services (slug, name, category, icon, price_per_call, description) VALUES
  ('image-enhancement', 'بهبود تصویر', 'بینایی کامپیوتر', '👁️', 100, 'افزایش کیفیت، رزولوشن و وضوح تصاویر'),
  ('object-detection', 'تشخیص اشیاء', 'بینایی کامپیوتر', '📦', 120, 'تشخیص و دسته‌بندی اشیاء در تصویر'),
  ('face-recognition', 'تشخیص چهره', 'بینایی کامپیوتر', '👤', 150, 'تشخیص و شناسایی چهره افراد'),
  ('image-generation', 'تولید تصویر', 'بینایی کامپیوتر', '🎨', 200, 'خلق تصویر از توصیف متنی با هوش مصنوعی'),
  ('audio-enhancement', 'بهبود صدا', 'پردازش صوت', '🎵', 80, 'حذف نویز و افزایش کیفیت فایل صوتی'),
  ('speech-to-text', 'تشخیص گفتار', 'پردازش صوت', '🗣️', 110, 'تبدیل صوت به متن با دقت بالا'),
  ('text-to-speech', 'سنتز صدا', 'پردازش صوت', '🔊', 90, 'تبدیل متن به گفتار طبیعی'),
  ('audio-classification', 'دسته‌بندی صدا', 'پردازش صوت', '🏷️', 70, 'تشخیص نوع و منبع صدا'),
  ('sentiment-analysis', 'تحلیل احساسات', 'NLP', '😊', 60, 'تشخیص احساس مثبت، منفی یا خنثی در متن'),
  ('text-summarization', 'خلاصه‌سازی متن', 'NLP', '📝', 75, 'خلاصه‌سازی خودکار متون طولانی'),
  ('language-translation', 'ترجمه ماشینی', 'NLP', '🌐', 95, 'ترجمه متن بین زبان‌های مختلف'),
  ('chatbot', 'چتبات هوشمند', 'NLP', '🤖', 130, 'پاسخگویی خودکار به سوالات کاربران'),
  ('text-generation', 'تولید متن', 'NLP', '✍️', 140, 'تولید متن خلاقانه بر اساس prompt'),
  ('ner', 'تشخیص موجودیت‌ها', 'NLP', '🏢', 85, 'تشخیص نام افراد، مکان‌ها و سازمان‌ها در متن'),
  ('data-analysis', 'تحلیل داده', 'علم داده', '📊', 100, 'آنالیز و کشف الگو در داده‌های ساختاریافته'),
  ('predictive-modeling', 'مدل‌سازی پیش‌بین', 'علم داده', '🔮', 180, 'ساخت مدل برای پیش‌بینی روند آینده'),
  ('anomaly-detection', 'تشخیص ناهنجاری', 'علم داده', '⚠️', 120, 'تشخیص داده‌های غیرعادی و outlier'),
  ('recommendation', 'سیستم پیشنهاد', 'علم داده', '💡', 110, 'تولید پیشنهادات شخصی‌سازی شده'),
  ('market-prediction', 'پیش‌بینی بازار', 'مالی', '📈', 250, 'تحلیل روند بازارهای مالی با هوش مصنوعی'),
  ('cyber-security', 'امنیت سایبری', 'امنیت', '🛡️', 160, 'شناخت تهدیدات و تحلیل امنیتی'),
  ('medical-diagnosis', 'تشخیص پزشکی', 'سلامت', '🏥', 300, 'کمک به تحلیل داده‌های پزشکی'),
  ('autonomous-vehicle', 'خودروی خودران', 'خودرو', '🚗', 280, 'پردازش داده‌های حسگر برای ناوبری'),
  ('iot-analytics', 'تحلیل اینترنت اشیا', 'IoT', '📡', 130, 'آنالیز داده‌های دستگاه‌های متصل'),
  ('weather-forecast', 'پیش‌بینی هوا', 'هواشناسی', '⛅', 90, 'تحلیل داده‌های هواشناسی با ML'),
  ('genetic-analysis', 'تحلیل ژنتیک', 'زیست‌فناوری', '🧬', 320, 'پردازش داده‌های ژنومی'),
  ('3d-rendering', 'رندر سه‌بعدی', 'گرافیک', '🎭', 220, 'تبدیل مدل‌های 3D به تصویر');

-- درج API Key نمونه
INSERT OR IGNORE INTO api_keys (api_key, name, tenant_id, rate_limit) VALUES
  ('ts_live_sample_' || substr(hex(randomblob(16)), 1, 32), 'کلید نمونه برای تست', 'tenant_dev_' || strftime('%s', 'now'), 1000);

-- درج موجودی اولیه
INSERT OR IGNORE INTO credit_balances (tenant_id, balance) 
SELECT tenant_id, 50000 
FROM api_keys 
WHERE name = 'کلید نمونه برای تست';
`;

  // اجرای دستورات SQL
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    // ایجاد فایل موقت SQL
    const tempFile = path.join(__dirname, 'temp_setup.sql');
    fs.writeFileSync(tempFile, sqlCommands);
    
    // اجرای SQLite
    await execAsync(`sqlite3 ${dbPath} < ${tempFile}`);
    
    // حذف فایل موقت
    fs.unlinkSync(tempFile);
    
    console.log('✅ دیتابیس با موفقیت ایجاد شد!');
    console.log('📍 مسیر دیتابیس:', dbPath);
    
    // نمایش اطلاعات
    await execAsync(`sqlite3 ${dbPath} "SELECT COUNT(*) as total_services FROM services;"`);
    await execAsync(`sqlite3 ${dbPath} "SELECT api_key FROM api_keys LIMIT 1;"`);
    await execAsync(`sqlite3 ${dbPath} "SELECT tenant_id, balance FROM credit_balances LIMIT 1;"`);
    
  } catch (error) {
    console.error('❌ خطا در ایجاد دیتابیس:', error.message);
  }
}

setupDatabase();
