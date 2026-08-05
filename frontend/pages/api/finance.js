export default function handler(req, res) {
  // شبیه‌سازی داده‌های مالی تصادفی
  const balance = (2500000 + Math.floor(Math.random() * 500000)).toLocaleString();
  const transactions = Math.floor(Math.random() * 20) + 5;
  const revenue = (12000000 + Math.floor(Math.random() * 5000000)).toLocaleString();
  const lastUpdate = new Date().toLocaleTimeString('fa-IR');

  // نمودار قیمت هفتگی (داده‌های تصادفی)
  const chart = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

  res.status(200).json({
    balance,
    transactions,
    revenue,
    lastUpdate,
    chart,
    status: 'online',
  });
}
