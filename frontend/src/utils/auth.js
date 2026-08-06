// پیاده‌سازی ساده JWT – در محیط Vercel با کلید مخفی واقعی جایگزین شود
const SECRET = process.env.JWT_SECRET || 'tetrashop-secret-key-change-in-production';

export function generateToken(user) {
  // استفاده از jsonwebtoken در محیط واقعی – اینجا یک شبیه‌ساز ساده برای لوکال
  try {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });
  } catch (e) {
    // fallback ساده (فقط برای تست لوکال)
    const payload = { username: user.username, exp: Date.now() + 3600000 };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}

export function verifyToken(token) {
  try {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, SECRET);
  } catch (e) {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (payload.exp > Date.now()) return payload;
    } catch (e2) {}
    return null;
  }
}
