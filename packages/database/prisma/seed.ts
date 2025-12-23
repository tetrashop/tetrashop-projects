import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 شروع سیدینگ دیتابیس TetraSaaS...')
  
  // ۱. ایجاد یک کاربر ادمین
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tetrasaas.com' },
    update: {},
    create: {
      email: 'admin@tetrasaas.com',
      name: 'مدیریت TetraSaaS',
      passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqK3a5QHxnAkD5Bp6QRPvT3l2HYo7a', // پسورد: Admin@123
      role: 'ADMIN',
    },
  })
  console.log(`✅ کاربر ادمین ایجاد شد: ${adminUser.email}`)

  // ۲. ایجاد ۲۶ سرویس واقعی (مطابق با داشبورد شما)
  const services = [
    // بینایی کامپیوتر
    { slug: 'image-enhancement', name: 'بهبود تصویر', category: 'بینایی کامپیوتر', icon: '👁️', pricePerCall: 100, description: 'افزایش کیفیت، رزولوشن و وضوح تصاویر' },
    { slug: 'object-detection', name: 'تشخیص اشیاء', category: 'بینایی کامپیوتر', icon: '📦', pricePerCall: 120, description: 'تشخیص و دسته‌بندی اشیاء در تصویر' },
    { slug: 'face-recognition', name: 'تشخیص چهره', category: 'بینایی کامپیوتر', icon: '👤', pricePerCall: 150, description: 'تشخیص و شناسایی چهره افراد' },
    { slug: 'image-generation', name: 'تولید تصویر', category: 'بینایی کامپیوتر', icon: '🎨', pricePerCall: 200, description: 'خلق تصویر از توصیف متنی با هوش مصنوعی' },
    
    // پردازش صوت
    { slug: 'audio-enhancement', name: 'بهبود صدا', category: 'پردازش صوت', icon: '🎵', pricePerCall: 80, description: 'حذف نویز و افزایش کیفیت فایل صوتی' },
    { slug: 'speech-to-text', name: 'تشخیص گفتار', category: 'پردازش صوت', icon: '🗣️', pricePerCall: 110, description: 'تبدیل صوت به متن با دقت بالا' },
    { slug: 'text-to-speech', name: 'سنتز صدا', category: 'پردازش صوت', icon: '🔊', pricePerCall: 90, description: 'تبدیل متن به گفتار طبیعی' },
    { slug: 'audio-classification', name: 'دسته‌بندی صدا', category: 'پردازش صوت', icon: '🏷️', pricePerCall: 70, description: 'تشخیص نوع و منبع صدا' },
    
    // NLP
    { slug: 'sentiment-analysis', name: 'تحلیل احساسات', category: 'NLP', icon: '😊', pricePerCall: 60, description: 'تشخیص احساس مثبت، منفی یا خنثی در متن' },
    { slug: 'text-summarization', name: 'خلاصه‌سازی متن', category: 'NLP', icon: '📝', pricePerCall: 75, description: 'خلاصه‌سازی خودکار متون طولانی' },
    { slug: 'language-translation', name: 'ترجمه ماشینی', category: 'NLP', icon: '🌐', pricePerCall: 95, description: 'ترجمه متن بین زبان‌های مختلف' },
    { slug: 'chatbot', name: 'چتبات هوشمند', category: 'NLP', icon: '🤖', pricePerCall: 130, description: 'پاسخگویی خودکار به سوالات کاربران' },
    { slug: 'text-generation', name: 'تولید متن', category: 'NLP', icon: '✍️', pricePerCall: 140, description: 'تولید متن خلاقانه بر اساس prompt' },
    { slug: 'ner', name: 'تشخیص موجودیت‌ها', category: 'NLP', icon: '🏢', pricePerCall: 85, description: 'تشخیص نام افراد، مکان‌ها و سازمان‌ها در متن' },
    
    // علم داده
    { slug: 'data-analysis', name: 'تحلیل داده', category: 'علم داده', icon: '📊', pricePerCall: 100, description: 'آنالیز و کشف الگو در داده‌های ساختاریافته' },
    { slug: 'predictive-modeling', name: 'مدل‌سازی پیش‌بین', category: 'علم داده', icon: '🔮', pricePerCall: 180, description: 'ساخت مدل برای پیش‌بینی روند آینده' },
    { slug: 'anomaly-detection', name: 'تشخیص ناهنجاری', category: 'علم داده', icon: '⚠️', pricePerCall: 120, description: 'تشخیص داده‌های غیرعادی و outlier' },
    { slug: 'recommendation', name: 'سیستم پیشنهاد', category: 'علم داده', icon: '💡', pricePerCall: 110, description: 'تولید پیشنهادات شخصی‌سازی شده' },
    
    // دیگر سرویس‌ها
    { slug: 'market-prediction', name: 'پیش‌بینی بازار', category: 'مالی', icon: '📈', pricePerCall: 250, description: 'تحلیل روند بازارهای مالی با هوش مصنوعی' },
    { slug: 'cyber-security', name: 'امنیت سایبری', category: 'امنیت', icon: '🛡️', pricePerCall: 160, description: 'شناخت تهدیدات و تحلیل امنیتی' },
    { slug: 'medical-diagnosis', name: 'تشخیص پزشکی', category: 'سلامت', icon: '🏥', pricePerCall: 300, description: 'کمک به تحلیل داده‌های پزشکی' },
    { slug: 'autonomous-vehicle', name: 'خودروی خودران', category: 'خودرو', icon: '🚗', pricePerCall: 280, description: 'پردازش داده‌های حسگر برای ناوبری' },
    { slug: 'iot-analytics', name: 'تحلیل اینترنت اشیا', category: 'IoT', icon: '📡', pricePerCall: 130, description: 'آنالیز داده‌های دستگاه‌های متصل' },
    { slug: 'weather-forecast', name: 'پیش‌بینی هوا', category: 'هواشناسی', icon: '⛅', pricePerCall: 90, description: 'تحلیل داده‌های هواشناسی با ML' },
    { slug: 'genetic-analysis', name: 'تحلیل ژنتیک', category: 'زیست‌فناوری', icon: '🧬', pricePerCall: 320, description: 'پردازش داده‌های ژنومی' },
    { slug: '3d-rendering', name: 'رندر سه‌بعدی', category: 'گرافیک', icon: '🎭', pricePerCall: 220, description: 'تبدیل مدل‌های 3D به تصویر' }
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  console.log(`✅ ${services.length} سرویس ایجاد شدند`)

  // ۳. ایجاد یک API Key نمونه برای تست
  const sampleApiKey = await prisma.apiKey.create({
    data: {
      key: 'ts_live_sample_' + Math.random().toString(36).substring(2, 15),
      name: 'کلید نمونه برای تست توسعه',
      userId: adminUser.id,
      tenantId: 'tenant_dev_' + Date.now(),
      rateLimit: 1000,
      isActive: true,
    },
  })
  console.log(`🔑 کلید API نمونه ایجاد شد: ${sampleApiKey.key.substring(0, 25)}...`)

  // ۴. ایجاد موجودی اولیه برای این Tenant
  await prisma.creditBalance.create({
    data: {
      tenantId: sampleApiKey.tenantId,
      balance: 50000, // ۵۰,۰۰۰ واحد اعتبار اولیه
      totalSpent: 0,
    },
  })
  console.log('💰 موجودی اولیه (۵۰,۰۰۰ واحد) ایجاد شد')

  console.log('🎉 سیدینگ دیتابیس با موفقیت کامل شد!')
}

main()
  .catch(e => {
    console.error('❌ خطا در سیدینگ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
