export default function handler(req, res) {
  res.status(200).json({ balance: '2,500,000', transactions: 12, revenue: '12,000,000' });
}
