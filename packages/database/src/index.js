import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../data/tetrasaas.db');
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

function sqliteDatetime(value = 'now') {
  return `datetime('${value}')`;
}

const database = {
  async query(sql, params = []) {
    try {
      const tempFile = path.join(__dirname, `temp_${Date.now()}.sql`);
      let finalSQL = sql
        .replace(/datetime\("now"\)/g, "datetime('now')")
        .replace(/datetime\('now'\)/g, "datetime('now')");

      for (const param of params) {
        if (finalSQL.includes('?')) {
          const escaped = this.escapeValue(param);
          finalSQL = finalSQL.replace('?', escaped);
        }
      }
      
      const commands = [
        'cd "$(dirname "$0")"',
        `sqlite3 "${dbPath}" "${finalSQL.replace(/"/g, '\\"')}"`
      ].join(' && ');
      
      fs.writeFileSync(tempFile, commands, { mode: 0o755 });
      const { stdout, stderr } = await execAsync(`bash "${tempFile}"`);
      fs.unlinkSync(tempFile);
      
      if (stderr && !stderr.includes('INSERT') && !stderr.includes('CREATE')) {
        console.error('SQLite Error:', stderr);
        throw new Error(stderr);
      }
      
      return this.parseResults(stdout);
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  },

  escapeValue(value) {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? '1' : '0';
    return `'${sanitizeSQL(String(value))}'`;
  },

  parseResults(output) {
    if (!output || output.trim() === '') return [];
    
    const lines = output.trim().split('\n');
    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return line;
      }
    });
  },

  async close() {
    return Promise.resolve();
  }
};

function createClient() {
  return {
    query: database.query.bind(database),
    close: database.close.bind(database)
  };
}

export { createClient };
