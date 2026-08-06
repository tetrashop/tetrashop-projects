// ذخیره‌سازی ساده در حافظه (در محیط واقعی باید از پایگاه داده استفاده شود)
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'manager', password: 'manager123', role: 'manager' },
];

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
  if (password.length < 4) return res.status(400).json({ error: 'رمز عبور حداقل ۴ کاراکتر باشد' });

  // بررسی تکراری بودن
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'این نام کاربری قبلاً ثبت شده است' });
  }

  const newUser = { username, password, role: 'user' };
  users.push(newUser);

  res.status(201).json({ success: true, message: 'ثبت‌نام با موفقیت انجام شد' });
}
