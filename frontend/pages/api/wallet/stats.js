export default function handler(req, res) {
  const totalBalance = 18500000; // شبیه‌سازی
  const monthlyChange = 12.5; // درصد
  const weeklyChart = [12000000, 13500000, 12800000, 15000000, 16200000, 17500000, 18500000];

  res.status(200).json({
    totalBalance,
    monthlyChange,
    weeklyChart,
    lastUpdate: new Date().toLocaleTimeString('fa-IR'),
  });
}
