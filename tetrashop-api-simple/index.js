const http = require('http');

const products = [
  {
    id: 1,
    name: 'لپ‌تاپ گیمینگ ASUS ROG',
    description: 'لپ‌تاپ گیمینگ با پردازنده Core i7 و کارت گرافیک RTX 4060',
    price: 38500000,
    category: 'الکترونیک',
    stock: 8
  },
  {
    id: 2,
    name: 'هدفون بی‌سیم Sony WH-1000XM4',
    description: 'هدفون با نویزکنسلی پیشرفته و کیفیت صدای استثنایی',
    price: 12500000,
    category: 'صوتی', 
    stock: 15
  },
  {
    id: 3,
    name: 'ماوس گیمینگ Razer Viper',
    description: 'ماوس با حسگر نوری پیشرفته و طراحی ارگونومیک',
    price: 3200000,
    category: 'گیمینگ',
    stock: 25
  },
  {
    id: 4,
    name: 'کتاب آموزش React پیشرفته',
    description: 'کتاب جامع آموزش React با پروژه‌های واقعی',
    price: 450000,
    category: 'کتاب',
    stock: 50
  }
];

const server = http.createServer((req, res) => {
  // تنظیم CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (pathname === '/api/health' || pathname === '/api/health/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Tetrashop API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
  }
  else if (pathname === '/api/products' || pathname === '/api/products/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        products: products,
        count: products.length
      }
    }));
  }
  else if (pathname === '/' || pathname === '/api') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: '🎯 به Tetrashop API خوش آمدید',
      version: '1.0.0'
    }));
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({
      success: false,
      error: 'Endpoint یافت نشد'
    }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 سرور Tetrashop API اجرا شد روی پورت ${PORT}`);
});
