import { generateToken } from '../../../src/utils/auth';

// همان کاربران (هم‌گام با register)
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'manager', password: 'manager123', role: 'manager' },
];

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });

  const token = generateToken(user);
  res.status(200).json({ token, username: user.username, role: user.role });
}
