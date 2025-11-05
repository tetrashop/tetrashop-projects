/**
 * 🚀 سرور بهینه شده برای Vercel - با responseهای JSON صحیح
 */

export default function handler(request, response) {
  // تنظیم headerهای صحیح برای JSON
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // مدیریت CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  try {
    // سلامت سرویس
    if (pathname === '/api/health' || pathname === '/api/health/') {
      response.status(200).json({
        status: 'healthy',
        service: 'Tetrashop100',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        deployment: 'vercel-optimized',
        message: '🚀 سرور با موفقیت اجرا شد'
      });
      return;
    }
    
    // محصولات
    else if (pathname === '/api/products' || pathname === '/api/products/') {
      response.status(200).json({
        success: true,
        data: {
          products: [
            { id: 1, name: 'لپ‌تاپ گیمینگ', price: 25000000, category: 'الکترونیک', stock: 15 },
            { id: 2, name: 'هدفون بی‌سیم', price: 3500000, category: 'صوتی', stock: 30 },
            { id: 3, name: 'کتاب برنامه‌نویسی', price: 450000, category: 'کتاب', stock: 100 }
          ],
          count: 3,
          source: 'vercel-deployment'
        }
      });
      return;
    }
    
    // کاربران
    else if (pathname === '/api/users' || pathname === '/api/users/') {
      response.status(200).json({
        success: true,
        data: {
          users: [
            { id: 1, name: 'رضا محمدی', email: 'reza@example.com' },
            { id: 2, name: 'سارا احمدی', email: 'sara@example.com' }
          ],
          count: 2
        }
      });
      return;
    }
    
    // صفحه اصلی
    else if (pathname === '/' || pathname === '/api') {
      response.status(200).json({
        success: true,
        message: '🎯 به Tetrashop100 روی Vercel خوش آمدید',
        data: {
          version: '3.0.0',
          timestamp: new Date().toISOString(),
          endpoints: [
            'GET /api/health',
            'GET /api/products', 
            'GET /api/users'
          ],
          documentation: 'https://github.com/tetrashop/tetrashop-projects'
        }
      });
      return;
    }
    
    // مسیر یافت نشد
    else {
      response.status(404).json({
        success: false,
        error: 'Endpoint یافت نشد',
        message: 'مسیر درخواستی موجود نیست',
        available_endpoints: [
          '/api/health',
          '/api/products',
          '/api/users',
          '/'
        ]
      });
      return;
    }
    
  } catch (error) {
    console.error('❌ خطا در پردازش درخواست:', error);
    response.status(500).json({
      success: false,
      error: 'خطای سرور داخلی',
      message: error.message
    });
  }
}
