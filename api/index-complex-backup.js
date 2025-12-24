import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// صفحه اصلی
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TetraSaaS API v3.0 - DEPLOYED!',
    version: '3.0.0',
    status: '✅ فعال با ۲۵۱ پست NLP',
    developer: 'رامین عدل‌جلال',
    timestamp: new Date().toISOString(),
    endpoints: {
      home: '/',
      health: '/api/health',
      nlp: '/api/nlp?page=1',
      services: '/api/services',
      stats: '/api/stats'
    },
    quickStats: {
      totalNLPosts: 251,
      totalServices: 26,
      apiRequests: 8921,
      uptime: '100%'
    }
  });
});

// وضعیت سلامت
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'TetraSaaS API v3.0 با ۲۵۱ پست NLP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// پست‌های NLP
app.get('/api/nlp', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const totalPosts = 251;
  const totalPages = Math.ceil(totalPosts / limit);
  
  if (page < 1 || page > totalPages) {
    return res.status(400).json({
      error: `صفحه باید بین ۱ و ${totalPages} باشد`
    });
  }
  
  const posts = [];
  for (let i = 0; i < limit && ((page - 1) * limit + i) < totalPosts; i++) {
    const id = (page - 1) * limit + i + 1;
    posts.push({
      id,
      title: `پروژه NLP شماره ${id}`,
      description: `پروژه پردازش زبان طبیعی شماره ${id} از ۲۵۱ پروژه`,
      category: 'پردازش زبان طبیعی',
      author: `محقق ${(id % 50) + 1}`,
      views: 1000 + id * 10,
      likes: 50 + id * 2,
      createdAt: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    totalPosts: 251,
    page,
    limit,
    totalPages,
    posts,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  });
});

// پست خاص NLP
app.get('/api/nlp/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (id >= 1 && id <= 251) {
    res.json({
      success: true,
      post: {
        id,
        title: `پروژه NLP شماره ${id}`,
        description: `پروژه کامل شماره ${id} از ۲۵۱ پروژه NLP`,
        content: `## پروژه NLP شماره ${id}
        
این پروژه یکی از ۲۵۱ پروژه پردازش زبان طبیعی در پلتفرم TetraSaaS است.

### مشخصات:
- شناسه: ${id}
- مجموع پروژه‌ها: ۲۵۱
- وضعیت: فعال
- تاریخ ایجاد: ${new Date().toISOString()}

### کاربردها:
۱. تحلیل متن
۲. پردازش زبان طبیعی
۳. یادگیری ماشین

### نکات فنی:
- ۱۰۰% فارسی
- قابلیت مقیاس‌پذیری
- API کامل`,
        category: 'پردازش زبان طبیعی',
        author: 'تیم TetraSaaS',
        views: 10000 + id * 100,
        likes: 500 + id * 10,
        comments: id * 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: `پست با شناسه ${id} یافت نشد`,
      message: `لطفا عددی بین ۱ و ۲۵۱ وارد کنید.`,
      note: 'تعداد کل پست‌های NLP: ۲۵۱'
    });
  }
});

// سرویس‌ها
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    count: 26,
    services: [
      { id: 1, name: 'تحلیل احساسات', enName: 'Sentiment Analysis', category: 'NLP', posts: 251 },
      { id: 2, name: 'طبقه‌بندی متن', enName: 'Text Classification', category: 'NLP', posts: 189 },
      { id: 3, name: 'تشخیص موجودیت', enName: 'Named Entity Recognition', category: 'NLP', posts: 167 },
      { id: 4, name: 'خلاصه‌سازی متن', enName: 'Text Summarization', category: 'NLP', posts: 142 },
      { id: 5, name: 'ترجمه ماشینی', enName: 'Machine Translation', category: 'NLP', posts: 98 },
      { id: 6, name: 'تشخیص گفتار', enName: 'Speech Recognition', category: 'Audio', posts: 76 },
      { id: 7, name: 'تشخیص تصویر', enName: 'Image Recognition', category: 'Computer Vision', posts: 211 }
    ],
    categories: {
      'NLP': 5,
      'Audio': 1,
      'Computer Vision': 1
    }
  });
});

// آمار
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      posts: {
        total: 251,
        published: 201,
        draft: 35,
        archived: 15,
        featured: 25
      },
      services: {
        total: 26,
        byCategory: {
          'NLP': 7,
          'Computer Vision': 4,
          'Data Science': 3,
          'Conversational AI': 2,
          'Developer Tools': 2,
          'OCR & Document': 2,
          'Healthcare AI': 2,
          'Finance AI': 2,
          'Audio': 1,
          'Security': 1
        }
      },
      users: {
        total: 1542,
        active: 892,
        newToday: 24
      },
      performance: {
        uptime: '100%',
        responseTime: '45ms',
        successRate: '99.8%'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// جستجو
app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  
  if (query.length < 2) {
    return res.status(400).json({
      error: 'عبارت جستجو باید حداقل ۲ کاراکتر باشد'
    });
  }
  
  res.json({
    success: true,
    query,
    results: {
      posts: [
        { id: 1, title: 'تحلیل احساسات متن فارسی', relevance: 95 },
        { id: 2, title: 'تحلیل متن با هوش مصنوعی', relevance: 88 },
        { id: 3, title: 'تحلیل داده‌های زبانی', relevance: 76 }
      ],
      services: [
        { id: 1, name: 'تحلیل احساسات', category: 'NLP' }
      ]
    },
    totalResults: 4
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'مسیر مورد نظر یافت نشد',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/nlp',
      'GET /api/nlp/:id (1-251)',
      'GET /api/services',
      'GET /api/stats',
      'GET /api/search?q=query'
    ]
  });
});

export default app;
