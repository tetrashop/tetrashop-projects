import { generateToken, comparePassword } from '../../../src/utils/auth';

// کاربران نمونه (در واقعیت باید از پایگاه داده بیایند و رمزها هش شده باشند)
const users = [
  { username: 'admin', passwordHash: '$2a$10$placeholder', role: 'admin' }, // مقدار واقعی پس از هش شدن
  { username: 'manager', passwordHash: '$2a$10$placeholder', role: 'manager' },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });

  // برای سادگی، در این نسخه هنوز رمزها هش نشده‌اند (توسعه‌ی بعدی)
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });

  // در نسخهٔ واقعی: const isValid = await comparePassword(password, user.passwordHash);
  // فعلاً ساده:
  const plainPasswords = { admin: 'admin123', manager: 'manager123' };
  if (plainPasswords[username] !== password) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });

  const token = generateToken(user);
  res.status(200).json({ token, username: user.username, role: user.role });
}
