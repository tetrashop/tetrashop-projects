export default function handler(req, res) {
  const balance = (2500000 + Math.floor(Math.random() * 500000)).toLocaleString();
  const transactions = Math.floor(Math.random() * 20) + 5;
  const revenue = (12000000 + Math.floor(Math.random() * 5000000)).toLocaleString();
  const chart = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

  res.status(200).json({
    balance,
    transactions,
    revenue,
    chart,
    lastUpdate: new Date().toLocaleTimeString('fa-IR'),
    status: 'online',
  });
}
