export default function handler(req, res) {
  // شبیه‌سازی داده‌های آنالیتیکس
  res.status(200).json({
    pageViews: 12500,
    uniqueVisitors: 3200,
    bounceRate: '45%',
    avgSessionDuration: '3m 20s',
    topPages: [
      { path: '/', views: 5200 },
      { path: '/products', views: 2100 },
      { path: '/digital-products', views: 1800 },
    ],
    chartData: [200, 450, 300, 600, 550, 700, 650],
  });
}
