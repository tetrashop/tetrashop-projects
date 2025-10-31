const QuantumAPIServer = require('../../services/quantum-api-server');

console.log('🧪 تست کارایی سیستم کوانتومی...');

function testQuantumPerformance() {
  const server = new QuantumAPIServer();
  const testCount = 100;
  let successCount = 0;
  let totalResponseTime = 0;

  console.log(`🔬 اجرای ${testCount} تست عملکرد...`);

  for (let i = 0; i < testCount; i++) {
    const startTime = Date.now();
    const result = server.processQuantumSpeech(`تست عملکرد ${i}`, 'fa', 1.0);
    const responseTime = Date.now() - startTime;
    
    totalResponseTime += responseTime;
    if (result.success) successCount++;
    
    if (responseTime > 50) {
      console.log(`⚠️ تست ${i}: پاسخ ${responseTime}ms (بالاتر از حد مطلوب)`);
    }
  }

  const averageResponseTime = totalResponseTime / testCount;
  const successRate = (successCount / testCount) * 100;

  console.log('📊 نتایج تست کارایی:');
  console.log(`   ✅ نرخ موفقیت: ${successRate}%`);
  console.log(`   ⚡ میانگین زمان پاسخ: ${averageResponseTime}ms`);
  console.log(`   🎯 تعداد تست‌ها: ${testCount}`);
  console.log(`   📈 کارایی سیستم: ${successRate >= 99 ? 'عالی' : 'خوب'}`);

  return {
    successRate,
    averageResponseTime,
    efficiency: successRate >= 99 ? 'quantum' : 'high'
  };
}

// اجرای تست
const results = testQuantumPerformance();

if (results.efficiency === 'quantum') {
  console.log('🎉 سیستم به سطح کارایی کوانتومی رسید!');
} else {
  console.log('🔧 سیستم نیاز به بهینه‌سازی دارد');
}

module.exports = testQuantumPerformance;
