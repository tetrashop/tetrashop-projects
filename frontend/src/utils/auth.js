export function generateToken(user) {
  const payload = { username: user.username, exp: Date.now() + 3600000 };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
export function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (payload.exp > Date.now()) return payload;
  } catch (e) {}
  return null;
}
