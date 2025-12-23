import { database } from './src/index.js';

async function simpleTest() {
  console.log('🧪 تست ساده ماژول دیتابیس با better-sqlite3\n');
  
  try {
    // تست ۱: بررسی اتصال
    console.log('1. 🔌 تست اتصال به دیتابیس...');
    const services = database.getAllServices();
    console.log(`   ✅ موفق! ${services.length} سرویس پیدا شد`);
    
    // تست ۲: نمایش چند سرویس
    console.log('\n2. 📋 نمایش ۳ سرویس اول:');
    services.slice(0, 3).forEach((s, i) => {
      console.log(`   ${i+1}. ${s.name} (${s.category}) - ${s.price_per_call} واحد`);
    });
    
    // تست ۳: بررسی دسته‌بندی‌ها
    console.log('\n3. 🗂️ دسته‌بندی‌های موجود:');
    const categories = database.getCategories();
    console.log(`   ${categories.map(c => c.category).join(', ')}`);
    
    // تست ۴: بررسی API Key
    console.log('\n4. 🔑 بررسی API Key نمونه:');
    const db = database.getRawDb();
    const apiKeys = db.prepare('SELECT * FROM api_keys LIMIT 1').all();
    
    if (apiKeys.length > 0) {
      console.log(`   ✅ API Key یافت شد: ${apiKeys[0].api_key.substring(0, 25)}...`);
      
      // تست ۵: اعتبارسنجی
      const validated = database.validateApiKey(apiKeys[0].api_key);
      if (validated) {
        console.log(`   👤 Tenant ID: ${validated.tenant_id}`);
        console.log(`   💰 موجودی: ${validated.balance} واحد`);
        
        // تست ۶: لاگ نمونه
        console.log('\n5. 📝 ایجاد لاگ نمونه...');
        const service = database.getServiceBySlug('sentiment-analysis');
        const logResult = database.logRequest(validated.id, service.id, {
          input: { text: 'این محصول عالی است!' },
          output: { sentiment: 'positive', score: 0.92 },
          status: 'SUCCESS'
        });
        console.log(`   ✅ لاگ ثبت شد (ID: ${logResult.lastInsertRowid})`);
      }
    }
    
    // تست ۷: ایجاد API Key جدید
    console.log('\n6. 🆕 ایجاد API Key جدید:');
    const newKey = database.createApiKey('تست توسعه', 'test_dev_' + Date.now(), 200);
    console.log(`   ✅ ایجاد شد: ${newKey.apiKey.substring(0, 25)}...`);
    console.log(`   👤 Tenant: ${newKey.tenantId}`);
    
    console.log('\n🎉 تمام تست‌ها با موفقیت انجام شد!');
    console.log('\n📊 خلاصه:');
    console.log(`   • دیتابیس: ${dbPath}`);
    console.log(`   • سرویس‌ها: ${services.length} مورد`);
    console.log(`   • دسته‌بندی‌ها: ${categories.length} مورد`);
    console.log(`   • وضعیت: ✅ عملیاتی و سازگار با Termux`);
    
  } catch (error) {
    console.error('\n❌ خطا در تست:', error.message);
    if (error.code) console.error(`   کد خطا: ${error.code}`);
    console.error('\nراه‌حل:');
    console.error('1. مطمئن شوید دیتابیس ایجاد شده: ls -la tetrasaas.db');
    console.error('2. دیتابیس را دوباره بسازید: npm run setup');
  }
}

// اجرای تست
simpleTest();
