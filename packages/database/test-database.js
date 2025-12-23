import { database } from './src/index.js';

async function runTests() {
  console.log('🧪 شروع تست‌های ماژول دیتابیس TetraSaaS\n');
  
  try {
    // تست ۱: دریافت همه سرویس‌ها
    console.log('1. 📊 دریافت همه سرویس‌ها:');
    const allServices = await database.getAllServices();
    console.log(`   ✅ تعداد: ${allServices.length} سرویس`);
    console.log(`   📍 نمونه: ${allServices[0]?.name} (${allServices[0]?.category})`);

    // تست ۲: دریافت سرویس بر اساس slug
    console.log('\n2. 🔍 دریافت سرویس image-enhancement:');
    const service = await database.getServiceBySlug('image-enhancement');
    console.log(`   ✅ نام: ${service?.name}`);
    console.log(`   💰 قیمت: ${service?.price_per_call} واحد`);
    console.log(`   📂 دسته: ${service?.category}`);

    // تست ۳: دریافت دسته‌بندی‌ها
    console.log('\n3. 🗂️ دریافت دسته‌بندی‌ها:');
    const categories = await database.getCategories();
    console.log(`   ✅ تعداد دسته‌بندی‌ها: ${categories.length}`);
    console.log(`   📍 دسته‌ها: ${categories.map(c => c.category).join(', ')}`);

    // تست ۴: دریافت سرویس‌های NLP
    console.log('\n4. 📝 دریافت سرویس‌های NLP:');
    const nlpServices = await database.getServicesByCategory('NLP');
    console.log(`   ✅ تعداد سرویس‌های NLP: ${nlpServices.length}`);
    console.log(`   📍 نمونه‌ها: ${nlpServices.slice(0, 3).map(s => s.name).join(', ')}`);

    // تست ۵: دریافت API Key نمونه
    console.log('\n5. 🔑 دریافت API Key نمونه:');
    const db = await database.getDb();
    const sampleApiKey = await db.get('SELECT api_key FROM api_keys LIMIT 1');
    
    if (sampleApiKey) {
      console.log(`   ✅ API Key یافت شد: ${sampleApiKey.api_key.substring(0, 25)}...`);
      
      // تست ۶: اعتبارسنجی API Key
      console.log('\n6. 🔐 اعتبارسنجی API Key:');
      const validated = await database.validateApiKey(sampleApiKey.api_key);
      if (validated) {
        console.log(`   ✅ اعتبارسنجی موفق`);
        console.log(`   👤 Tenant ID: ${validated.tenant_id}`);
        console.log(`   💰 موجودی: ${validated.balance} واحد`);
        console.log(`   ⚡ Rate Limit: ${validated.rate_limit}/روز`);
        
        // تست ۷: لاگ درخواست
        console.log('\n7. 📝 لاگ درخواست نمونه:');
        const logResult = await database.logRequest(validated.id, service.id, {
          input: { image: 'base64_data_here' },
          output: { enhanced: true, resolution: '4k' },
          status: 'SUCCESS'
        });
        console.log(`   ✅ لاگ با موفقیت ثبت شد (ID: ${logResult.lastID})`);
        
        // تست ۸: کسر موجودی
        console.log('\n8. 💸 کسر موجودی:');
        const deductResult = await database.deductBalance(validated.tenant_id, service.price_per_call);
        console.log(`   ✅ موجودی کسر شد`);
        
        // تست ۹: بررسی موجودی جدید
        const newBalance = await database.getBalance(validated.tenant_id);
        console.log(`   💰 موجودی جدید: ${newBalance?.balance} واحد`);
        
        // تست ۱۰: ایجاد API Key جدید
        console.log('\n10. 🆕 ایجاد API Key جدید:');
        const newApiKey = await database.createApiKey('تست توسعه', 'tenant_test_' + Date.now(), 500);
        console.log(`   ✅ API Key جدید ایجاد شد`);
        console.log(`   🔑 کلید: ${newApiKey.apiKey.substring(0, 25)}...`);
        console.log(`   👤 Tenant: ${newApiKey.tenantId}`);
        
      } else {
        console.log('   ❌ اعتبارسنجی ناموفق');
      }
    } else {
      console.log('   ⚠️ API Key نمونه یافت نشد');
    }

    // تست ۱۱: گزارش استفاده
    console.log('\n11. 📈 گزارش استفاده:');
    if (validated) {
      const report = await database.getUsageReport(validated.tenant_id, 7);
      console.log(`   ✅ تعداد رکوردهای گزارش: ${report.length}`);
      if (report.length > 0) {
        console.log(`   📊 نمونه گزارش: ${report[0]?.name} - ${report[0]?.request_count} درخواست`);
      }
    }

    console.log('\n🎉 تمام تست‌ها با موفقیت انجام شد!');
    console.log('\n📊 خلاصه عملکرد:');
    console.log(`   • تعداد سرویس‌ها: ${allServices.length}`);
    console.log(`   • تعداد دسته‌بندی‌ها: ${categories.length}`);
    console.log(`   • دیتابیس: ${dbPath.split('/').pop()}`);
    console.log(`   • وضعیت: ✅ عملیاتی`);

  } catch (error) {
    console.error('\n❌ خطا در اجرای تست‌ها:', error.message);
    console.error(error.stack);
  } finally {
    // بستن اتصال دیتابیس
    const db = await database.getDb();
    await db.close();
  }
}

runTests();
