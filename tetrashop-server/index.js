export default async function handler(request, response) {
  // تنظیم headers
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // مدیریت CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  const sampleProducts = [
    {
      _id: '1',
      name: 'لپ‌تاپ گیمینگ ASUS',
      description: 'لپ‌تاپ گیمینگ با کارایی بالا',
      price: 25000000,
      category: 'الکترونیک',
      stock: 15,
      featured: true
    },
    {
      _id: '2', 
      name: 'هدفون بی‌سیم Sony',
      description: 'هدفون با کیفیت صدای عالی',
      price: 3500000,
      category: 'صوتی',
      stock: 30,
      featured: true
    }
  ];

  try {
    if (pathname === '/api/health') {
      response.status(200).json({
        status: 'healthy',
        service: 'Tetrashop100',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        database: 'in-memory'
      });
      return;
    }

    if (pathname === '/api/products') {
      response.status(200).json({
        success: true,
        data: {
          products: sampleProducts,
          count: sampleProducts.length
        }
      });
      return;
    }

    if (pathname === '/' || pathname === '/api') {
      response.status(200).json({
        success: true,
        message: '🎯 به Tetrashop100 خوش آمدید',
        version: '3.0.0'
      });
      return;
    }

    response.status(404).json({
      success: false,
      error: 'Endpoint یافت نشد'
    });

  } catch (error) {
    response.status(500).json({
      success: false,
      error: 'خطای سرور داخلی'
    });
  }
}
