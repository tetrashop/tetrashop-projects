export default function handler(req, res) {
  const transactions = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    type: ['deposit', 'withdraw', 'transfer'][Math.floor(Math.random() * 3)],
    currency: ['IRR', 'USDT', 'BTC', 'ETH'][Math.floor(Math.random() * 4)],
    amount: ['200,000', '50', '0.002', '0.15'][Math.floor(Math.random() * 4)],
    status: ['completed', 'pending'][Math.floor(Math.random() * 2)],
    time: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000)).toISOString(),
    txHash: '0x' + Math.random().toString(36).substr(2, 10),
  })).sort((a, b) => new Date(b.time) - new Date(a.time));
  res.status(200).json({ transactions });
}
