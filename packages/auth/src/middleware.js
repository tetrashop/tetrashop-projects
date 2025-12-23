import { TetraAuth, AuthError } from './index.js';

/**
 * میدلور اعتبارسنجی برای Express.js
 */
export function authMiddleware(options = {}) {
  const auth = new TetraAuth(options);

  return async (req, res, next) => {
    try {
      // استخراج API Key از هدرها
      const apiKey = extractApiKey(req);
      
      if (!apiKey && options.requireApiKey !== false) {
        throw new AuthError('API key is required', 'MISSING_API_KEY');
      }

      // تشخیص سرویس از مسیر یا هدر
      const serviceSlug = extractServiceSlug(req);

      // اعتبارسنجی
      const authResult = await auth.authenticate(apiKey, serviceSlug);

      // افزودن اطلاعات احراز هویت به درخواست
      req.auth = authResult;
      req.tenantId = authResult.tenantId;
      req.apiKeyId = authResult.apiKeyId;
      req.servicePrice = authResult.servicePrice;

      // ادامه پردازش
      next();

    } catch (error) {
      handleAuthError(error, res);
    }
  };
}

/**
 * میدلور پردازش درخواست و کسر هزینه
 */
export function requestProcessorMiddleware(options = {}) {
  const auth = new TetraAuth(options);

  return async (req, res, next) => {
    const startTime = Date.now();
    let requestResult = null;

    try {
      // اگر اطلاعات احراز هویت موجود نیست، ابتدا اعتبارسنجی کن
      if (!req.auth) {
        const apiKey = extractApiKey(req);
        const serviceSlug = extractServiceSlug(req);
        
        const authResult = await auth.authenticate(apiKey, serviceSlug);
        req.auth = authResult;
        req.tenantId = authResult.tenantId;
        req.apiKeyId = authResult.apiKeyId;
      }

      // پردازش درخواست و کسر هزینه
      requestResult = await auth.processRequest(
        req.auth.apiKey,
        req.auth.serviceSlug,
        {
          input: req.body,
          metadata: {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            method: req.method,
            path: req.path
          }
        }
      );

      // ذخیره نتیجه برای استفاده در میدلورهای بعدی
      req.requestResult = requestResult;
      req.requestId = requestResult.requestId;

      // اضافه کردن هدرهای پاسخ
      res.set('X-Request-ID', requestResult.requestId);
      res.set('X-Tenant-ID', requestResult.tenantId);
      res.set('X-RateLimit-Limit', requestResult.rateLimit);
      res.set('X-RateLimit-Remaining', 
        Math.max(0, requestResult.rateLimit - (requestResult.todayRequests || 0))
      );
      res.set('X-Credits-Remaining', requestResult.remainingCredits - requestResult.deductedCredits);

      next();

    } catch (error) {
      // محاسبه مدت زمان
      const duration = Date.now() - startTime;

      // پاسخ خطا
      const statusCode = getStatusCodeForError(error);
      
      res.status(statusCode).json({
        error: true,
        code: error.code || 'PROCESSING_ERROR',
        message: error.message,
        requestId: requestResult?.requestId,
        durationMs: duration,
        timestamp: new Date().toISOString()
      });
    }
  };
}

/**
 * میدلور تکمیل درخواست موفق
 */
export function successHandlerMiddleware() {
  return async (req, res, next) => {
    // ذخیره تابع پاسخ اصلی
    const originalJson = res.json.bind(res);

    // بازنویسی تابع json برای لاگ‌گیری موفقیت
    res.json = function(data) {
      // اگر درخواست موفق بود و requestResult وجود دارد
      if (res.statusCode >= 200 && res.statusCode < 300 && req.requestResult) {
        // اینجا می‌توانید لاگ موفقیت را ذخیره کنید
        // برای سادگی فعلاً فقط کنسول لاگ می‌کنیم
        console.log(`Request ${req.requestId} completed successfully`);
      }

      // فراخوانی تابع اصلی
      return originalJson(data);
    };

    next();
  };
}

/**
 * میدلور بررسی وضعیت
 */
export function statusMiddleware() {
  return async (req, res, next) => {
    if (req.path === '/status' || req.path === '/health') {
      try {
        const apiKey = extractApiKey(req);
        if (apiKey) {
          const auth = new TetraAuth();
          const status = await auth.getTenantStatus(apiKey);
          
          return res.json({
            status: 'healthy',
            tenant: status.tenantId,
            credits: status.remainingCredits,
            rateLimit: status.rateLimit,
            usage: status.usage.today,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        // در صورت خطا، وضعیت عمومی را برگردان
      }
      
      return res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: 'TetraSaaS Auth Service'
      });
    }
    
    next();
  };
}

// توابع کمکی
function extractApiKey(req) {
  return req.headers['x-api-key'] || 
         req.headers['authorization']?.replace('Bearer ', '') ||
         req.query.apiKey;
}

function extractServiceSlug(req) {
  return req.headers['x-service'] || 
         req.path.split('/')[1] || 
         'general';
}

function getStatusCodeForError(error) {
  const code = error.code;
  
  const statusMap = {
    'MISSING_API_KEY': 401,
    'INVALID_API_KEY': 401,
    'SERVICE_NOT_FOUND': 404,
    'SERVICE_INACTIVE': 403,
    'RATE_LIMIT': 429,
    'INSUFFICIENT_CREDITS': 402,
    'AUTH_FAILED': 403,
    'PROCESSING_ERROR': 500
  };

  return statusMap[code] || 400;
}

function handleAuthError(error, res) {
  const statusCode = getStatusCodeForError(error);
  
  const response = {
    error: true,
    code: error.code || 'AUTH_ERROR',
    message: error.message,
    timestamp: new Date().toISOString()
  };

  // اضافه کردن اطلاعات اضافی برای خطاهای خاص
  if (error.code === 'RATE_LIMIT') {
    const resetTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعت بعد
    response.retryAfter = resetTime.toISOString();
  }

  if (error.code === 'INSUFFICIENT_CREDITS') {
    response.solution = 'Add credits to your account to continue using the service';
  }

  res.status(statusCode).json(response);
}

// Export all middleware functions
export default {
  auth: authMiddleware,
  processor: requestProcessorMiddleware,
  success: successHandlerMiddleware,
  status: statusMiddleware,
  createAuthMiddleware: authMiddleware
};
