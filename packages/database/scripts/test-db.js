import { database } from '../src/index.js';

async function test() {
  console.log('🧪 تست ماژول دیتابیس...');
  
  try {
    // ۱. دریافت همه سرویس‌ها
    const services = await database.getAllServices();
    console.log(`✅ تعداد سرویس‌ها: ${services.length}`);
    
    // ۲. دریافت یک سرویس نمونه
    const sampleService = await database.getServiceBySlug('image-enhancement');
    console.log('🔍 نمونه سرویس:', {
      name: sampleService?.name,
      category: sampleService?.category,
      price: sampleService?.price_per_call
    });
    
    // ۳. دریافت API Key
    const apiKeys = await (await database.getDb()).all('SELECT * FROM api_keys LIMIT 1');
    if (apiKeys.length > 0) {
      console.log('🔑 API Key نمونه:', apiKeys[0].api_key.substring(0, 20) + '...');
      
      // ۴. اعتبارسنجی
      const valid = await database.validateApiKey(apiKeys[0].api_key);
      console.log('🔐 اعتبارسنجی API Key:', valid ? '✅ موفق' : '❌ ناموفق');
    }
    
    console.log('🎉 تست دیتابیس با موفقیت انجام شد!');
    
  } catch (error) {
    console.error('❌ خطا در تست:', error.message);
  }
}

test();
