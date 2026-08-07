import { WALLET_ADDRESSES, TONCENTER_API_KEY } from '../../../src/utils/walletConfig';

export default async function handler(req, res) {
  const tonAddress = WALLET_ADDRESSES.TON;
  const apiKey = TONCENTER_API_KEY;

  try {
    const url = `https://toncenter.com/api/v2/getTransactions?address=${tonAddress}&limit=20`;
    const response = await fetch(url, {
      headers: apiKey ? { 'X-API-Key': apiKey } : {},
    });
    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.error || 'خطا در دریافت تاریخچه');
    }

    // تبدیل تراکنش‌ها به فرمت مشترک
    const transactions = data.result.map(tx => ({
      id: tx.transaction_id.hash,
      type: tx.in_msg.source === '' ? 'deposit' : tx.out_msgs.length > 0 ? 'transfer' : 'other',
      currency: 'TON',
      amount: (parseInt(tx.in_msg.value || '0') / 1e9).toFixed(2),
      status: tx.description.compute_ph.exit_code === 0 ? 'completed' : 'failed',
      time: new Date(tx.utime * 1000).toISOString(),
      txHash: tx.transaction_id.hash,
      fromAddress: tx.in_msg.source || 'ماینینگ',
      toAddress: tx.out_msgs.length > 0 ? tx.out_msgs[0].destination : '',
    }));

    res.status(200).json({ transactions });
  } catch (error) {
    // fallback
    res.status(200).json({
      transactions: [
        {
          id: 9999,
          type: 'transfer',
          currency: 'TON',
          amount: '20',
          status: 'completed',
          time: new Date().toISOString(),
          txHash: 'UQBgjRhKP_MEUN8pcfxTMmY-uj8RdRyb9yl_czQ6VcSRV3Ol',
          toAddress: WALLET_ADDRESSES.TON,
          fromAddress: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7Jy4K9wS5dP3pLMg',
        },
      ],
      source: 'fallback (simulated)',
    });
  }
}
