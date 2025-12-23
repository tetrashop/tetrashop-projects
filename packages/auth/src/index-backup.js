import database from '@tetrasaas/database';

class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

class RateLimitError extends AuthError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT');
  }
}

class InsufficientCreditsError extends AuthError {
  constructor(message = 'Insufficient credits') {
    super(message, 'INSUFFICIENT_CREDITS');
  }
}

export class TetraAuth {
  constructor(options = {}) {
    this.options = {
      requireApiKey: true,
      enforceRateLimiting: true,
      enforceCreditSystem: true,
      logRequests: true,
      ...options
    };
  }

  /**
   * اعتبارسنجی کامل API Key
   */
  async authenticate(apiKey, serviceSlug) {
    try {
      // 1. بررسی وجود API Key
      if (!apiKey) {
        throw new AuthError('API key is required', 'MISSING_API_KEY');
      }

      // 2. اعتبارسنجی در دیتابیس
      const keyData = await database.validateApiKey(apiKey);
      if (!keyData) {
        throw new AuthError('Invalid or inactive API key', 'INVALID_API_KEY');
      }

      // 3. دریافت اطلاعات سرویس
      const service = await database.getServiceBySlug(serviceSlug);
      if (!service) {
        throw new AuthError('Service not found', 'SERVICE_NOT_FOUND');
      }

      if (!service.is_active) {
        throw new AuthError('Service is not active', 'SERVICE_INACTIVE');
      }

      // 4. بررسی Rate Limit (ساده‌شده)
      if (this.options.enforceRateLimiting) {
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = await database.query(`
          SELECT COUNT(*) as count 
          FROM service_logs sl
          JOIN api_keys ak ON sl.api_key_id = ak.id
          WHERE ak.api_key = ? 
            AND date(sl.created_at) = ?
        `, [apiKey, today]);

        if (todayLogs[0]?.count >= keyData.rate_limit) {
          throw new RateLimitError(`Daily limit of ${keyData.rate_limit} requests exceeded`);
        }
      }

      // 5. بررسی موجودی اعتبار
      if (this.options.enforceCreditSystem) {
        const balance = await database.getBalance(keyData.tenant_id);
        if (!balance || balance.balance < service.price_per_call) {
          throw new InsufficientCreditsError(
            `Insufficient credits. Required: ${service.price_per_call}, Available: ${balance?.balance || 0}`
          );
        }
      }

      // 6. بروزرسانی زمان آخرین استفاده
      await database.query(
        'UPDATE api_keys SET last_used = datetime("now") WHERE id = ?',
        [keyData.id]
      );

      return {
        success: true,
        tenantId: keyData.tenant_id,
        apiKeyId: keyData.id,
        serviceId: service.id,
        servicePrice: service.price_per_call,
        rateLimit: keyData.rate_limit,
        remainingCredits: keyData.balance,
        metadata: {
          serviceName: service.name,
          serviceCategory: service.category
        }
      };

    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(`Authentication failed: ${error.message}`, 'AUTH_FAILED');
    }
  }

  /**
   * پردازش درخواست و کسر هزینه
   */
  async processRequest(apiKey, serviceSlug, requestData = {}) {
    const startTime = Date.now();
    let authResult = null;

    try {
      // 1. اعتبارسنجی
      authResult = await this.authenticate(apiKey, serviceSlug);

      // 2. کسر هزینه از موجودی
      if (this.options.enforceCreditSystem) {
        await database.deductBalance(
          authResult.tenantId,
          authResult.servicePrice
        );
      }

      // 3. لاگ درخواست
      if (this.options.logRequests) {
        const logData = {
          input: requestData.input || {},
          output: requestData.output || {},
          status: 'PROCESSING',
          metadata: requestData.metadata || {}
        };

        await database.logRequest(
          authResult.apiKeyId,
          authResult.serviceId,
          logData
        );
      }

      const duration = Date.now() - startTime;

      return {
        ...authResult,
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        processingTime: duration,
        deductedCredits: authResult.servicePrice,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      // لاگ خطا
      if (this.options.logRequests && authResult) {
        await database.logRequest(
          authResult.apiKeyId,
          authResult.serviceId,
          {
            input: requestData.input || {},
            output: { error: error.message },
            status: 'FAILED',
            errorMessage: error.message
          }
        );
      }

      throw error;
    }
  }

  /**
   * تکمیل درخواست موفق
   */
  async completeRequest(requestResult, outputData) {
    try {
      if (this.options.logRequests && requestResult.apiKeyId) {
        await database.logRequest(
          requestResult.apiKeyId,
          requestResult.serviceId,
          {
            input: outputData.input || {},
            output: outputData.result || outputData,
            status: 'SUCCESS',
            metadata: outputData.metadata || {}
          }
        );
      }

      return {
        ...requestResult,
        completed: true,
        finalOutput: outputData,
        completedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error completing request:', error);
      return requestResult;
    }
  }

  /**
   * مدیریت API Key
   */
  async createApiKey(name, tenantId, options = {}) {
    const rateLimit = options.rateLimit || 100;
    const initialCredits = options.initialCredits || 0;

    try {
      // ایجاد API Key جدید
      const result = await database.createApiKey(name, tenantId, rateLimit);

      // تنظیم موجودی اولیه
      if (initialCredits > 0) {
        await database.addBalance(tenantId, initialCredits, 'Initial credits');
      }

      return {
        success: true,
        apiKey: result.apiKey,
        tenantId: result.tenantId,
        name: result.name,
        rateLimit,
        initialCredits,
        createdAt: new Date().toISOString(),
        warning: 'Store this API key securely! It will not be shown again.'
      };

    } catch (error) {
      throw new AuthError(`Failed to create API key: ${error.message}`, 'KEY_CREATION_FAILED');
    }
  }

  /**
   * بررسی وضعیت Tenant
   */
  async getTenantStatus(apiKey) {
    try {
      const keyData = await database.validateApiKey(apiKey);
      if (!keyData) {
        throw new AuthError('Invalid API key');
      }

      const balance = await database.getBalance(keyData.tenant_id);
      const usageReport = await database.getUsageReport(keyData.tenant_id, 30);

      // محاسبه آمار
      const totalRequests = usageReport.reduce((sum, item) => sum + item.request_count, 0);
      const totalCost = usageReport.reduce((sum, item) => sum + (item.total_cost || 0), 0);
      const today = new Date().toISOString().split('T')[0];

      const todayUsage = await database.query(`
        SELECT COUNT(*) as count, SUM(cost) as cost
        FROM service_logs sl
        JOIN api_keys ak ON sl.api_key_id = ak.id
        WHERE ak.api_key = ? AND date(sl.created_at) = ?
      `, [apiKey, today]);

      return {
        tenantId: keyData.tenant_id,
        apiKeyName: keyData.name,
        isActive: keyData.is_active === 1,
        rateLimit: keyData.rate_limit,
        remainingCredits: balance?.balance || 0,
        totalSpent: balance?.total_spent || 0,
        usage: {
          today: {
            requests: todayUsage[0]?.count || 0,
            cost: todayUsage[0]?.cost || 0
          },
          last30Days: {
            requests: totalRequests,
            cost: totalCost,
            byService: usageReport
          }
        },
        lastUsed: keyData.last_used,
        createdAt: keyData.created_at
      };

    } catch (error) {
      throw new AuthError(`Failed to get tenant status: ${error.message}`, 'STATUS_FAILED');
    }
  }

  /**
   * افزایش موجودی
   */
  async addCredits(apiKey, amount, reason = 'Manual top-up') {
    try {
      const keyData = await database.validateApiKey(apiKey);
      if (!keyData) {
        throw new AuthError('Invalid API key');
      }

      await database.addBalance(keyData.tenant_id, amount, reason);

      const newBalance = await database.getBalance(keyData.tenant_id);

      return {
        success: true,
        tenantId: keyData.tenant_id,
        amountAdded: amount,
        newBalance: newBalance?.balance || 0,
        reason,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new AuthError(`Failed to add credits: ${error.message}`, 'ADD_CREDITS_FAILED');
    }
  }

  /**
   * غیرفعال کردن API Key
   */
  async deactivateApiKey(apiKey) {
    try {
      const result = await database.query(
        'UPDATE api_keys SET is_active = 0 WHERE api_key = ?',
        [apiKey]
      );

      return {
        success: result.changes > 0,
        message: result.changes > 0 
          ? 'API key deactivated successfully' 
          : 'API key not found or already inactive'
      };

    } catch (error) {
      throw new AuthError(`Failed to deactivate API key: ${error.message}`, 'DEACTIVATE_FAILED');
    }
  }
}

// Export classes and utilities
export { AuthError, RateLimitError, InsufficientCreditsError };

// Create default instance
export const tetraAuth = new TetraAuth();

// Middleware generator for Express/HTTP servers
export function createAuthMiddleware(options = {}) {
  const auth = new TetraAuth(options);

  return async function authMiddleware(req, res, next) {
    try {
      // Extract API key from headers
      const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
      
      // Extract service from path or headers
      const serviceSlug = req.headers['x-service'] || req.path.split('/')[1];

      const authResult = await auth.authenticate(apiKey, serviceSlug);

      // Attach auth data to request
      req.auth = authResult;
      req.tenantId = authResult.tenantId;
      req.apiKeyId = authResult.apiKeyId;

      next();
    } catch (error) {
      const statusCode = error.code === 'INVALID_API_KEY' ? 401 :
                        error.code === 'RATE_LIMIT' ? 429 :
                        error.code === 'INSUFFICIENT_CREDITS' ? 402 : 403;

      res.status(statusCode).json({
        error: true,
        code: error.code || 'AUTH_ERROR',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };
}

export default tetraAuth;
