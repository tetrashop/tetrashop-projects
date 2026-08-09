const TON_ADDRESS = process.env.NEXT_PUBLIC_TON_ADDRESS || 'UQBgjRhKP_MEUN8pcfxTMmY-uj8RdRyb9yl_czQ6VcSRV3Ol';
const API_KEY = process.env.TONCENTER_API_KEY || '';

export default async function handler(req, res) {
  try {
    const url = `https://toncenter.com/api/v2/getAddressBalance?address=${TON_ADDRESS}`;
    const headers = API_KEY ? { 'X-API-Key': API_KEY } : {};
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!data.ok) throw new Error(data.error || 'خطا در دریافت موجودی');

    // تبدیل نانوتون به TON
    const balanceNano = parseInt(data.result);
    const balanceTON = (balanceNano / 1e9).toFixed(4);

    res.status(200).json({
      currency: 'TON',
      symbol: '💎',
      name: 'تون کوین',
      balance: balanceTON,
      icon: '💎',
      type: 'crypto',
      address: TON_ADDRESS,
      source: 'toncenter.com (real-time)',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    // Fallback (اگر اینترنت نبود)
    res.status(200).json({
      currency: 'TON',
      symbol: '💎',
      name: 'تون کوین',
      balance: '0.00',
      icon: '💎',
      type: 'crypto',
      address: TON_ADDRESS,
      source: 'fallback (offline)',
      lastUpdated: new Date().toISOString(),
    });
  }
}
