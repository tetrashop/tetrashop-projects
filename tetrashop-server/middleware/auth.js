import { verifyToken } from '../utils/auth.js';

/**
 * middleware احراز هویت
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'دسترسی غیرمجاز - توکن احراز هویت required است'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'توکن نامعتبر است'
    });
  }
};

/**
 * middleware بررسی نقش کاربر
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'دسترسی غیرمجاز'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'دسترسی غیرمجاز - سطح دسترسی کافی نیست'
      });
    }

    next();
  };
};

/**
 * middleware اعتبارسنجی درخواست
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'داده‌های ورودی نامعتبر',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

/**
 * middleware Rate Limiting
 */
export const rateLimit = (windowMs, maxRequests) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // پاک کردن درخواست‌های قدیمی
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // شمارش درخواست‌های فعلی
    const userRequests = Array.from(requests.values())
      .filter(timestamp => timestamp > windowStart && timestamp <= now)
      .length;
    
    if (userRequests >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'تعداد درخواست‌ها بیش از حد مجاز است',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    requests.set(ip, now);
    next();
  };
};
