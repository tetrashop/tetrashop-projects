/**
 * 🚀 سرور فوق ساده برای Vercel - بدون crash
 */

export default function handler(request, response) {
  try {
    // تنظیم headers
    response.setHeader('Content-Type', 'application/json');
    
    const path = request.url;
    
    // سلامت
    if (path.includes('/health') || path === '/') {
      return response.status(200).json({
        status: 'healthy',
        service: 'Tetrashop100',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        message: '✅ سرور با موفقیت اجرا شد'
      });
    }
    
    // محصولات
    if (path.includes('/products')) {
      return response.status(200).json({
        products: [
          { id: 1, name: 'لپ‌تاپ گیمینگ', price: 25000000 },
          { id: 2, name: 'هدفون بی‌سیم', price: 3500000 }
        ],
        count: 2
      });
    }
    
    // سایر مسیرها
    response.status(200).json({
      message: '🎯 Tetrashop100 API',
      endpoints: ['/api/health', '/api/products']
    });
    
  } catch (error) {
    // مدیریت خطا
    response.status(200).json({
      error: 'خطای جزئی',
      message: 'سرور فعال است اما خطایی رخ داد'
    });
  }
}
