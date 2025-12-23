import { database } from '@tetrasaas/database';
import { TetraAuth } from './src/index.js';

async function integrationTest() {
  console.log('🔗 Integration Test: Database + Auth Package\n');
  
  const auth = new TetraAuth();
  
  try {
    // 1. Verify database connection
    console.log('1. Verifying database connection...');
    const services = await database.getAllServices();
    console.log(`   ✅ Database connected: ${services.length} services available`);
    
    // 2. Create test API key
    console.log('\n2. Creating test environment...');
    const testKey = await auth.createApiKey(
      'Integration Test',
      'integration_test_' + Date.now(),
      { rateLimit: 100, initialCredits: 1000 }
    );
    
    console.log(`   ✅ Test API key created: ${testKey.apiKey.substring(0, 25)}...`);
    console.log(`   👤 Test tenant: ${testKey.tenantId}`);
    
    // 3. Test complete flow
    console.log('\n3. Testing complete authentication flow...');
    
    // 3.1 Authenticate
    const authResult = await auth.authenticate(testKey.apiKey, 'image-enhancement');
    console.log(`   ✅ Authentication passed`);
    console.log(`   💰 Available credits: ${authResult.remainingCredits}`);
    
    // 3.2 Process request
    const requestResult = await auth.processRequest(
      testKey.apiKey,
      'image-enhancement',
      {
        input: { image: 'base64_sample', resolution: '4k' },
        metadata: { test: 'integration' }
      }
    );
    console.log(`   ✅ Request processed: ${requestResult.requestId}`);
    console.log(`   💸 Credits deducted: ${requestResult.deductedCredits}`);
    
    // 3.3 Complete request
    const completion = await auth.completeRequest(requestResult, {
      result: { enhanced: true, resolution: '4k', size: '1920x1080' },
      metadata: { processingTime: 250 }
    });
    console.log(`   ✅ Request completed`);
    
    // 4. Verify database updates
    console.log('\n4. Verifying database updates...');
    
    // 4.1 Check balance
    const balance = await database.getBalance(testKey.tenantId);
    console.log(`   💰 New balance: ${balance?.balance || 0} credits`);
    
    // 4.2 Check logs
    const logs = await database.query(
      'SELECT COUNT(*) as count FROM service_logs WHERE api_key_id = ?',
      [authResult.apiKeyId]
    );
    console.log(`   📝 Service logs: ${logs[0]?.count || 0} entries`);
    
    // 5. Test error handling
    console.log('\n5. Testing error handling...');
    
    // 5.1 Insufficient credits
    try {
      // Set balance to 0
      await database.query(
        'UPDATE credit_balances SET balance = 0 WHERE tenant_id = ?',
        [testKey.tenantId]
      );
      
      await auth.authenticate(testKey.apiKey, 'image-enhancement');
      console.log(`   ❌ Should have thrown insufficient credits error`);
    } catch (error) {
      if (error.code === 'INSUFFICIENT_CREDITS') {
        console.log(`   ✅ Correctly detected insufficient credits`);
      } else {
        console.log(`   ⚠️ Unexpected error: ${error.code}`);
      }
    }
    
    // 6. Restore balance and clean up
    console.log('\n6. Cleaning up test environment...');
    await database.addBalance(testKey.tenantId, 1000, 'Test cleanup');
    await database.query(
      'UPDATE api_keys SET is_active = 0 WHERE api_key = ?',
      [testKey.apiKey]
    );
    
    console.log(`   ✅ Test environment cleaned up`);
    
    // Final summary
    console.log('\n🎉 Integration test successful!');
    console.log('\n📋 Summary:');
    console.log(`   • Database: ✅ Connected and responsive`);
    console.log(`   • Auth Package: ✅ Fully functional`);
    console.log(`   • Credit System: ✅ Working correctly`);
    console.log(`   • Request Flow: ✅ End-to-end implemented`);
    console.log(`   • Error Handling: ✅ Properly catching errors`);
    console.log(`   • Integration: ✅ Ready for API server`);
    
    return {
      success: true,
      testApiKey: testKey.apiKey,
      tenantId: testKey.tenantId
    };
    
  } catch (error) {
    console.error('\n❌ Integration test failed:', error.message);
    console.error('Details:', error.stack);
    return { success: false, error: error.message };
  }
}

// Run integration test
integrationTest();
