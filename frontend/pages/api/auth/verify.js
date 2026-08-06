import { verifyToken } from '../../../src/utils/auth';
export default function handler(req, res) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const decoded = verifyToken(auth.split(' ')[1]);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });
  res.status(200).json({ valid: true, username: decoded.username });
}
