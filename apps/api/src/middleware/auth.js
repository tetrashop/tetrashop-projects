import { tetraAuth, createAuthMiddleware as baseAuthMiddleware } from '@tetrasaas/auth';

/**
 * میدلور احراز هویت پیشرفته برای TetraSaaS API
 */
export function authMiddleware(options = {}) {
  const auth = tetraAuth;
  
  return async (req, res, next) => {
    try {
      // استخراج API Key
      const apiKey = extractApiKey(req);
      
      if (!apiKey && options.requireApiKey !== false) {
        return res.status(401).json({
          error: true,
          code: 'MISSING_API_KEY',
          message: 'API key is required. Use X-API-Key header or Authorization: Bearer',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }

      // تشخیص سرویس از مسیر
      const serviceSlug = extractServiceFromPath(req.path);
      
      if (!serviceSlug && options.requireService !== false) {
        return res.status(400).json({
          error: true,
          code: 'SERVICE_REQUIRED',
          message: 'Service must be specified in path or X-Service header',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }

      // اعتبارسنجی
      const authResult = await auth.authenticate(apiKey, serviceSlug);
      
      // افزودن اطلاعات به درخواست
      req.auth = authResult;
      req.tenantId = authResult.tenantId;
      req.apiKeyId = authResult.apiKeyId;
      req.serviceId = authResult.serviceId;
      req.servicePrice = authResult.servicePrice;
      req.rateLimit = authResult.rateLimit;
      req.remainingCredits = authResult.remainingCredits;

      // اضافه کردن هدرهای پاسخ
      res.set({
        'X-Tenant-ID': authResult.tenantId,
        'X-RateLimit-Limit': authResult.rateLimit,
        'X-RateLimit-Remaining': calculateRemainingRequests(authResult),
        'X-Credits-Remaining': authResult.remainingCredits - authResult.servicePrice
      });

      next();

    } catch (error) {
      handleAuthError(error, req, res);
    }
  };
}

/**
 * میدلور پردازش درخواست و کسر اعتبار
 */
export function requestProcessorMiddleware() {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    try {
      // اگر احراز هویت انجام نشده، ابتدا انجام بده
      if (!req.auth) {
        const authMiddlewareInstance = authMiddleware();
        return authMiddlewareInstance(req, res, next);
      }

      // پردازش درخواست و کسر اعتبار
      const requestResult = await tetraAuth.processRequest(
        req.auth.apiKey || extractApiKey(req),
        req.auth.serviceSlug || extractServiceFromPath(req.path),
        {
          input: req.body,
          metadata: {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            method: req.method,
            path: req.path,
            requestId: req.requestId
          }
        }
      );

      // ذخیره نتیجه
      req.requestResult = requestResult;
      req.processedRequest = true;

      // ادامه پردازش
      next();

    } catch (error) {
      const duration = Date.now() - startTime;
      
      res.status(getStatusCodeForError(error)).json({
        error: true,
        code: error.code || 'PROCESSING_ERROR',
        message: error.message,
        requestId: req.requestId,
        durationMs: duration,
        timestamp: new Date().toISOString()
      });
    }
  };
}

/**
 * میدلور مدیریت سرویس‌ها
 */
export function serviceMiddleware() {
  return async (req, res, next) => {
    try {
      const serviceSlug = extractServiceFromPath(req.path);
      
      if (serviceSlug) {
        const database = await import('@tetrasaas/database');
        const service = await database.database.getServiceBySlug(serviceSlug);
        
        if (!service) {
          return res.status(404).json({
            error: true,
            code: 'SERVICE_NOT_FOUND',
            message: `Service '${serviceSlug}' not found`,
            requestId: req.requestId,
            timestamp: new Date().toISOString()
          });
        }
        
        if (!service.is_active) {
          return res.status(403).json({
            error: true,
            code: 'SERVICE_INACTIVE',
            message: `Service '${serviceSlug}' is currently inactive`,
            requestId: req.requestId,
            timestamp: new Date().toISOString()
          });
        }
        
        req.service = service;
      }
      
      next();
    } catch (error) {
      console.error('Service middleware error:', error);
      next();
    }
  };
}

/**
 * میدلور لاگ‌گیری پاسخ
 */
export function responseLoggerMiddleware() {
  return (req, res, next) => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Capture response data
    res.send = function(body) {
      logResponse(req, res, body);
      return originalSend.call(this, body);
    };
    
    res.json = function(body) {
      logResponse(req, res, body);
      return originalJson.call(this, body);
    };
    
    next();
  };
}

// توابع کمکی
function extractApiKey(req) {
  return req.headers['x-api-key'] || 
         req.headers['authorization']?.replace('Bearer ', '') ||
         req.query.apiKey;
}

function extractServiceFromPath(path) {
  // استخراج نام سرویس از مسیر /api/services/:service
  const match = path.match(/^\/api\/services\/([^\/?#]+)/);
  return match ? match[1] : null;
}

function calculateRemainingRequests(authResult) {
  // محاسبه درخواست‌های باقیمانده (ساده‌شده)
  // در نسخه کامل از دیتابیس استفاده می‌شود
  return Math.max(0, authResult.rateLimit - (authResult.todayRequests || 0));
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

function handleAuthError(error, req, res) {
  const statusCode = getStatusCodeForError(error);
  
  const response = {
    error: true,
    code: error.code || 'AUTH_ERROR',
    message: error.message,
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  };

  // اضافه کردن اطلاعات اضافی
  if (error.code === 'RATE_LIMIT') {
    const resetTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    response.retryAfter = resetTime.toISOString();
    response.rateLimitReset = resetTime.toISOString();
  }

  if (error.code === 'INSUFFICIENT_CREDITS') {
    response.solution = 'Please add credits to your account to continue using our services';
    response.documentation = 'https://docs.tetrasaas.com/billing/credits';
  }

  res.status(statusCode).json(response);
}

function logResponse(req, res, body) {
  // لاگ پاسخ‌های موفق
  if (res.statusCode >= 200 && res.statusCode < 300 && req.processedRequest) {
    console.log(`[${req.requestId}] Request completed: ${res.statusCode} ${req.method} ${req.path}`);
    
    // در نسخه کامل، این اطلاعات در دیتابیس ذخیره می‌شود
    if (req.requestResult && req.auth) {
      // تکمیل لاگ درخواست
      setTimeout(async () => {
        try {
          const { tetraAuth } = await import('@tetrasaas/auth');
          await tetraAuth.completeRequest(req.requestResult, {
            result: typeof body === 'string' ? JSON.parse(body) : body,
            metadata: {
              statusCode: res.statusCode,
              responseTime: Date.now() - req.startTime,
              responseSize: JSON.stringify(body).length
            }
          });
        } catch (error) {
          // لاگ خطا در صورت عدم موفقیت
          console.error(`Failed to complete request log: ${error.message}`);
        }
      }, 0);
    }
  }
}

// Export همه میدلورها
export default {
  auth: authMiddleware,
  processor: requestProcessorMiddleware,
  service: serviceMiddleware,
  logger: responseLoggerMiddleware
};
