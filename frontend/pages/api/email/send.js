export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { to, subject, text } = req.body;
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return res.status(500).json({ error: 'سرویس ایمیل تنظیم نشده است.' });
  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to, subject, text });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'خطا در ارسال ایمیل' });
  }
}
