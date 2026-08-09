import { WALLET_ADDRESSES } from '../../../src/utils/walletConfig';

export default async function handler(req, res) {
  const addr = WALLET_ADDRESSES.USDT_TRC20;
  if (!addr) return res.status(200).json({ currency: 'USDT', balance: null, message: 'آدرس USDT تنظیم نشده' });

  try {
    // Tronscan API رایگان برای TRC20 USDT
    const url = `https://apilist.tronscan.org/api/account?address=${addr}`;
    const response = await fetch(url);
    const data = await response.json();
    const usdt = data.trc20token_balances?.find(t => t.tokenId === 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
    const balance = usdt ? (parseInt(usdt.balance) / 1e6).toFixed(2) : '0.00';
    res.status(200).json({ currency: 'USDT', symbol: '₮', name: 'تتر (TRC20)', balance, icon: '💎', type: 'crypto', address: addr, source: 'tronscan.org' });
  } catch (e) {
    res.status(200).json({ currency: 'USDT', balance: null, error: 'خطا در دریافت' });
  }
}
