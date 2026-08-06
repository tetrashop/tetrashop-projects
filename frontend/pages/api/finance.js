export default function handler(req, res) {
  res.status(200).json({ balance: (2500000 + Math.floor(Math.random() * 500000)).toLocaleString(), transactions: Math.floor(Math.random() * 20) + 5, revenue: (12000000 + Math.floor(Math.random() * 5000000)).toLocaleString(), chart: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)), lastUpdate: new Date().toLocaleTimeString('fa-IR'), status: 'online' });
}
