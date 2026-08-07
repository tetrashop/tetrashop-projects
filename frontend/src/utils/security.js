import { verifyToken } from './auth';

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'توکن وجود ندارد' });
      }
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'توکن نامعتبر است' });
      }
      // افزودن کاربر به req
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(500).json({ error: 'خطای سرور' });
    }
  };
}

export function adminOnly(handler) {
  return withAuth(async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }
    return handler(req, res);
  });
}
