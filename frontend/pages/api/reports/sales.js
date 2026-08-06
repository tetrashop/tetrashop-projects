export default function handler(req, res) {
  const weeklySales = [1200000, 980000, 1450000, 2100000, 1750000, 2300000, 1950000];
  const monthlySales = [
    { month: 'فروردین', value: 8500000 },
    { month: 'اردیبهشت', value: 9200000 },
    { month: 'خرداد', value: 11000000 },
  ];
  const topProducts = [
    { name: 'هدفون بی‌سیم', sold: 24 },
    { name: 'ماگ', sold: 18 },
    { name: 'کتاب React', sold: 15 },
  ];

  res.status(200).json({
    weeklySales,
    monthlySales,
    topProducts,
    totalRevenue: '28,500,000',
    orderCount: 145,
    averageOrderValue: '196,551',
  });
}
