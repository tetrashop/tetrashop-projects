import { WALLET_ADDRESSES } from '../../../src/utils/walletConfig';

export default async function handler(req, res) {
  const addr = WALLET_ADDRESSES.ETH;
  if (!addr) return res.status(200).json({ currency: 'ETH', balance: null, message: 'آدرس ETH تنظیم نشده' });

  try {
    const apiKey = process.env.ETHERSCAN_API_KEY || '';
    const url = `https://api.etherscan.io/api?module=account&action=balance&address=${addr}&tag=latest&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== '1') throw new Error(data.message);
    const eth = (parseInt(data.result) / 1e18).toFixed(4);
    res.status(200).json({ currency: 'ETH', symbol: 'Ξ', name: 'اتریوم', balance: eth, icon: '🔷', type: 'crypto', address: addr, source: 'etherscan.io' });
  } catch (e) {
    res.status(200).json({ currency: 'ETH', balance: null, error: 'خطا در دریافت' });
  }
}
