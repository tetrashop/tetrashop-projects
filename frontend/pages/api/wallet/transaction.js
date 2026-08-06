export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { type, currency, amount } = req.body;
  if (!type || !currency || !amount) return res.status(400).json({ error: 'اطلاعات ناقص است' });
  const newTx = {
    id: Math.floor(Math.random() * 10000),
    type,
    currency,
    amount: amount.toString(),
    status: 'pending',
    time: new Date().toISOString(),
    txHash: type === 'deposit' ? '0x' + Math.random().toString(36).substr(2, 10) : 'IRR-' + Date.now(),
  };
  res.status(200).json({ success: true, transaction: newTx, message: 'تراکنش با موفقیت ثبت شد' });
}
