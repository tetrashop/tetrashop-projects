export function generateToken(user) {
  // در محیط واقعی از jsonwebtoken استفاده کنید
  try {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'tetrashop-secret', { expiresIn: '1h' });
  } catch (e) {
    const payload = { username: user.username, exp: Date.now() + 3600000 };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}

export function verifyToken(token) {
  try {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, process.env.JWT_SECRET || 'tetrashop-secret');
  } catch (e) {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (payload.exp > Date.now()) return payload;
    } catch (e2) {}
    return null;
  }
}
