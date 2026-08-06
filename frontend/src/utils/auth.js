export function generateToken(user) {
  const payload = { username: user.username, role: user.role || 'user', exp: Date.now() + 3600000 };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
export function verifyToken(token) {
  try { const p = JSON.parse(Buffer.from(token, 'base64').toString('utf-8')); if (p.exp > Date.now()) return p; } catch (e) {}
  return null;
}
