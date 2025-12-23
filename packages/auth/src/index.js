import { createClient } from '@tetrasaas/database';

// Auth service implementation
const authService = {
  async validateApiKey(apiKey) {
    try {
      const db = createClient();
      const result = await db.query(
        'SELECT * FROM api_keys WHERE api_key = ? AND is_active = 1',
        [apiKey]
      );
      
      await db.close();
      
      if (result.length === 0) {
        return { valid: false, reason: 'Invalid or inactive API key' };
      }
      
      const keyData = result[0];
      return {
        valid: true,
        tenantId: keyData.tenant_id,
        name: keyData.name,
        rateLimit: keyData.rate_limit,
        isActive: keyData.is_active === 1
      };
    } catch (error) {
      console.error('Auth validation error:', error);
      return { valid: false, reason: 'Internal server error' };
    }
  },

  async checkCredits(tenantId, requiredAmount) {
    try {
      const db = createClient();
      const result = await db.query(
        'SELECT balance FROM credit_balances WHERE tenant_id = ?',
        [tenantId]
      );
      
      await db.close();
      
      if (result.length === 0) {
        return { hasEnough: false, balance: 0, required: requiredAmount };
      }
      
      const balance = result[0].balance || 0;
      return {
        hasEnough: balance >= requiredAmount,
        balance: balance,
        required: requiredAmount,
        remaining: balance - requiredAmount
      };
    } catch (error) {
      console.error('Credit check error:', error);
      return { hasEnough: false, balance: 0, required: requiredAmount };
    }
  },

  async deductCredits(tenantId, amount) {
    try {
      const db = createClient();
      await db.query(
        'UPDATE credit_balances SET balance = balance - ?, total_spent = total_spent + ?, updated_at = datetime("now") WHERE tenant_id = ?',
        [amount, amount, tenantId]
      );
      await db.close();
      return { success: true };
    } catch (error) {
      console.error('Credit deduction error:', error);
      return { success: false, error: error.message };
    }
  },

  async logRequest(apiKeyId, serviceId, input, output, status, cost, ip, userAgent) {
    try {
      const db = createClient();
      await db.query(
        `INSERT INTO service_logs 
        (api_key_id, service_id, input_data, output_data, status, cost, ip_address, user_agent) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [apiKeyId, serviceId, JSON.stringify(input), JSON.stringify(output), status, cost, ip, userAgent]
      );
      await db.close();
      return { success: true };
    } catch (error) {
      console.error('Logging error:', error);
      return { success: false };
    }
  }
};

export { authService };
