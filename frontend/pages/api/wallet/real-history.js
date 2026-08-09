const TON_ADDRESS = process.env.NEXT_PUBLIC_TON_ADDRESS || 'UQBgjRhKP_MEUN8pcfxTMmY-uj8RdRyb9yl_czQ6VcSRV3Ol';
const API_KEY = process.env.TONCENTER_API_KEY || '';

export default async function handler(req, res) {
  try {
    const url = `https://toncenter.com/api/v2/getTransactions?address=${TON_ADDRESS}&limit=20`;
    const headers = API_KEY ? { 'X-API-Key': API_KEY } : {};
    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!data.ok) throw new Error(data.error || 'خطا در دریافت تاریخچه');

    const transactions = data.result.map(tx => {
      const inValue = parseInt(tx.in_msg.value || '0') / 1e9;
      const outValue = tx.out_msgs.length > 0 ? parseInt(tx.out_msgs[0].value || '0') / 1e9 : 0;
      return {
        id: tx.transaction_id.hash,
        type: inValue > 0 ? 'deposit' : 'transfer',
        currency: 'TON',
        amount: (inValue > outValue ? inValue : outValue).toFixed(4),
        status: tx.description.compute_ph.exit_code === 0 ? 'completed' : 'failed',
        time: new Date(tx.utime * 1000).toISOString(),
        txHash: tx.transaction_id.hash,
        fromAddress: tx.in_msg.source || '',
        toAddress: tx.out_msgs.length > 0 ? tx.out_msgs[0].destination : '',
      };
    });

    res.status(200).json({ transactions });
  } catch (error) {
    // Fallback
    res.status(200).json({
      transactions: [],
      source: 'fallback (offline)',
    });
  }
}
