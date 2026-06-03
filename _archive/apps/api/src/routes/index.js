import { createClient } from '@tetrasaas/database';
import { authService } from '@tetrasaas/auth';
import express from 'express';

const router = express.Router();

// Helper function for database operations
const db = {
  query: async (sql, params = []) => {
    const client = createClient();
    try {
      const result = await client.query(sql, params);
      return result;
    } finally {
      await client.close();
    }
  }
};

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    
    // Test database connection
    await db.query('SELECT 1 as test');
    
    res.json({
      status: '✅ TetraSaaS API v3.0 is running',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
        arrayBuffers: memory.arrayBuffers
      },
      database: 'Connected via @tetrasaas/database',
      auth: 'Connected via @tetrasaas/auth'
    });
  } catch (error) {
    res.status(500).json({
      status: '❌ Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all services
router.get('/services', async (req, res) => {
  try {
    const services = await db.query(
      'SELECT slug, name, name_en, description, category, icon, price_per_call FROM services WHERE is_active = 1'
    );
    
    const categories = await db.query(
      'SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category'
    );
    
    res.json({
      success: true,
      count: services.length,
      categories: categories.map(c => c.category),
      services: services,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Key validation
router.post('/auth/validate-key', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required',
        code: 'MISSING_API_KEY'
      });
    }
    
    const validation = await authService.validateApiKey(apiKey);
    
    if (!validation.valid) {
      return res.status(401).json({
        success: false,
        message: validation.reason || 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }
    
    res.json({
      success: true,
      tenantId: validation.tenantId,
      name: validation.name,
      rateLimit: validation.rateLimit,
      isActive: validation.isActive,
      message: 'API key is valid',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Create new API key
router.post('/auth/create-key', async (req, res) => {
  try {
    const { name, tenantId, rateLimit = 1000, initialCredits = 0 } = req.body;
    
    if (!name || !tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Name and tenantId are required',
        code: 'MISSING_PARAMETERS'
      });
    }
    
    // Generate API key
    const apiKey = 'ts_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Save to database
    await db.query(
      'INSERT INTO api_keys (api_key, name, tenant_id, rate_limit, is_active) VALUES (?, ?, ?, ?, 1)',
      [apiKey, name, tenantId, rateLimit]
    );
    
    // Add initial credits if specified
    if (initialCredits > 0) {
      await db.query(
        'INSERT OR REPLACE INTO credit_balances (tenant_id, balance, total_spent) VALUES (?, ?, 0)',
        [tenantId, initialCredits]
      );
    }
    
    res.json({
      success: true,
      message: 'API key created successfully',
      apiKey: apiKey,
      tenantId: tenantId,
      name: name,
      rateLimit: rateLimit,
      initialCredits: initialCredits,
      createdAt: new Date().toISOString(),
      warning: 'Store this API key securely! It will not be shown again.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create API key',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get tenant status
router.get('/auth/status', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required',
        code: 'MISSING_API_KEY'
      });
    }
    
    const validation = await authService.validateApiKey(apiKey);
    
    if (!validation.valid) {
      return res.status(401).json({
        success: false,
        message: validation.reason || 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }
    
    // Get credit balance
    const creditResult = await db.query(
      'SELECT balance, total_spent FROM credit_balances WHERE tenant_id = ?',
      [validation.tenantId]
    );
    
    const balance = creditResult.length > 0 ? creditResult[0].balance : 0;
    const totalSpent = creditResult.length > 0 ? creditResult[0].total_spent : 0;
    
    // Get usage stats
    const today = new Date().toISOString().split('T')[0];
    const todayUsage = await db.query(
      'SELECT COUNT(*) as requests, SUM(cost) as cost FROM service_logs WHERE api_key_id IN (SELECT id FROM api_keys WHERE tenant_id = ?) AND DATE(created_at) = ?',
      [validation.tenantId, today]
    );
    
    const last30Days = await db.query(
      `SELECT service_id, COUNT(*) as requests, SUM(cost) as cost 
       FROM service_logs 
       WHERE api_key_id IN (SELECT id FROM api_keys WHERE tenant_id = ?) 
       AND created_at >= datetime('now', '-30 days')
       GROUP BY service_id`,
      [validation.tenantId]
    );
    
    // Get key info
    const keyInfo = await db.query(
      'SELECT created_at, last_used FROM api_keys WHERE tenant_id = ?',
      [validation.tenantId]
    );
    
    res.json({
      success: true,
      tenantId: validation.tenantId,
      apiKeyName: validation.name,
      isActive: validation.isActive,
      rateLimit: validation.rateLimit,
      remainingCredits: balance,
      totalSpent: totalSpent,
      usage: {
        today: {
          requests: todayUsage[0]?.requests || 0,
          cost: todayUsage[0]?.cost || 0
        },
        last30Days: {
          requests: last30Days.reduce((sum, item) => sum + (item.requests || 0), 0),
          cost: last30Days.reduce((sum, item) => sum + (item.cost || 0), 0),
          byService: last30Days.map(item => ({
            serviceId: item.service_id,
            requests: item.requests,
            cost: item.cost
          }))
        }
      },
      lastUsed: keyInfo[0]?.last_used || null,
      createdAt: keyInfo[0]?.created_at || null,
      timestamp: new Date().toISOString(),
      requestId: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get tenant status',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Execute a service
router.post('/services/:slug', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const { slug } = req.params;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required',
        code: 'MISSING_API_KEY'
      });
    }
    
    // Validate API key
    const validation = await authService.validateApiKey(apiKey);
    
    if (!validation.valid) {
      return res.status(401).json({
        success: false,
        message: validation.reason || 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }
    
    // Get service info
    const serviceResult = await db.query(
      'SELECT id, price_per_call FROM services WHERE slug = ? AND is_active = 1',
      [slug]
    );
    
    if (serviceResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive',
        code: 'SERVICE_NOT_FOUND'
      });
    }
    
    const service = serviceResult[0];
    const requiredCredits = service.price_per_call || 0;
    
    // Check credits
    const creditCheck = await authService.checkCredits(validation.tenantId, requiredCredits);
    
    if (!creditCheck.hasEnough) {
      return res.status(402).json({
        success: false,
        message: `Insufficient credits. Required: ${requiredCredits}, Available: ${creditCheck.balance}`,
        code: 'INSUFFICIENT_CREDITS',
        required: requiredCredits,
        available: creditCheck.balance
      });
    }
    
    // TODO: Actually execute the AI service here
    // For now, simulate a response
    const startTime = Date.now();
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const durationMs = Date.now() - startTime;
    
    // Simulate different responses based on service
    let result;
    if (slug === 'sentiment-analysis') {
      const text = req.body.text || '';
      const isPositive = text.includes('عالی') || text.includes('خوب') || text.includes('ممتاز');
      result = {
        sentiment: isPositive ? 'positive' : 'neutral',
        confidence: isPositive ? 0.85 : 0.65,
        keyPhrases: [text.substring(0, Math.min(30, text.length)) + '...'],
        processedText: text
      };
    } else {
      result = {
        message: `Service '${slug}' executed successfully`,
        input: req.body,
        processingTime: durationMs + 'ms'
      };
    }
    
    // Deduct credits
    await authService.deductCredits(validation.tenantId, requiredCredits);
    
    // Log the request
    const keyInfo = await db.query(
      'SELECT id FROM api_keys WHERE api_key = ?',
      [apiKey]
    );
    
    const apiKeyId = keyInfo.length > 0 ? keyInfo[0].id : null;
    
    await authService.logRequest(
      apiKeyId,
      service.id,
      req.body,
      result,
      'SUCCESS',
      requiredCredits,
      req.ip,
      req.headers['user-agent']
    );
    
    // Update last used
    await db.query(
      'UPDATE api_keys SET last_used = datetime("now") WHERE api_key = ?',
      [apiKey]
    );
    
    res.json({
      success: true,
      data: result,
      usage: {
        creditsUsed: requiredCredits,
        remainingCredits: creditCheck.balance - requiredCredits,
        durationMs: durationMs
      },
      timestamp: new Date().toISOString(),
      requestId: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Service execution failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get service categories
router.get('/services/categories', async (req, res) => {
  try {
    const categories = await db.query(
      'SELECT DISTINCT category, COUNT(*) as service_count FROM services WHERE is_active = 1 GROUP BY category ORDER BY category'
    );
    
    res.json({
      success: true,
      count: categories.length,
      categories: categories,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
