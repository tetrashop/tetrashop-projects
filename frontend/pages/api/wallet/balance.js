export default function handler(req, res) {
  res.status(200).json({
    wallets: [
      { currency: 'IRR', balance: '12,500,000', symbol: '﷼', icon: '🇮🇷' },
      { currency: 'USDT', balance: '500', symbol: '₮', icon: '💎' },
    ],
    transactions: [
      { id: 1, type: 'deposit', currency: 'USDT', amount: '200', status: 'completed', time: new Date().toISOString(), txHash: '0xabc...' },
    ]
  });
}
