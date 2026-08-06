// ثبت‌نام ساده – فقط برای محیط توسعه
const MOCK_USERS = [
  { username: 'admin', password: 'admin123' },
];

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });

  // در محیط واقعی باید کاربر در دیتابیس ذخیره شود
  MOCK_USERS.push({ username, password });
  res.status(200).json({ success: true, message: 'کاربر با موفقیت ثبت‌نام شد' });
}
