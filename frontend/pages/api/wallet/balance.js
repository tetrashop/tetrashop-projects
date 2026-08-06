import { BALE_CONFIG } from '../../../src/utils/baleConfig';

export default function handler(req, res) {
  const wallets = [
    { 
      currency: 'IRR', symbol: '﷼', name: 'ریال ایران', 
      balance: (12500000 + Math.floor(Math.random() * 5000000)).toLocaleString(), 
      icon: '🇮🇷', type: 'fiat', 
      walletId: BALE_CONFIG.WALLET_ID 
    },
    { 
      currency: 'USDT', symbol: '₮', name: 'تتر', 
      balance: (500 + Math.floor(Math.random() * 300)).toFixed(2), 
      icon: '💎', type: 'crypto', 
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7' 
    },
    { 
      currency: 'BTC', symbol: '₿', name: 'بیت‌کوین', 
      balance: (0.015 + Math.random() * 0.05).toFixed(6), 
      icon: '🪙', type: 'crypto', 
      walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' 
    },
    { 
      currency: 'ETH', symbol: 'Ξ', name: 'اتریوم', 
      balance: (0.5 + Math.random() * 2).toFixed(4), 
      icon: '🔷', type: 'crypto', 
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7' 
    },
    { 
      currency: 'TON', symbol: '💎', name: 'تون کوین', 
      balance: (25 + Math.floor(Math.random() * 50)).toFixed(0), 
      icon: '💠', type: 'crypto', 
      walletAddress: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7Jy4K9wS5dP3pLMg' 
    },
  ];

  const transactions = [
    { id: 1, type: 'deposit', currency: 'USDT', amount: '200', status: 'completed', time: new Date(Date.now() - 7200000).toISOString(), txHash: '0xabc123...def456' },
    { id: 2, type: 'withdraw', currency: 'IRR', amount: '500,000', status: 'pending', time: new Date(Date.now() - 3600000).toISOString(), txHash: 'IRR-20250806-001' },
    { id: 3, type: 'deposit', currency: 'BTC', amount: '0.002', status: 'completed', time: new Date(Date.now() - 86400000).toISOString(), txHash: '0x789ghi...012jkl' },
    { id: 4, type: 'transfer', currency: 'USDT', amount: '50', status: 'completed', time: new Date(Date.now() - 43200000).toISOString(), txHash: '0x345mno...678pqr' },
    { id: 5, type: 'payment', currency: 'IRR', amount: '99,000', status: 'completed', time: new Date(Date.now() - 108000000).toISOString(), description: 'خرید ربات بله' },
  ];

  res.status(200).json({ 
    wallets, 
    transactions,
    baleWallet: {
      id: BALE_CONFIG.WALLET_ID,
      username: BALE_CONFIG.BOT_USERNAME,
      status: 'active',
    }
  });
}
