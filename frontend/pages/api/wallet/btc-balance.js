import { WALLET_ADDRESSES } from '../../../src/utils/walletConfig';

export default async function handler(req, res) {
  const addr = WALLET_ADDRESSES.BTC;
  if (!addr) return res.status(200).json({ currency: 'BTC', balance: null, message: 'آدرس BTC تنظیم نشده' });

  try {
    const url = `https://blockchain.info/q/addressbalance/${addr}`;
    const response = await fetch(url);
    const satoshi = await response.text();
    const btc = (parseInt(satoshi) / 1e8).toFixed(8);
    res.status(200).json({ currency: 'BTC', symbol: '₿', name: 'بیت‌کوین', balance: btc, icon: '🪙', type: 'crypto', address: addr, source: 'blockchain.info' });
  } catch (e) {
    res.status(200).json({ currency: 'BTC', balance: null, error: 'خطا در دریافت' });
  }
}
