import { tetraAuth } from '@tetrasaas/auth';
import { database } from '@tetrasaas/database';

export class AuthController {
  
  /**
   * اعتبارسنجی API Key
   */
  static async validateApiKey(req, res) {
    try {
      const apiKey = req.headers['x-api-key'] || req.body.apiKey;
      
      if (!apiKey) {
        return res.status(400).json({
          error: true,
          code: 'MISSING_API_KEY',
          message: 'API key is required',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      // اعتبارسنجی
      const isValid = await database.validateApiKey(apiKey);
      
      if (!isValid) {
        return res.status(401).json({
          error: true,
          code: 'INVALID_API_KEY',
          message: 'Invalid or inactive API key',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      // دریافت وضعیت کامل
      const status = await tetraAuth.getTenantStatus(apiKey);
      
      res.json({
        success: true,
        valid: true,
        tenantId: status.tenantId,
        apiKeyName: status.apiKeyName,
        isActive: status.isActive,
        rateLimit: status.rateLimit,
        remainingCredits: status.remainingCredits,
        totalSpent: status.totalSpent,
        lastUsed: status.lastUsed,
        createdAt: status.createdAt,
        usage: status.usage,
        timestamp: new Date().toISOString(),
        requestId: req.requestId
      });
      
    } catch (error) {
      console.error('API key validation error:', error);
      res.status(500).json({
        error: true,
        code: 'VALIDATION_ERROR',
        message: 'Failed to validate API key',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * ایجاد API Key جدید
   */
  static async createApiKey(req, res) {
    try {
      const { name, tenantId, rateLimit, initialCredits } = req.body;
      
      if (!name || !tenantId) {
        return res.status(400).json({
          error: true,
          code: 'MISSING_PARAMETERS',
          message: 'Name and tenantId are required',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      const result = await tetraAuth.createApiKey(name, tenantId, {
        rateLimit: rateLimit || 100,
        initialCredits: initialCredits || 0
      });
      
      res.status(201).json({
        success: true,
        message: 'API key created successfully',
        apiKey: result.apiKey,
        tenantId: result.tenantId,
        name: result.name,
        rateLimit: result.rateLimit,
        initialCredits: result.initialCredits,
        createdAt: result.createdAt,
        warning: result.warning,
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
        documentation: 'https://docs.tetrasaas.com/authentication/api-keys'
      });
      
    } catch (error) {
      console.error('API key creation error:', error);
      res.status(500).json({
        error: true,
        code: 'KEY_CREATION_ERROR',
        message: 'Failed to create API key',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * افزایش موجودی اعتبار
   */
  static async addCredits(req, res) {
    try {
      const apiKey = req.headers['x-api-key'] || req.body.apiKey;
      const { amount, reason } = req.body;
      
      if (!apiKey || !amount) {
        return res.status(400).json({
          error: true,
          code: 'MISSING_PARAMETERS',
          message: 'API key and amount are required',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      if (amount <= 0) {
        return res.status(400).json({
          error: true,
          code: 'INVALID_AMOUNT',
          message: 'Amount must be positive',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      const result = await tetraAuth.addCredits(apiKey, amount, reason || 'Manual top-up');
      
      res.json({
        success: true,
        message: 'Credits added successfully',
        tenantId: result.tenantId,
        amountAdded: result.amountAdded,
        newBalance: result.newBalance,
        reason: result.reason,
        timestamp: result.timestamp,
        requestId: req.requestId
      });
      
    } catch (error) {
      console.error('Add credits error:', error);
      
      const statusCode = error.code === 'INVALID_API_KEY' ? 401 : 500;
      
      res.status(statusCode).json({
        error: true,
        code: error.code || 'ADD_CREDITS_ERROR',
        message: error.message || 'Failed to add credits',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * دریافت وضعیت Tenant
   */
  static async getStatus(req, res) {
    try {
      const apiKey = req.headers['x-api-key'] || req.auth?.apiKey;
      
      if (!apiKey) {
        return res.status(400).json({
          error: true,
          code: 'MISSING_API_KEY',
          message: 'API key is required',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      const status = await tetraAuth.getTenantStatus(apiKey);
      
      res.json({
        success: true,
        tenantId: status.tenantId,
        apiKeyName: status.apiKeyName,
        isActive: status.isActive,
        rateLimit: status.rateLimit,
        remainingCredits: status.remainingCredits,
        totalSpent: status.totalSpent,
        usage: status.usage,
        lastUsed: status.lastUsed,
        createdAt: status.createdAt,
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
        links: {
          services: '/api/services',
          documentation: 'https://docs.tetrasaas.com',
          addCredits: '/api/auth/credits'
        }
      });
      
    } catch (error) {
      console.error('Status retrieval error:', error);
      
      const statusCode = error.code === 'INVALID_API_KEY' ? 401 : 500;
      
      res.status(statusCode).json({
        error: true,
        code: error.code || 'STATUS_ERROR',
        message: error.message || 'Failed to retrieve status',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * دریافت گزارش استفاده
   */
  static async getUsageReport(req, res) {
    try {
      const apiKey = req.headers['x-api-key'] || req.auth?.apiKey;
      const days = parseInt(req.query.days) || 30;
      
      if (!apiKey) {
        return res.status(400).json({
          error: true,
          code: 'MISSING_API_KEY',
          message: 'API key is required',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      // اعتبارسنجی
      const isValid = await database.validateApiKey(apiKey);
      if (!isValid) {
        return res.status(401).json({
          error: true,
          code: 'INVALID_API_KEY',
          message: 'Invalid API key',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
      
      const report = await database.getUsageReport(isValid.tenant_id, Math.min(days, 365));
      
      // محاسبه آمار
      const totalRequests = report.reduce((sum, item) => sum + item.request_count, 0);
      const totalCost = report.reduce((sum, item) => sum + (item.total_cost || 0), 0);
      const averageCost = totalRequests > 0 ? totalCost / totalRequests : 0;
      
      res.json({
        success: true,
        tenantId: isValid.tenant_id,
        period: `${days} days`,
        totalRequests,
        totalCost,
        averageCostPerRequest: averageCost,
        services: report.map(item => ({
          service: item.name,
          category: item.category,
          requestCount: item.request_count,
          totalCost: item.total_cost,
          averageCost: item.request_count > 0 ? item.total_cost / item.request_count : 0,
          lastUsed: item.last_used
        })),
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
        exportFormats: ['json', 'csv'],
        exportLink: `/api/usage/export?days=${days}&format=csv`
      });
      
    } catch (error) {
      console.error('Usage report error:', error);
      res.status(500).json({
        error: true,
        code: 'USAGE_REPORT_ERROR',
        message: 'Failed to generate usage report',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default AuthController;
