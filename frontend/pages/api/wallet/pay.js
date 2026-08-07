export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'مبلغ نامعتبر است' });
  }

  // شبیه‌سازی موجودی کیف پول IRR
  const walletBalance = 12500000; // موجودی فرضی (ریال)
  if (amount > walletBalance) {
    return res.status(400).json({ error: 'موجودی کیف پول کافی نیست' });
  }

  // در نسخه واقعی باید از حساب کاربر کم شود و تراکنش ثبت شود
  const newBalance = walletBalance - amount;

  res.status(200).json({
    success: true,
    message: `پرداخت با موفقیت انجام شد. موجودی جدید: ${newBalance.toLocaleString()} تومان`,
    newBalance,
  });
}
