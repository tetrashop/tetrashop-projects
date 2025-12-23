// First, let's debug the database import
import * as dbModule from '@tetrasaas/database';
console.log('Database module keys:', Object.keys(dbModule));
console.log('Database module:', dbModule);

// Try to access the database object
const database = dbModule.database || dbModule.default || dbModule;

console.log('Available functions:', Object.keys(database));
console.log('Has query?', typeof database.query);
console.log('Has getAllServices?', typeof database.getAllServices);

// Now run a simple test
async function simpleTest() {
  try {
    console.log('\n🧪 Simple database test...');
    
    if (typeof database.getAllServices === 'function') {
      const services = await database.getAllServices();
      console.log(`✅ Got ${services.length} services`);
    } else if (typeof database.query === 'function') {
      const result = await database.query('SELECT COUNT(*) as count FROM services');
      console.log(`✅ Query result:`, result);
    } else {
      console.log('❌ No database functions found');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simpleTest();
