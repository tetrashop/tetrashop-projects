import { database } from './src/index.js';

async function testSQLiteSyntax() {
  console.log('🧪 Testing SQLite syntax fixes...\n');
  
  try {
    // Test 1: Basic query
    console.log('1. Testing basic SELECT...');
    const services = await database.getAllServices();
    console.log(`   ✅ Got ${services.length} services`);
    
    // Test 2: Update with datetime
    console.log('\n2. Testing datetime update...');
    const keys = await database.query('SELECT id FROM api_keys LIMIT 1');
    if (keys.length > 0) {
      await database.updateLastUsed(keys[0].id);
      console.log(`   ✅ Updated last_used successfully`);
    }
    
    // Test 3: Create new record
    console.log('\n3. Testing INSERT with parameters...');
    const newKey = await database.createApiKey('Syntax Test', 'syntax_test_' + Date.now(), 50);
    console.log(`   ✅ Created API key: ${newKey.apiKey.substring(0, 20)}...`);
    
    // Test 4: Test all datetime functions
    console.log('\n4. Testing all datetime functions...');
    
    // Add balance (uses datetime)
    await database.addBalance(newKey.tenantId, 500, 'Test');
    console.log(`   ✅ addBalance: OK`);
    
    // Deduct balance (uses datetime)
    await database.deductBalance(newKey.tenantId, 100);
    console.log(`   ✅ deductBalance: OK`);
    
    // Log request (uses datetime)
    const service = await database.getServiceBySlug('sentiment-analysis');
    if (service) {
      await database.logRequest(keys[0]?.id || 1, service.id, {
        input: { text: 'test' },
        output: { result: 'success' }
      });
      console.log(`   ✅ logRequest: OK`);
    }
    
    console.log('\n🎉 All SQLite syntax tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('SQL Error details:', error);
  }
}

testSQLiteSyntax();
