import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 شروع سیدینگ ساده دیتابیس...')
  
  // فقط سرویس‌ها را ایجاد می‌کنیم
  const services = [
    { slug: 'image-enhancement', name: 'بهبود تصویر', category: 'بینایی کامپیوتر', icon: '👁️', pricePerCall: 100 },
    { slug: 'object-detection', name: 'تشخیص اشیاء', category: 'بینایی کامپیوتر', icon: '📦', pricePerCall: 120 },
    { slug: 'face-recognition', name: 'تشخیص چهره', category: 'بینایی کامپیوتر', icon: '👤', pricePerCall: 150 },
    { slug: 'image-generation', name: 'تولید تصویر', category: 'بینایی کامپیوتر', icon: '🎨', pricePerCall: 200 },
    { slug: 'audio-enhancement', name: 'بهبود صدا', category: 'پردازش صوت', icon: '🎵', pricePerCall: 80 },
    { slug: 'speech-to-text', name: 'تشخیص گفتار', category: 'پردازش صوت', icon: '🗣️', pricePerCall: 110 },
    { slug: 'text-to-speech', name: 'سنتز صدا', category: 'پردازش صوت', icon: '🔊', pricePerCall: 90 },
    { slug: 'audio-classification', name: 'دسته‌بندی صدا', category: 'پردازش صوت', icon: '🏷️', pricePerCall: 70 },
    { slug: 'sentiment-analysis', name: 'تحلیل احساسات', category: 'NLP', icon: '😊', pricePerCall: 60 },
    { slug: 'text-summarization', name: 'خلاصه‌سازی متن', category: 'NLP', icon: '📝', pricePerCall: 75 },
    { slug: 'language-translation', name: 'ترجمه ماشینی', category: 'NLP', icon: '🌐', pricePerCall: 95 },
    { slug: 'chatbot', name: 'چتبات هوشمند', category: 'NLP', icon: '🤖', pricePerCall: 130 },
    { slug: 'text-generation', name: 'تولید متن', category: 'NLP', icon: '✍️', pricePerCall: 140 },
    { slug: 'ner', name: 'تشخیص موجودیت‌ها', category: 'NLP', icon: '🏢', pricePerCall: 85 },
    { slug: 'data-analysis', name: 'تحلیل داده', category: 'علم داده', icon: '📊', pricePerCall: 100 },
    { slug: 'predictive-modeling', name: 'مدل‌سازی پیش‌بین', category: 'علم داده', icon: '🔮', pricePerCall: 180 },
    { slug: 'anomaly-detection', name: 'تشخیص ناهنجاری', category: 'علم داده', icon: '⚠️', pricePerCall: 120 },
    { slug: 'recommendation', name: 'سیستم پیشنهاد', category: 'علم داده', icon: '💡', pricePerCall: 110 },
    { slug: 'market-prediction', name: 'پیش‌بینی بازار', category: 'مالی', icon: '📈', pricePerCall: 250 },
    { slug: 'cyber-security', name: 'امنیت سایبری', category: 'امنیت', icon: '🛡️', pricePerCall: 160 },
    { slug: 'medical-diagnosis', name: 'تشخیص پزشکی', category: 'سلامت', icon: '🏥', pricePerCall: 300 },
    { slug: 'autonomous-vehicle', name: 'خودروی خودران', category: 'خودرو', icon: '🚗', pricePerCall: 280 },
    { slug: 'iot-analytics', name: 'تحلیل اینترنت اشیا', category: 'IoT', icon: '📡', pricePerCall: 130 },
    { slug: 'weather-forecast', name: 'پیش‌بینی هوا', category: 'هواشناسی', icon: '⛅', pricePerCall: 90 },
    { slug: 'genetic-analysis', name: 'تحلیل ژنتیک', category: 'زیست‌فناوری', icon: '🧬', pricePerCall: 320 },
    { slug: '3d-rendering', name: 'رندر سه‌بعدی', category: 'گرافیک', icon: '🎭', pricePerCall: 220 }
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  console.log(`✅ ${services.length} سرویس ایجاد شدند`)
}

main()
  .catch(e => {
    console.error('❌ خطا:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
