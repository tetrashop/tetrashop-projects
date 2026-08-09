import { generateToken } from '../../../src/utils/auth';
import { readCollection } from '../../../src/lib/storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });

  let users = await readCollection('users');
  if (!users || users.length === 0) {
    users = [
      { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
      { id: '2', username: 'manager', password: 'manager123', role: 'manager' },
    ];
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });

  const token = generateToken(user);
  res.status(200).json({ token, username: user.username, role: user.role });
}
