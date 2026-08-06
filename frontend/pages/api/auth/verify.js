import { verifyToken } from '../../../src/utils/auth';

export default function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'توکن وجود ندارد' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) return res.status(401).json({ error: 'توکن نامعتبر است' });

  res.status(200).json({ valid: true, username: decoded.username });
}
