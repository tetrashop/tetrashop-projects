// آدرس‌های واقعی کیف پول – می‌توانید این مقادیر را در .env.local تغییر دهید
export const WALLET_ADDRESSES = {
  TON: process.env.NEXT_PUBLIC_TON_ADDRESS || 'UQBgjRhKP_MEUN8pcfxTMmY-uj8RdRyb9yl_czQ6VcSRV3Ol',
  USDT_TRC20: process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS || 'TKbvdkdxfXEQJM38e5yGdTMQmNuDN34Tx2',
};

// API Key رایگان از toncenter.com (اختیاری)
export const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || '';
