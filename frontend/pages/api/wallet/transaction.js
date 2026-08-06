export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, currency, amount } = req.body;

  if (!type || !currency || !amount) {
    return res.status(400).json({ error: 'لطفاً همه فیلدها را پر کنید.' });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'مقدار باید یک عدد مثبت باشد.' });
  }

  // شبیه‌سازی ایجاد تراکنش
  const newTx = {
    id: Math.floor(Math.random() * 10000),
    type,
    currency,
    amount: amount.toString(),
    status: 'pending',
    time: new Date().toISOString(),
    txHash: type === 'deposit' ? '0x' + Math.random().toString(36).substr(2, 10) : 'IRR-' + Date.now(),
  };

  // در اینجا می‌توانید تراکنش را در حافظه یا پایگاه داده ذخیره کنید

  res.status(200).json({ success: true, transaction: newTx, message: 'تراکنش با موفقیت ثبت شد' });
}
