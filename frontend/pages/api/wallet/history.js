export default function handler(req, res) {
  // تراکنش ثابت: ارسال ۲۰ TON به آدرس مشخص (بدون شرح)
  const fixedTonTx = {
    id: 9999,
    type: 'transfer',
    currency: 'TON',
    amount: '20',
    status: 'completed',
    time: new Date().toISOString(),
    txHash: 'UQDCaALLojM-btEeHJFkoixa_86NZZZJA3gMGC-u96a_G5el', // آدرس مقصد
    toAddress: 'UQDCaALLojM-btEeHJFkoixa_86NZZZJA3gMGC-u96a_G5el',
    fromAddress: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7Jy4K9wS5dP3pLMg', // آدرس فرضی مبدأ
  };

  // تولید تراکنش‌های تصادفی (مانند قبل)
  const randomTransactions = Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    type: ['deposit', 'withdraw', 'transfer'][Math.floor(Math.random() * 3)],
    currency: ['IRR', 'USDT', 'BTC', 'ETH', 'TON'][Math.floor(Math.random() * 5)],
    amount: ['200,000', '50', '0.002', '0.15', '10'][Math.floor(Math.random() * 5)],
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
    time: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000)).toISOString(),
    txHash: '0x' + Math.random().toString(36).substr(2, 10),
    toAddress: '0x' + Math.random().toString(36).substr(2, 10),
  })).sort((a, b) => new Date(b.time) - new Date(a.time));

  // ترکیب: تراکنش TON در ابتدا
  const transactions = [fixedTonTx, ...randomTransactions];

  res.status(200).json({ transactions });
}
