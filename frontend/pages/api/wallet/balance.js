export default function handler(req, res) {
  const wallets = [
    { currency: 'IRR', symbol: '﷼', name: 'ریال ایران', balance: '12,500,000', icon: '🇮🇷', type: 'fiat', address: 'IRR-WALLET-001', change24h: '+2.5%' },
    { currency: 'USDT', symbol: '₮', name: 'تتر', balance: '500.00', icon: '💎', type: 'crypto', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7', change24h: '+1.2%' },
    { currency: 'BTC', symbol: '₿', name: 'بیت‌کوین', balance: '0.015', icon: '🪙', type: 'crypto', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', change24h: '-0.8%' },
    { currency: 'ETH', symbol: 'Ξ', name: 'اتریوم', balance: '0.52', icon: '🔷', type: 'crypto', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7', change24h: '+3.1%' },
    { currency: 'TON', symbol: '💎', name: 'تون کوین', balance: '25', icon: '💠', type: 'crypto', address: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7Jy4K9wS5dP3pLMg', change24h: '-1.5%' },
  ];

  res.status(200).json({ wallets });
}
