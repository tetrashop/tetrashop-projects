export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { toAddress, amount } = req.body;
  if (!toAddress || !amount) return res.status(400).json({ error: 'آدرس مقصد و مقدار الزامی است' });

  // بررسی وجود کلید خصوصی (نباید در کد باشد)
  const privateKey = process.env.TON_PRIVATE_KEY;
  if (!privateKey) {
    // در نبود کلید، تراکنش شبیه‌سازی می‌شود
    return res.status(200).json({
      simulated: true,
      message: `⚠️ تراکنش شبیه‌سازی شده: ارسال ${amount} TON به ${toAddress}. برای تراکنش واقعی، TON_PRIVATE_KEY را در Vercel تنظیم کنید.`,
      warning: 'این تراکنش واقعی نیست. لطفاً برای ارسال واقعی از کیف پول خود (Tonkeeper) استفاده کنید.',
    });
  }

  try {
    // در اینجا می‌توان با استفاده از کتابخانه TON تراکنش واقعی انجام داد
    // اما به دلیل مسائل امنیتی، توصیه می‌شود تراکنش واقعی از کیف پول کاربر انجام شود.
    // صرفاً یک شبیه‌سازی دیگر با پیام واضح
    return res.status(200).json({
      simulated: true,
      message: `⚠️ تراکنش واقعی به دلیل محدودیت امنیتی انجام نشد. لطفاً از کیف پول خود برای ارسال ${amount} TON به ${toAddress} استفاده کنید.`,
      warning: 'کلید خصوصی شما در سرور ذخیره شده است که خطرناک است. توصیه می‌شود آن را حذف کنید.',
    });
  } catch (error) {
    res.status(500).json({ error: 'خطا در ارسال تراکنش: ' + error.message });
  }
}
