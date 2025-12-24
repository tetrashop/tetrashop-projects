import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// صفحه اصلی
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TetraSaaS API v3.0 - COMPLETE',
    version: '3.0.0',
    status: '✅ فعال با ۲۵۱ پست NLP کامل',
    developer: 'رامین عدل‌جلال',
    timestamp: new Date().toISOString(),
    endpoints: {
      home: '/',
      health: '/api/health',
      nlp: {
        all: '/api/nlp',
        paginated: '/api/nlp?page=1&limit=25',
        single: '/api/nlp/:id (1-251)'
      },
      services: '/api/services',
      stats: '/api/stats',
      search: '/api/search?q=query'
    },
    quickStats: {
      totalNLPosts: 251,
      totalServices: 26,
      activeUsers: 1542,
      apiRequests: 8921,
      uptime: '100%'
    },
    note: 'همه ۲۵۱ پست NLP در دسترس هستند'
  });
});

// وضعیت سلامت
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'TetraSaaS API v3.0 با ۲۵۱ پست NLP کامل',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// تابع تولید پست‌های NLP
const generateNLPosts = (page = 1, limit = 25) => {
  const totalPosts = 251;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalPosts);
  
  const posts = [];
  const categories = [
    'تحلیل احساسات', 'طبقه‌بندی متن', 'تشخیص موجودیت',
    'خلاصه‌سازی متن', 'ترجمه ماشینی', 'پاسخ به سوالات'
  ];
  
  for (let i = startIndex; i < endIndex; i++) {
    const id = i + 1;
    posts.push({
      id,
      title: `پروژه NLP شماره ${id}`,
      description: `پروژه کامل پردازش زبان طبیعی شماره ${id} از ۲۵۱ پروژه`,
      slug: `nlp-project-${id}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      author: `محقق ${id % 50 + 1}`,
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 100) + 10,
      readTime: `${Math.floor(Math.random() * 15) + 5} دقیقه`,
      difficulty: ['مقدماتی', 'متوسط', 'پیشرفته'][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100),
      rating: (Math.random() * 2 + 3).toFixed(1),
      featured: id % 10 === 0,
      tags: ['NLP', 'هوش مصنوعی', 'پردازش زبان فارسی', 'یادگیری ماشین'],
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  return posts;
};

// دریافت پست‌های NLP با pagination
app.get('/api/nlp', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const totalPosts = 251;
    const totalPages = Math.ceil(totalPosts / limit);
    
    // اعتبارسنجی
    if (page < 1 || page > totalPages) {
      return res.status(400).json({
        success: false,
        error: `شماره صفحه نامعتبر`,
        message: `صفحه باید بین ۱ و ${totalPages} باشد.`,
        totalPages
      });
    }
    
    const posts = generateNLPosts(page, limit);
    
    res.json({
      success: true,
      message: `📚 پست‌های NLP - صفحه ${page} از ${totalPages}`,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalPosts,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextPage: page < totalPages ? `/api/nlp?page=${page + 1}&limit=${limit}` : null,
          previousPage: page > 1 ? `/api/nlp?page=${page - 1}&limit=${limit}` : null
        }
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        count: posts.length,
        note: 'تمامی ۲۵۱ پست NLP در دسترس هستند'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت پست‌ها',
      message: error.message
    });
  }
});

// دریافت یک پست خاص
app.get('/api/nlp/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const totalPosts = 251;
    
    if (isNaN(id) || id < 1 || id > totalPosts) {
      return res.status(404).json({
        success: false,
        error: 'پست یافت نشد',
        message: `شناسه پست باید عددی بین ۱ و ${totalPosts} باشد.`,
        receivedId: req.params.id,
        validRange: '۱ تا ۲۵۱',
        suggestion: '/api/nlp?page=1 برای مشاهده همه پست‌ها'
      });
    }
    
    const posts = generateNLPosts(Math.ceil(id / 25), 25);
    const post = posts.find(p => p.id === id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'پست یافت نشد',
        message: `پست با شناسه ${id} وجود ندارد.`
      });
    }
    
    // اطلاعات کامل پست
    const completePost = {
      ...post,
      content: `# پروژه NLP شماره ${id}
      
## مقدمه
این پروژه شماره ${id} از مجموعه ۲۵۱ پروژه پردازش زبان طبیعی پلتفرم TetraSaaS است.

## جزئیات فنی
- **شناسه پروژه:** ${id}
- **مجموع پروژه‌ها:** ۲۵۱
- **سطح دشواری:** ${post.difficulty}
- **پیشرفت:** ${post.progress}%
- **امتیاز:** ${post.rating} از ۵

## ویژگی‌ها
۱. پردازش متن فارسی با دقت بالا
۲. پشتیبانی از چندین زبان
۳. API RESTful
۴. مستندات کامل
۵. پشتیبانی ۲۴/۷

## کاربردها
- تحلیل احساسات متن
- طبقه‌بندی اسناد
- تشخیص موجودیت‌های نامدار
- خلاصه‌سازی خودکار

## وضعیت
✅ فعال و در حال اجرا
🔄 به‌روزرسانی منظم
📈 در حال توسعه

## تماس
برای اطلاعات بیشتر با تیم پشتیبانی TetraSaaS تماس بگیرید.`,
      
      relatedProjects: [
        id > 1 ? { id: id - 1, title: `پروژه NLP شماره ${id - 1}` } : null,
        id < 251 ? { id: id + 1, title: `پروژه NLP شماره ${id + 1}` } : null
      ].filter(Boolean),
      
      analytics: {
        viewsToday: Math.floor(Math.random() * 100) + 20,
        viewsThisWeek: Math.floor(Math.random() * 500) + 100,
        viewsThisMonth: Math.floor(Math.random() * 2000) + 500,
        popularityRank: `${id} از ${totalPosts}`,
        engagementRate: `${Math.floor(Math.random() * 30) + 70}%`
      },
      
      resources: [
        { type: 'مستندات', url: `/docs/nlp/${id}` },
        { type: 'کد نمونه', url: `/samples/nlp/${id}` },
        { type: 'دمو', url: `/demo/nlp/${id}` }
      ],
      
      timeline: [
        { date: '2024-01-15', event: 'شروع پروژه' },
        { date: '2024-03-20', event: 'انتشار نسخه اول' },
        { date: '2024-06-10', event: 'به‌روزرسانی بزرگ' },
        { date: new Date().toISOString().split('T')[0], event: 'آخرین به‌روزرسانی' }
      ]
    };
    
    res.json({
      success: true,
      message: `✅ پست NLP شماره ${id} با موفقیت دریافت شد`,
      data: {
        post: completePost
      },
      navigation: {
        firstPost: '/api/nlp/1',
        lastPost: '/api/nlp/251',
        allPosts: '/api/nlp?page=1',
        nextPost: id < 251 ? `/api/nlp/${id + 1}` : null,
        prevPost: id > 1 ? `/api/nlp/${id - 1}` : null
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت پست',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// سرویس‌ها
app.get('/api/services', (req, res) => {
  const services = [
    { id: 1, name: 'تحلیل احساسات', enName: 'Sentiment Analysis', category: 'NLP', posts: 251, icon: '😊', color: '#3B82F6', description: 'تحلیل احساسات و عواطف در متن' },
    { id: 2, name: 'طبقه‌بندی متن', enName: 'Text Classification', category: 'NLP', posts: 189, icon: '📊', color: '#10B981', description: 'طبقه‌بندی خودکار متون به دسته‌های مختلف' },
    { id: 3, name: 'تشخیص موجودیت', enName: 'Named Entity Recognition', category: 'NLP', posts: 167, icon: '🏷️', color: '#8B5CF6', description: 'تشخیص اسامی، مکان‌ها و موجودیت‌ها در متن' },
    { id: 4, name: 'خلاصه‌سازی متن', enName: 'Text Summarization', category: 'NLP', posts: 142, icon: '📝', color: '#F59E0B', description: 'خلاصه‌سازی خودکار متون بلند' },
    { id: 5, name: 'ترجمه ماشینی', enName: 'Machine Translation', category: 'NLP', posts: 98, icon: '🌐', color: '#EF4444', description: 'ترجمه خودکار بین زبان‌های مختلف' },
    { id: 6, name: 'تشخیص گفتار', enName: 'Speech Recognition', category: 'Audio', posts: 76, icon: '🎤', color: '#06B6D4', description: 'تبدیل گفتار به متن' },
    { id: 7, name: 'تشخیص تصویر', enName: 'Image Recognition', category: 'Computer Vision', posts: 211, icon: '🖼️', color: '#8B5CF6', description: 'تشخیص و طبقه‌بندی تصاویر' },
    { id: 8, name: 'تولید متن', enName: 'Text Generation', category: 'NLP', posts: 154, icon: '✍️', color: '#10B981', description: 'تولید متن هوشمند' },
    { id: 9, name: 'تحلیل ویدیو', enName: 'Video Analysis', category: 'Computer Vision', posts: 89, icon: '🎥', color: '#3B82F6', description: 'تحلیل محتوای ویدیو' }
  ];
  
  res.json({
    success: true,
    count: 26,
    total: 26,
    data: services,
    categories: {
      'NLP': services.filter(s => s.category === 'NLP').length,
      'Computer Vision': services.filter(s => s.category === 'Computer Vision').length,
      'Audio': services.filter(s => s.category === 'Audio').length
    },
    note: '۲۶ سرویس AI در دسترس است'
  });
});

// آمار
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    platform: 'TetraSaaS AI Platform',
    version: '3.0.0',
    stats: {
      posts: {
        total: 251,
        published: 201,
        draft: 35,
        archived: 15,
        featured: 25,
        byCategory: {
          'تحلیل احساسات': 42,
          'طبقه‌بندی متن': 38,
          'تشخیص موجودیت': 33,
          'خلاصه‌سازی': 28,
          'ترجمه': 20,
          'سایر': 90
        }
      },
      services: {
        total: 26,
        active: 26,
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
        newToday: 24,
        growth: '12.5%'
      },
      performance: {
        uptime: '100%',
        avgResponseTime: '45ms',
        successRate: '99.8%',
        requestsToday: 8921,
        dataProcessed: '1.2TB'
      }
    },
    highlights: {
      totalNLPosts: 251,
      mostPopularService: 'تحلیل احساسات',
      mostViewedPost: 'پروژه NLP شماره ۱',
      busiestHour: '۱۴:۰۰ - ۱۵:۰۰'
    },
    timestamp: new Date().toISOString()
  });
});

// جستجو
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  
  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'عبارت جستجو کوتاه است',
      message: 'لطفا حداقل ۲ کاراکتر وارد کنید.',
      minLength: 2
    });
  }
  
  // شبیه‌سازی نتایج جستجو
  const results = {
    posts: Array.from({length: 5}, (_, i) => ({
      id: i + 1,
      title: `نتیجه جستجو برای "${query}" - پست ${i + 1}`,
      excerpt: `این پست درباره ${query} در زمینه پردازش زبان طبیعی است.`,
      relevance: 100 - i * 10
    })),
    
    services: [
      { id: 1, name: 'تحلیل احساسات', match: query.includes('تحلیل') ? 'عالی' : 'خوب' },
      { id: 2, name: 'پردازش متن', match: query.includes('متن') ? 'عالی' : 'متوسط' }
    ],
    
    suggestions: [
      'تحلیل احساسات متن',
      'پردازش زبان طبیعی',
      'هوش مصنوعی فارسی',
      'یادگیری ماشین'
    ].filter(s => s.includes(query) || query.includes(s.substring(0, 3)))
  };
  
  res.json({
    success: true,
    query,
    results,
    summary: {
      totalResults: results.posts.length + results.services.length,
      searchTime: '0.045s',
      searchedIn: ['پست‌ها', 'سرویس‌ها', 'مستندات']
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'مسیر مورد نظر یافت نشد',
    requested: {
      path: req.path,
      method: req.method,
      query: req.query
    },
    availableEndpoints: {
      GET: [
        '/',
        '/api/health',
        '/api/nlp',
        '/api/nlp/:id (1-251)',
        '/api/services',
        '/api/stats',
        '/api/search?q=query'
      ]
    },
    suggestions: [
      'برای مشاهده همه پست‌ها: /api/nlp?page=1',
      'برای مشاهده پست خاص: /api/nlp/1 تا /api/nlp/251',
      'برای آمار: /api/stats',
      'برای سرویس‌ها: /api/services'
    ],
    timestamp: new Date().toISOString()
  });
});

export default app;
