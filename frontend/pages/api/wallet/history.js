export default function handler(req, res) {
  // تراکنش ثابت ۱: ارسال ۲۰ TON
  const tonTx = {
    id: 9999,
    type: 'transfer',
    currency: 'TON',
    amount: '20',
    status: 'completed',
    time: new Date(Date.now() - 60000).toISOString(), // ۱ دقیقه قبل
    txHash: 'UQDCaALLojM-btEeHJFkoixa_86NZZZJA3gMGC-u96a_G5el',
    toAddress: 'UQDCaALLojM-btEeHJFkoixa_86NZZZJA3gMGC-u96a_G5el',
    fromAddress: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7Jy4K9wS5dP3pLMg',
  };

  // تراکنش ثابت ۲: ارسال ۳۰۰ USDT به آدرس TRC20
  const usdtTx = {
    id: 9998,
    type: 'transfer',
    currency: 'USDT',
    amount: '300',
    status: 'completed',
    time: new Date().toISOString(),               // همین الان
    txHash: 'TKbvdkdxfXEQJM38e5yGdTMQmNuDN34Tx2', // آدرس مقصد (TRC20)
    toAddress: 'TKbvdkdxfXEQJM38e5yGdTMQmNuDN34Tx2',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7', // آدرس مبدأ فرضی
  };

  // تراکنش‌های تصادفی
  const randomTxs = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    type: ['deposit', 'withdraw', 'transfer'][Math.floor(Math.random() * 3)],
    currency: ['IRR', 'USDT', 'BTC', 'ETH', 'TON'][Math.floor(Math.random() * 5)],
    amount: ['200,000', '50', '0.002', '0.15', '10'][Math.floor(Math.random() * 5)],
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
    time: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000)).toISOString(),
    txHash: '0x' + Math.random().toString(36).substr(2, 10),
    toAddress: '0x' + Math.random().toString(36).substr(2, 10),
  })).sort((a, b) => new Date(b.time) - new Date(a.time));

  // ترکیب: تراکنش USDT اول، سپس TON، سپس تصادفی
  const transactions = [usdtTx, tonTx, ...randomTxs];

  res.status(200).json({ transactions });
}
