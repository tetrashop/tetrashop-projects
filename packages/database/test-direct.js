import { database } from './src/index.js';

async function runTests() {
  console.log('Testing database module with direct SQLite execution...\n');
  
  try {
    // Test 1: Connection test
    console.log('1. Testing database connection...');
    const connectionTest = await database.testConnection();
    if (connectionTest.success) {
      console.log(`   ✅ Connected successfully! Found ${connectionTest.count} services`);
    } else {
      console.log(`   ❌ Connection failed: ${connectionTest.error}`);
      return;
    }

    // Test 2: Get all services
    console.log('\n2. Getting all services...');
    const services = await database.getAllServices();
    console.log(`   ✅ Retrieved ${services.length} services`);
    
    if (services.length > 0) {
      console.log(`   📍 Sample: ${services[0].name} (${services[0].category}) - ${services[0].price_per_call} credits`);
    }

    // Test 3: Get categories
    console.log('\n3. Getting categories...');
    const categories = await database.getCategories();
    console.log(`   ✅ Found ${categories.length} categories`);
    console.log(`   📂 Categories: ${categories.map(c => c.category).join(', ')}`);

    // Test 4: Get sample API key
    console.log('\n4. Testing API key validation...');
    const sampleKeyResult = await database.query('SELECT api_key FROM api_keys LIMIT 1');
    
    if (sampleKeyResult.length > 0) {
      const sampleKey = sampleKeyResult[0].api_key;
      console.log(`   🔑 Sample API key found: ${sampleKey.substring(0, 25)}...`);
      
      const validated = await database.validateApiKey(sampleKey);
      if (validated) {
        console.log(`   ✅ API key validated successfully`);
        console.log(`   👤 Tenant ID: ${validated.tenant_id}`);
        console.log(`   💰 Balance: ${validated.balance} credits`);
        
        // Test 5: Log a request
        console.log('\n5. Logging a sample request...');
        const service = await database.getServiceBySlug('sentiment-analysis');
        if (service) {
          const logResult = await database.logRequest(validated.id, service.id, {
            input: { text: 'This product is amazing!' },
            output: { sentiment: 'positive', confidence: 0.95 },
            status: 'SUCCESS'
          });
          console.log(`   ✅ Request logged successfully`);
        }
      }
    }

    // Test 6: Create new API key
    console.log('\n6. Creating new API key...');
    const newKey = await database.createApiKey('Test Development', 'test_dev_' + Date.now(), 200);
    console.log(`   ✅ New API key created: ${newKey.apiKey.substring(0, 25)}...`);
    console.log(`   👤 Tenant: ${newKey.tenantId}`);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Database: ${services.length} services`);
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Method: Direct SQLite execution`);
    console.log(`   • Status: ✅ Fully operational`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

runTests();
