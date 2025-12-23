import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../tetrasaas.db');
const execAsync = promisify(exec);

function sanitizeSQL(value) {
  if (typeof value === 'string') {
    return value.replace(/'/g, "''");
  }
  return value;
}

function toJSON(value) {
  try {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  } catch {
    return String(value);
  }
}

export const database = {
  // Execute SQL query and return results
  async query(sql, params = []) {
    try {
      // Create a temporary SQL file
      const tempFile = path.join(__dirname, `temp_${Date.now()}.sql`);
      const escapedParams = params.map(p => {
        if (p === null || p === undefined) return 'NULL';
        if (typeof p === 'number') return p;
        if (typeof p === 'boolean') return p ? 1 : 0;
        return `'${sanitizeSQL(String(p))}'`;
      });
      
      // Replace ? with parameters
      let finalSQL = sql;
      for (const param of escapedParams) {
        finalSQL = finalSQL.replace('?', param);
      }
      
      fs.writeFileSync(tempFile, `${finalSQL};`);
      
      // Execute via sqlite3 command
      const { stdout } = await execAsync(`sqlite3 -json ${dbPath} < ${tempFile}`);
      
      // Cleanup
      fs.unlinkSync(tempFile);
      
      try {
        return stdout ? JSON.parse(stdout) : [];
      } catch {
        return stdout || [];
      }
    } catch (error) {
      console.error('Query error:', error.message);
      throw error;
    }
  },

  // Get all services
  async getAllServices() {
    return this.query('SELECT * FROM services ORDER BY id');
  },

  // Get service by slug
  async getServiceBySlug(slug) {
    const result = await this.query('SELECT * FROM services WHERE slug = ? LIMIT 1', [slug]);
    return result[0] || null;
  },

  // Get services by category
  async getServicesByCategory(category) {
    return this.query('SELECT * FROM services WHERE category = ? AND is_active = 1 ORDER BY name', [category]);
  },

  // Validate API key
  async validateApiKey(apiKey) {
    const result = await this.query(`
      SELECT ak.*, cb.balance 
      FROM api_keys ak
      LEFT JOIN credit_balances cb ON ak.tenant_id = cb.tenant_id
      WHERE ak.api_key = ? AND ak.is_active = 1
      LIMIT 1
    `, [apiKey]);
    return result[0] || null;
  },

  // Log request
  async logRequest(apiKeyId, serviceId, data) {
    const service = await this.query('SELECT price_per_call FROM services WHERE id = ? LIMIT 1', [serviceId]);
    const cost = service[0]?.price_per_call || 0;
    
    return this.query(`
      INSERT INTO service_logs 
      (api_key_id, service_id, input_data, output_data, cost, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `, [
      apiKeyId,
      serviceId,
      toJSON(data.input || {}),
      toJSON(data.output || {}),
      cost,
      data.status || 'SUCCESS'
    ]);
  },

  // Deduct balance
  async deductBalance(tenantId, amount) {
    return this.query(`
      UPDATE credit_balances 
      SET balance = balance - ?, total_spent = total_spent + ?, updated_at = datetime('now')
      WHERE tenant_id = ? AND balance >= ?
    `, [amount, amount, tenantId, amount]);
  },

  // Add balance
  async addBalance(tenantId, amount, reason = 'Credit top-up') {
    return this.query(`
      UPDATE credit_balances 
      SET balance = balance + ?, last_top_up = datetime('now'), updated_at = datetime('now')
      WHERE tenant_id = ?
    `, [amount, tenantId]);
  },

  // Get usage report
  async getUsageReport(tenantId, days = 30) {
    return this.query(`
      SELECT 
        s.name,
        s.category,
        COUNT(*) as request_count,
        SUM(sl.cost) as total_cost,
        MAX(sl.created_at) as last_used
      FROM service_logs sl
      JOIN services s ON sl.service_id = s.id
      JOIN api_keys ak ON sl.api_key_id = ak.id
      WHERE ak.tenant_id = ? 
        AND date(sl.created_at) >= date('now', '-' || ? || ' days')
      GROUP BY s.id
      ORDER BY total_cost DESC
    `, [tenantId, days]);
  },

  // Create API key
  async createApiKey(name, tenantId, rateLimit = 100) {
    const apiKey = 'ts_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    await this.query(`
      INSERT INTO api_keys (api_key, name, tenant_id, rate_limit)
      VALUES (?, ?, ?, ?)
    `, [apiKey, name, tenantId, rateLimit]);
    
    // Create initial balance if not exists
    await this.query(`
      INSERT OR IGNORE INTO credit_balances (tenant_id, balance)
      VALUES (?, 0)
    `, [tenantId]);
    
    return { apiKey, name, tenantId };
  },

  // Get balance
  async getBalance(tenantId) {
    const result = await this.query('SELECT * FROM credit_balances WHERE tenant_id = ? LIMIT 1', [tenantId]);
    return result[0] || null;
  },

  // Get categories
  async getCategories() {
    return this.query('SELECT DISTINCT category FROM services WHERE is_active = 1 ORDER BY category');
  },

  // Quick test connection
  async testConnection() {
    try {
      const result = await this.query('SELECT COUNT(*) as count FROM services');
      return { success: true, count: result[0]?.count || 0 };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default database;
