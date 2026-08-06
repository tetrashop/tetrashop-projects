export default function handler(req, res) {
  const { type, currency, search, page = 1, limit = 10 } = req.query;

  // شبیه‌سازی تعداد زیادی تراکنش
  const allTransactions = Array.from({ length: 35 }, (_, i) => ({
    id: i + 1,
    type: ['deposit', 'withdraw', 'transfer'][Math.floor(Math.random() * 3)],
    currency: ['IRR', 'USDT', 'BTC', 'ETH', 'TON'][Math.floor(Math.random() * 5)],
    amount: ['200,000', '50', '0.002', '0.15', '10'][Math.floor(Math.random() * 5)],
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
    time: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000)).toISOString(),
    txHash: '0x' + Math.random().toString(36).substr(2, 10),
    toAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' + i,
    fromAddress: '0xSender' + Math.floor(Math.random() * 1000),
  })).sort((a, b) => new Date(b.time) - new Date(a.time));

  let filtered = allTransactions;

  if (type && type !== 'all') filtered = filtered.filter(t => t.type === type);
  if (currency && currency !== 'all') filtered = filtered.filter(t => t.currency === currency);
  if (search) filtered = filtered.filter(t => t.txHash.includes(search) || t.toAddress.includes(search));

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  res.status(200).json({
    transactions: paged,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  });
}
