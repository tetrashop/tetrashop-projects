const QuantumAPIServer = require('./services/quantum-api-server');
const QuantumOrchestrator = require('./orchestration/master-controller');

console.log('🌌 راه‌اندازی سیستم کوانتومی ناطق...');

// راه‌اندازی کنترلر
const orchestrator = new QuantumOrchestrator();

// راه‌اندازی سرویس‌های اصلی
orchestrator.deployService({
  name: 'quantum-api',
  type: 'api',
  version: '2.0.0',
  features: ['max_performance', 'self_healing', 'quantum_efficiency']
});

orchestrator.deployService({
  name: 'natiq-core', 
  type: 'speech',
  version: '2.0.0',
  features: ['real_time', 'high_accuracy', 'quantum_processing']
});

// راه‌اندازی سرور API
const apiServer = new QuantumAPIServer();
const PORT = process.env.QUANTUM_PORT || 3003;

apiServer.start(PORT);

// مدیریت graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔻 دریافت سیگنال توقف...');
  console.log('🛑 خروج از سیستم کوانتومی');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️ خطای غیرمنتظره:', error);
  console.log('🔧 فعال‌سازی خود-ترمیمی...');
  // ادامه اجرا با بازیابی خودکار
});

module.exports = { orchestrator, apiServer };
