"use strict";
// فایل: src/db/Database.ts
// شبیه‌ساز پایگاه داده برای محیط توسعه
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
class Database {
    static async insert(collection, record) {
        if (!this.data[collection]) {
            this.data[collection] = [];
        }
        this.data[collection].push(record);
    }
    static async update(collection, id, updates) {
        if (!this.data[collection])
            return;
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[collection][index] = { ...this.data[collection][index], ...updates };
        }
    }
    static async query(collection, query) {
        if (!this.data[collection])
            return [];
        return this.data[collection].filter(item => {
            for (const key in query) {
                if (key === '$gte') {
                    if (item.timestamp < query[key])
                        return false;
                }
                else if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    }
    static async clear(collection) {
        this.data[collection] = [];
    }
}
exports.Database = Database;
Database.data = {};
//# sourceMappingURL=Database.js.map