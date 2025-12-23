// api/index.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// متغیرهای جهانی
const TOTAL_NLP_POSTS = 251;
const TOTAL_SERVICES = 26;

// تابع برای ایجاد پست‌های NLP
const generateNLPosts = (page = 1, limit = 25) => {
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, TOTAL_NLP_POSTS);
  const posts = [];
  
  const categories = [
    'Sentiment Analysis', 'Text Classification', 'Named Entity Recognition',
    'Text Summarization', 'Machine Translation', 'Question Answering',
    'Text Generation', 'Language Modeling', 'Speech Recognition',
    'Optical Character Recognition'
  ];
  
  const statuses = ['Published', 'Draft', 'Review', 'Archived'];
  const authors = [
    'دکتر علی محمدی', 'پروفسور سارا احمدی', 'مهندس رضا کریمی',
    'دکتر مریم قاسمی', 'پروفسور احمد رحیمی', 'مهندس فاطمه نجفی',
    'دکتر حسین مرادی', 'پروفسور زهرا امینی'
  ];
  
  for (let i = startIndex; i < endIndex; i++) {
    const postId = i + 1;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    
    posts.push({
      id: postId,
      title: `پروژه NLP شماره ${postId}: تحلیل ${category} به زبان فارسی`,
      slug: `nlp-project-${postId}`,
      description: `این پروژه بر روی ${category} در پردازش زبان طبیعی تمرکز دارد. این سیستم قادر به پردازش متن‌های فارسی و انگلیسی می‌باشد.`,
      content: `## مقدمه
پروژه شماره ${postId} یکی از پیشرفته‌ترین سیستم‌های ${category} است که توسط تیم ${author} توسعه یافته است.

## ویژگی‌ها
- پردازش متن‌های فارسی با دقت ۹۸٪
- پشتیبانی از چندین زبان
- API RESTful برای یکپارچه‌سازی آسان
- مقیاس‌پذیری بالا

## کاربردها
۱. تحلیل نظرات مشتریان
۲. طبقه‌بندی اسناد
۳. تشخیص موجودیت‌های نامدار
۴. خلاصه‌سازی متون`,
      excerpt: `سیستم پیشرفته ${category} با قابلیت پردازش متن‌های فارسی`,
      category: category,
      tags: ['NLP', 'هوش مصنوعی', 'پردازش زبان فارسی', category, 'AI'],
      author: author,
      authorAvatar: `https://i.pravatar.cc/150?img=${(postId % 70) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      readTime: `${Math.floor(Math.random() * 15) + 5} دقیقه`,
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 100) + 10,
      featured: postId % 10 === 0,
      createdAt: new Date(Date.now() - Math.random() * 31536000000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      image: `https://picsum.photos/800/400?random=${postId}`,
      difficulty: ['مقدماتی', 'متوسط', 'پیشرفته'][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100),
      rating: (Math.random() * 2 + 3).toFixed(1)
    });
  }
  
  return posts;
};

// تابع برای ایجاد سرویس‌ها
const generateServices = () => {
  return [
    { id: 1, name: 'تحلیل احساسات', enName: 'Sentiment Analysis', category: 'NLP', posts: 251, icon: '😊', color: '#3B82F6' },
    { id: 2, name: 'طبقه‌بندی متن', enName: 'Text Classification', category: 'NLP', posts: 189, icon: '📊', color: '#10B981' },
    { id: 3, name: 'تشخیص موجودیت', enName: 'Named Entity Recognition', category: 'NLP', posts: 167, icon: '🏷️', color: '#8B5CF6' },
    { id: 4, name: 'خلاصه‌سازی متن', enName: 'Text Summarization', category: 'NLP', posts: 142, icon: '📝', color: '#F59E0B' },
    { id: 5, name: 'ترجمه ماشینی', enName: 'Machine Translation', category: 'NLP', posts: 98, icon: '🌐', color: '#EF4444' },
    { id: 6, name: 'پاسخ به سوالات', enName: 'Question Answering', category: 'NLP', posts: 87, icon: '❓', color: '#06B6D4' },
    { id: 7, name: 'تولید متن', enName: 'Text Generation', category: 'NLP', posts: 154, icon: '✍️', color: '#8B5CF6' },
    { id: 8, name: 'تشخیص گفتار', enName: 'Speech Recognition', category: 'Audio', posts: 76, icon: '🎤', color: '#10B981' },
    { id: 9, name: 'تشخیص تصویر', enName: 'Image Recognition', category: 'Computer Vision', posts: 211, icon: '🖼️', color: '#3B82F6' },
    { id: 10, name: 'تشخیص اشیاء', enName: 'Object Detection', category: 'Computer Vision', posts: 187, icon: '📦', color: '#F59E0B' },
    { id: 11, name: 'تولید تصویر', enName: 'Image Generation', category: 'Computer Vision', posts: 154, icon: '🎨', color: '#EC4899' },
    { id: 12, name: 'تحلیل ویدیو', enName: 'Video Analysis', category: 'Computer Vision', posts: 89, icon: '🎥', color: '#8B5CF6' },
    { id: 13, name: 'تحلیل پیش‌بینی', enName: 'Predictive Analytics', category: 'Data Science', posts: 178, icon: '📈', color: '#10B981' },
    { id: 14, name: 'تشخیص ناهنجاری', enName: 'Anomaly Detection', category: 'Data Science', posts: 132, icon: '⚠️', color: '#F59E0B' },
    { id: 15, name: 'سیستم پیشنهاد', enName: 'Recommendation System', category: 'Data Science', posts: 167, icon: '💡', color: '#3B82F6' },
    { id: 16, name: 'تشخیص تقلب', enName: 'Fraud Detection', category: 'Security', posts: 98, icon: '🛡️', color: '#EF4444' },
    { id: 17, name: 'توسعه چت‌بات', enName: 'Chatbot Development', category: 'Conversational AI', posts: 211, icon: '🤖', color: '#06B6D4' },
    { id: 18, name: 'دستیار صوتی', enName: 'Voice Assistant', category: 'Conversational AI', posts: 87, icon: '🎵', color: '#8B5CF6' },
    { id: 19, name: 'تولید کد', enName: 'Code Generation', category: 'Developer Tools', posts: 143, icon: '💻', color: '#10B981' },
    { id: 20, name: 'بازبینی کد', enName: 'Code Review', category: 'Developer Tools', posts: 98, icon: '👁️', color: '#F59E0B' },
    { id: 21, name: 'تحلیل اسناد', enName: 'Document Analysis', category: 'OCR & Document', posts: 176, icon: '📄', color: '#3B82F6' },
    { id: 22, name: 'پردازش فرم', enName: 'Form Processing', category: 'OCR & Document', posts: 121, icon: '📋', color: '#10B981' },
    { id: 23, name: 'تشخیص پزشکی', enName: 'Medical Diagnosis', category: 'Healthcare AI', posts: 87, icon: '🏥', color: '#EF4444' },
    { id: 24, name: 'کشف دارو', enName: 'Drug Discovery', category: 'Healthcare AI', posts: 65, icon: '💊', color: '#8B5CF6' },
    { id: 25, name: 'پیش‌بینی مالی', enName: 'Financial Forecasting', category: 'Finance AI', posts: 154, icon: '💰', color: '#10B981' },
    { id: 26, name: 'ارزیابی ریسک', enName: 'Risk Assessment', category: 'Finance AI', posts: 132, icon: '📊', color: '#F59E0B' }
  ];
};

// ==================== Routes ====================

// صفحه اصلی
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 پلتفرم TetraSaaS - نسخه ۳.۰',
    version: '3.0.0',
    status: '✅ فعال و در حال اجرا روی Vercel',
    developer: 'رامین عدل‌جلال',
    timestamp: new Date().toISOString(),
    endpoints: {
      home: '/',
      health: '/api/health',
      nlp: {
        all: '/api/nlp',
        paginated: '/api/nlp?page=1&limit=25',
        single: '/api/nlp/:id'
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
    }
  });
});

// وضعیت سلامت
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TetraSaaS API',
    version: '3.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'Mock Data (Ready for PostgreSQL)'
  });
});

// آمار کلی
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    platform: 'TetraSaaS AI Platform',
    stats: {
      posts: {
        total: TOTAL_NLP_POSTS,
        published: 201,
        draft: 35,
        archived: 15,
        featured: 25
      },
      services: {
        total: TOTAL_SERVICES,
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
        apiResponseTime: '45ms',
        successRate: '99.8%',
        lastUpdated: new Date().toISOString()
      }
    }
  });
});

// دریافت تمام پست‌های NLP با pagination
app.get('/api/nlp', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const sort = req.query.sort || 'newest';
    const category = req.query.category;
    const search = req.query.search;
    
    const totalPages = Math.ceil(TOTAL_NLP_POSTS / limit);
    
    // اعتبارسنجی
    if (page < 1 || page > totalPages) {
      return res.status(400).json({
        success: false,
        message: `صفحه باید بین ۱ و ${totalPages} باشد`
      });
    }
    
    let posts = generateNLPosts(page, limit);
    
    // فیلتر بر اساس دسته‌بندی
    if (category) {
      posts = posts.filter(post => post.category === category);
    }
    
    // جستجو
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // مرتب‌سازی
    if (sort === 'popular') {
      posts.sort((a, b) => b.views - a.views);
    } else if (sort === 'likes') {
      posts.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'oldest') {
      posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    res.json({
      success: true,
      message: `📚 پست‌های NLP - صفحه ${page} از ${totalPages}`,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: TOTAL_NLP_POSTS,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        },
        filters: {
          sort,
          category: category || 'همه',
          search: search || 'هیچ'
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
      message: 'خطا در دریافت پست‌ها',
      error: error.message
    });
  }
});

// دریافت یک پست خاص
app.get('/api/nlp/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (id < 1 || id > TOTAL_NLP_POSTS) {
      return res.status(404).json({
        success: false,
        message: `پست با شناسه ${id} یافت نشد. شناسه باید بین ۱ و ${TOTAL_NLP_POSTS} باشد.`
      });
    }
    
    const posts = generateNLPosts(Math.ceil(id / 25), 25);
    const post = posts.find(p => p.id === id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'پست مورد نظر یافت نشد'
      });
    }
    
    // اطلاعات بیشتر برای پست تکی
    const relatedPosts = generateNLPosts(1, 5).filter(p => 
      p.id !== id && p.category === post.category
    );
    
    res.json({
      success: true,
      message: `پست ${id} با موفقیت دریافت شد`,
      data: {
        post: {
          ...post,
          tableOfContents: [
            'مقدمه',
            'ویژگی‌ها',
            'کاربردها',
            'نتیجه‌گیری'
          ],
          nextPost: id < TOTAL_NLP_POSTS ? { id: id + 1, title: `پروژه NLP شماره ${id + 1}` } : null,
          prevPost: id > 1 ? { id: id - 1, title: `پروژه NLP شماره ${id - 1}` } : null
        },
        related: relatedPosts,
        analytics: {
          viewsToday: Math.floor(Math.random() * 100) + 20,
          totalReadingTime: `${post.readTime} × ${post.views} = ${parseInt(post.readTime) * post.views} دقیقه مطالعه کلی`,
          popularityRank: `${id} از ${TOTAL_NLP_POSTS}`
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پست',
      error: error.message
    });
  }
});

// دریافت سرویس‌ها
app.get('/api/services', (req, res) => {
  const services = generateServices();
  
  res.json({
    success: true,
    message: '🛠️ سرویس‌های TetraSaaS',
    count: services.length,
    data: services,
    categories: [...new Set(services.map(s => s.category))].map(category => ({
      name: category,
      count: services.filter(s => s.category === category).length,
      services: services.filter(s => s.category === category).map(s => s.name)
    }))
  });
});

// جستجو
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const type = req.query.type || 'all';
  
  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'عبارت جستجو باید حداقل ۲ کاراکتر باشد'
    });
  }
  
  const searchTerm = query.toLowerCase();
  const allPosts = generateNLPosts(1, TOTAL_NLP_POSTS);
  const services = generateServices();
  
  const results = {
    posts: allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      post.author.toLowerCase().includes(searchTerm)
    ).slice(0, 10),
    
    services: services.filter(service => 
      service.name.toLowerCase().includes(searchTerm) ||
      service.enName.toLowerCase().includes(searchTerm) ||
      service.category.toLowerCase().includes(searchTerm)
    ).slice(0, 5)
  };
  
  res.json({
    success: true,
    query,
    type,
    results,
    summary: {
      totalPosts: results.posts.length,
      totalServices: results.services.length,
      totalResults: results.posts.length + results.services.length
    },
    suggestions: [
      'پردازش زبان طبیعی',
      'هوش مصنوعی',
      'یادگیری ماشین',
      'تحلیل متن',
      'داده کاوی'
    ].filter(s => s.includes(query))
  });
});

// روت 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'مسیر مورد نظر یافت نشد',
    requestedUrl: req.url,
    availableEndpoints: {
      home: 'GET /',
      health: 'GET /api/health',
      nlp: {
        all: 'GET /api/nlp',
        paginated: 'GET /api/nlp?page=1&limit=25',
        single: 'GET /api/nlp/:id'
      },
      services: 'GET /api/services',
      stats: 'GET /api/stats',
      search: 'GET /api/search?q=query'
    },
    tip: 'برای مشاهده تمام پست‌های NLP از /api/nlp استفاده کنید'
  });
});

// برای Vercel
export default app;
