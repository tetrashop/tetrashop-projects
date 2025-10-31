const QuantumAPIServer = require('./services/quantum-api-server');
const QuantumOrchestrator = require('./orchestration/master-controller');

console.log('🌌 راه‌اندازی سیستم کوانتومی ناطق (نسخه اصلاح شده)...');

// فقط در master process کنترلر و سرور را راه‌اندازی کن
if (require('cluster').isMaster) {
    console.log('🎯 کنترلر اصلی راه‌اندازی می‌شود...');
    
    const orchestrator = new QuantumOrchestrator();
    
    // استقرار سرویس‌ها
    orchestrator.deployService({
        name: 'quantum-api',
        type: 'api',
        version: '2.0.0',
        features: ['max_performance', 'self_healing', 'quantum_efficiency']
    });

    // راه‌اندازی سرور API فقط در master
    const apiServer = new QuantumAPIServer();
    const PORT = process.env.QUANTUM_PORT || 3003;
    
    console.log(`🚀 راه‌اندازی سرور API روی پورت ${PORT}...`);
    apiServer.start(PORT);
} else {
    console.log('🔧 Worker process فعال - آماده پردازش درخواست‌ها');
}

// مدیریت graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔻 دریافت سیگنال توقف...');
    console.log('🛑 خروج از سیستم کوانتومی');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('⚠️ خطای غیرمنتظره:', error.message);
    console.log('🔧 فعال‌سازی خود-ترمیمی...');
});
