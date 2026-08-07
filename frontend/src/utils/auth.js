import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || 'default-fallback-key-change-in-production';

export function generateToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role || 'user' },
    SECRET,
    { expiresIn: '1h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
