export default async function handler(request, response) {
  // تنظیم CORS پیشرفته
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };

  // اضافه کردن headers به همه responseها
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.setHeader(key, value);
  });

  // مدیریت CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const products = [
    {
      id: 1,
      name: 'لپ‌تاپ گیمینگ ASUS ROG Strix',
      description: 'لپ‌تاپ گیمینگ حرفه‌ای با پردازنده Intel Core i9-13980HX و کارت گرافیک NVIDIA GeForce RTX 4090',
      price: 125000000,
      category: 'الکترونیک',
      stock: 3,
      image: '/api/images/laptop.jpg',
      features: ['پردازنده Core i9', 'کارت گرافیک RTX 4090', '32GB RAM', '2TB SSD'],
      rating: 4.9
    },
    {
      id: 2,
      name: 'هدفون بی‌سیم Sony WH-1000XM5',
      description: 'هدفون هوشمند با نویزکنسلی پیشرفته، کیفیت صدای Hi-Res و باتری 30 ساعته',
      price: 18500000,
      category: 'صوتی', 
      stock: 15,
      image: '/api/images/headphone.jpg',
      features: ['نویزکنسلی پیشرفته', 'باتری 30 ساعته', 'کنترل لمسی', 'کیفیت Hi-Res'],
      rating: 4.8
    },
    {
      id: 3,
      name: 'ماوس گیمینگ Razer Viper V2 Pro',
      description: 'ماوس بی‌سیم گیمینگ با حسگر نوری Focus Pro 30K و طراحی فوق سبک 58 گرم',
      price: 5200000,
      category: 'گیمینگ',
      stock: 25,
      image: '/api/images/mouse.jpg',
      features: ['حسگر 30000 DPI', 'وزن 58 گرم', 'باتری 80 ساعته', 'optical switches'],
      rating: 4.7
    },
    {
      id: 4,
      name: 'کتاب آموزش React پیشرفته + Next.js 14',
      description: 'کتاب جامع آموزش React با پروژه‌های واقعی و پوشش کامل Next.js 14 و TypeScript',
      price: 750000,
      category: 'کتاب',
      stock: 50,
      image: '/api/images/book.jpg',
      features: ['پروژه‌های واقعی', 'پوشش Next.js 14', 'TypeScript', 'Best Practices'],
      rating: 4.9
    },
    {
      id: 5,
      name: 'کیبورد مکانیکی Logitech G PRO X',
      description: 'کیبورد گیمینگ مکانیکی با سوئیچ‌های قابل تعویض GX و طراحی تکنین',
      price: 8500000,
      category: 'گیمینگ',
      stock: 12,
      image: '/api/images/keyboard.jpg',
      features: ['سوئیچ قابل تعویض', 'RGB Lightsync', 'طراحی تکنین', 'بازی حرفه‌ای'],
      rating: 4.6
    },
    {
      id: 6,
      name: 'مانیتور گیمینگ Samsung Odyssey G9',
      description: 'مانیتور کروی 49 اینچی با نرخ نوسازی 240Hz و رزولوشن Dual QHD',
      price: 95000000,
      category: 'الکترونیک',
      stock: 5,
      image: '/api/images/monitor.jpg',
      features: ['49 اینچ کروی', '240Hz refresh rate', 'Dual QHD', 'HDR1000'],
      rating: 4.8
    }
  ];

  const { pathname, searchParams } = new URL(request.url, `http://${request.headers.host}`);
  
  try {
    // لاگ درخواست برای دیباگ
    console.log(`📨 ${request.method} ${pathname} - ${new Date().toISOString()}`);

    switch (pathname) {
      case '/api/health':
        return response.status(200).json({
          status: 'healthy',
          service: 'Tetrashop API',
          version: '2.0.0',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production',
          uptime: process.uptime(),
          memory: process.memoryUsage()
        });

      case '/api/products':
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit')) || products.length;
        
        let filteredProducts = products;
        if (category && category !== 'all') {
          filteredProducts = products.filter(p => p.category === category);
        }

        return response.status(200).json({
          success: true,
          data: {
            products: filteredProducts.slice(0, limit),
            count: filteredProducts.length,
            total: products.length,
            pagination: {
              page: 1,
              limit: limit,
              total: filteredProducts.length,
              pages: Math.ceil(filteredProducts.length / limit)
            },
            filters: {
              categories: [...new Set(products.map(p => p.category))],
              priceRange: {
                min: Math.min(...products.map(p => p.price)),
                max: Math.max(...products.map(p => p.price))
              }
            }
          }
        });

      case '/api/products/:id':
        const productId = parseInt(pathname.split('/').pop());
        const product = products.find(p => p.id === productId);
        
        if (!product) {
          return response.status(404).json({
            success: false,
            error: 'محصول یافت نشد'
          });
        }

        return response.status(200).json({
          success: true,
          data: { product }
        });

      case '/':
      case '/api':
        return response.status(200).json({
          success: true,
          message: '🚀 به Tetrashop API خوش آمدید',
          version: '2.0.0',
          timestamp: new Date().toISOString(),
          endpoints: [
            'GET /api/health',
            'GET /api/products',
            'GET /api/products?category=:category&limit=:limit',
            'GET /api/products/:id'
          ],
          documentation: 'https://github.com/tetrashop/tetrashop-projects'
        });

      default:
        return response.status(404).json({
          success: false,
          error: 'Endpoint یافت نشد',
          message: 'مسیر درخواستی موجود نیست',
          availableEndpoints: ['/api/health', '/api/products', '/']
        });
    }
  } catch (error) {
    console.error('❌ خطای سرور:', error);
    
    return response.status(500).json({
      success: false,
      error: 'خطای سرور داخلی',
      message: process.env.NODE_ENV === 'development' ? error.message : 'لطفا稍后重试'
    });
  }
}
