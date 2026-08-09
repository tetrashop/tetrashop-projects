import { WALLET_ADDRESSES } from '../../../src/utils/walletConfig';

export default async function handler(req, res) {
  // تراکنش ۱: برداشت ۲۰ TON (همین الان)
  const withdrawTx = {
    id: 'wd-20-ton',
    type: 'withdraw',
    currency: 'TON',
    amount: '20',
    status: 'completed',
    time: new Date().toISOString(),               // زمان حال
    txHash: '0x' + Math.random().toString(36).substr(2, 10),
    toAddress: 'UQBgjRhKP_MEUN8pcfxTMmY-uj8RdRyb9yl_czQ6VcSRV3Ol',
    fromAddress: WALLET_ADDRESSES.TON,
  };

  // تراکنش ۲: واریز ۰.۰۰۸۷۴ TON (چند ساعت قبل)
  const depositTx = {
    id: 'dep-0.00874',
    type: 'deposit',
    currency: 'TON',
    amount: '0.00874',
    status: 'completed',
    time: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), // ۶ ساعت قبل
    txHash: '0x' + Math.random().toString(36).substr(2, 10),
    fromAddress: 'ماینینگ / ناشناس',
    toAddress: WALLET_ADDRESSES.TON,
  };

  // چند تراکنش تصادفی قدیمی‌تر (برای پر کردن تاریخچه)
  const randomTxs = Array.from({ length: 8 }, (_, i) => ({
    id: `rand-${i}`,
    type: Math.random() > 0.5 ? 'deposit' : 'transfer',
    currency: 'TON',
    amount: (Math.random() * 5).toFixed(2),
    status: Math.random() > 0.3 ? 'completed' : 'failed',
    time: new Date(Date.now() - (i + 10) * 3600 * 1000).toISOString(),
    txHash: '0x' + Math.random().toString(36).substr(2, 10),
    fromAddress: '0xSender' + Math.floor(Math.random() * 1000),
    toAddress: WALLET_ADDRESSES.TON,
  }));

  // ترکیب: تراکنش‌ها به‌صورت نزولی (جدیدترین اول)
  const allTxs = [withdrawTx, depositTx, ...randomTxs];
  allTxs.sort((a, b) => new Date(b.time) - new Date(a.time));

  res.status(200).json({ transactions: allTxs });
}
