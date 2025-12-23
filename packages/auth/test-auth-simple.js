import { database } from '@tetrasaas/database';
import { TetraAuth } from './src/index.js';

async function simpleAuthTest() {
  console.log('🧪 Simple Auth Test with Fixed SQLite Syntax\n');
  
  const auth = new TetraAuth();
  
  try {
    // 1. Create test API key
    console.log('1. Creating test API key...');
    const testKey = await auth.createApiKey(
      'SQLite Fix Test',
      'test_fix_' + Date.now(),
      { rateLimit: 100, initialCredits: 1000 }
    );
    console.log(`   ✅ Created: ${testKey.apiKey.substring(0, 25)}...`);
    
    // 2. Test authentication
    console.log('\n2. Testing authentication...');
    const authResult = await auth.authenticate(testKey.apiKey, 'sentiment-analysis');
    console.log(`   ✅ Authentication successful`);
    console.log(`   👤 Tenant: ${authResult.tenantId}`);
    console.log(`   💰 Credits: ${authResult.remainingCredits}`);
    
    // 3. Test request processing
    console.log('\n3. Testing request processing...');
    const requestResult = await auth.processRequest(
      testKey.apiKey,
      'sentiment-analysis',
      {
        input: { text: 'This is a test after SQLite fix' },
        metadata: { test: 'sqlite-fix' }
      }
    );
    console.log(`   ✅ Request processed`);
    console.log(`   📝 Request ID: ${requestResult.requestId}`);
    console.log(`   💸 Deducted: ${requestResult.deductedCredits} credits`);
    
    // 4. Complete request
    console.log('\n4. Completing request...');
    const completion = await auth.completeRequest(requestResult, {
      result: { sentiment: 'positive', score: 0.95 },
      metadata: { processingTime: 120 }
    });
    console.log(`   ✅ Request completed`);
    
    // 5. Check balance
    console.log('\n5. Checking balance...');
    const balance = await database.getBalance(authResult.tenantId);
    console.log(`   💰 New balance: ${balance?.balance || 0} credits`);
    
    console.log('\n🎉 All tests passed! SQLite syntax fixed successfully.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Stack:', error.stack);
  }
}

simpleAuthTest();
