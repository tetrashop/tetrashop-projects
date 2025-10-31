const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();

// Middleware های ضروری
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// روت‌های اصلی سیستم ناطق
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 سیستم ناطق فعال - Tetrashop Natiq System',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    status: 'operational'
  });
});

// روت سلامت
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// API اصلی ناطق
app.get('/api/natiq/speak', (req, res) => {
  const { text = 'سلام دنیا' } = req.query;
  
  res.json({
    success: true,
    originalText: text,
    processedText: `🗣️ ${text} (پردازش شده)`,
    timestamp: new Date().toISOString(),
    audioUrl: `/api/natiq/audio/${Date.now()}`,
    language: 'fa'
  });
});

app.post('/api/natiq/speak', (req, res) => {
  const { text, language = 'fa', speed = 1.0 } = req.body;
  
  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'متن الزامی است'
    });
  }
  
  res.json({
    success: true,
    originalText: text,
    processedText: `🎯 ${text}`,
    audioData: {
      duration: text.length * 0.1,
      size: text.length * 100,
      format: 'mp3'
    },
    language,
    speed,
    timestamp: new Date().toISOString()
  });
});

// روت مدیریت فایل‌های صوتی
app.get('/api/natiq/audio/:id', (req, res) => {
  res.json({
    id: req.params.id,
    audioUrl: `https://api.natiq.tetrashop/audio/${req.params.id}.mp3`,
    expiresIn: '24h'
  });
});

// روت آنالیز متن
app.post('/api/natiq/analyze', (req, res) => {
  const { text } = req.body;
  
  const analysis = {
    textLength: text.length,
    wordCount: text.split(' ').length,
    language: 'persian',
    sentiment: 'neutral',
    entities: [],
    processingTime: '25ms'
  };
  
  res.json({
    success: true,
    analysis,
    timestamp: new Date().toISOString()
  });
});

// خطای 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'مسیر یافت نشد',
    availableEndpoints: [
      'GET  /',
      'GET  /health',
      'GET  /api/natiq/speak?text=...',
      'POST /api/natiq/speak',
      'POST /api/natiq/analyze'
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('=' .repeat(60));
  console.log('🚀 سیستم ناطق Tetrashop راه‌اندازی شد!');
  console.log(`📍 پورت: ${PORT}`);
  console.log(`🌐 آدرس: http://localhost:${PORT}`);
  console.log(`📊 سلامت: http://localhost:${PORT}/health`);
  console.log('🗣️  تست: http://localhost:${PORT}/api/natiq/speak?text=سلام');
  console.log('=' .repeat(60));
});

module.exports = app;
