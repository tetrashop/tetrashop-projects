/**
 * 🚀 سرور بهینه شده برای Vercel - بدون خطا
 */

export default function handler(request, response) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (pathname === '/api/health' || pathname === '/') {
      response.status(200).json({
        status: 'healthy',
        service: 'Tetrashop100',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        deployment: 'vercel-optimized',
        message: '🚀 سرور با موفقیت اجرا شد'
      });
    }
    else if (pathname === '/api/products') {
      response.status(200).json({
        products: [
          { id: 1, name: 'لپ‌تاپ گیمینگ', price: 25000000, category: 'الکترونیک', stock: 15 },
          { id: 2, name: 'هدفون بی‌سیم', price: 3500000, category: 'صوتی', stock: 30 },
          { id: 3, name: 'کتاب برنامه‌نویسی', price: 450000, category: 'کتاب', stock: 100 }
        ],
        count: 3,
        source: 'vercel-deployment'
      });
    }
    else if (pathname === '/api/users') {
      response.status(200).json({
        users: [
          { id: 1, name: 'رضا محمدی', email: 'reza@example.com' },
          { id: 2, name: 'سارا احمدی', email: 'sara@example.com' }
        ],
        count: 2
      });
    }
    else {
      response.status(200).json({
        message: '🎯 به Tetrashop100 روی Vercel خوش آمدید',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        endpoints: [
          '/api/health',
          '/api/products',
          '/api/users'
        ],
        documentation: 'https://github.com/tetrashop/tetrashop-projects'
      });
    }
  } catch (error) {
    console.error('❌ خطا در پردازش درخواست:', error);
    response.status(500).json({
      error: 'خطای سرور',
      message: error.message
    });
  }
}
