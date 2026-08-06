export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
  if (password.length < 4) return res.status(400).json({ error: 'رمز عبور حداقل ۴ کاراکتر باشد' });
  res.status(201).json({ success: true, message: 'ثبت‌نام با موفقیت انجام شد' });
}
