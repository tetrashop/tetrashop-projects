let subscribers = [];
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'ایمیل معتبر نیست' });
    subscribers.push(email);
    return res.status(200).json({ success: true, message: 'عضویت با موفقیت انجام شد' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
