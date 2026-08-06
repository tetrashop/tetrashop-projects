import { generateToken } from '../../../src/utils/auth';
const USERS = [{ username: 'admin', password: 'admin123' }];
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
  res.status(200).json({ token: generateToken(user), username: user.username });
}
