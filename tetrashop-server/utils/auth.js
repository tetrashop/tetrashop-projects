import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tetrashop100-secret-key-2024';

/**
 * هش کردن رمز عبور
 */
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * مقایسه رمز عبور با هش
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * تولید توکن JWT
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET
  );
};

/**
 * اعتبارسنجی توکن JWT
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('توکن نامعتبر است');
  }
};

/**
 * تولید کد تأیید
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * بررسی انقضای کد تأیید
 */
export const isCodeExpired = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMinutes = (now - created) / (1000 * 60);
  return diffInMinutes > 10; // کد 10 دقیقه اعتبار دارد
};
