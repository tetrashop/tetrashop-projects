import { WALLET_ADDRESSES, TONCENTER_API_KEY } from '../../../src/utils/walletConfig';

export default async function handler(req, res) {
  try {
    const tonAddress = WALLET_ADDRESSES.TON;
    const apiKey = TONCENTER_API_KEY;
    const url = `https://toncenter.com/api/v2/getAddressBalance?address=${tonAddress}`;
    const headers = apiKey ? { 'X-API-Key': apiKey } : {};
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!data.ok) throw new Error(data.error || 'خطا در دریافت اطلاعات');

    const balanceTON = (parseInt(data.result) / 1e9).toFixed(4);
    res.status(200).json({
      currency: 'TON',
      symbol: '💎',
      name: 'تون کوین',
      balance: balanceTON,
      icon: '💎',
      type: 'crypto',
      address: tonAddress,
      source: 'toncenter.com (real-time)',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    // Fallback در صورت خطا
    res.status(200).json({
      currency: 'TON',
      symbol: '💎',
      name: 'تون کوین',
      balance: '0.00',
      icon: '💎',
      type: 'crypto',
      address: WALLET_ADDRESSES.TON,
      source: 'fallback (simulated)',
      lastUpdated: new Date().toISOString(),
    });
  }
}
