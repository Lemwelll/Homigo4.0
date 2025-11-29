/**
 * Test Payment System
 * Quick test to verify payment history endpoints work
 */

const API_URL = 'http://localhost:5000';

// Test user credentials (update with your test user)
const TEST_USER = {
  email: 'student@test.com',
  password: 'password123'
};

let authToken = '';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  return { status: response.status, data };
}

// Test functions
async function testLogin() {
  console.log('\n🔐 Testing Login...');
  const result = await apiCall('/auth/login', 'POST', TEST_USER);
  
  if (result.data.success && result.data.token) {
    authToken = result.data.token;
    console.log('✅ Login successful');
    console.log(`   User: ${result.data.user.name} (${result.data.user.role})`);
    return true;
  } else {
    console.log('❌ Login failed:', result.data.message);
    return false;
  }
}

async function testGetPaymentHistory() {
  console.log('\n📜 Testing Get Payment History...');
  const result = await apiCall('/payments/history');
  
  if (result.data.success) {
    console.log(`✅ Payment history retrieved`);
    console.log(`   Total transactions: ${result.data.data.length}`);
    if (result.data.data.length > 0) {
      const latest = result.data.data[0];
      console.log(`   Latest: ${latest.payment_type} - ₱${latest.amount} (${latest.status})`);
    }
    return true;
  } else {
    console.log('❌ Failed to get payment history:', result.data.message);
    return false;
  }
}

async function testGetPaymentStats() {
  console.log('\n📊 Testing Get Payment Stats...');
  const result = await apiCall('/payments/stats');
  
  if (result.data.success) {
    console.log('✅ Payment stats retrieved');
    console.log(`   Total spent: ₱${result.data.data.totalSpent}`);
    console.log(`   Total transactions: ${result.data.data.totalTransactions}`);
    console.log(`   By type:`, result.data.data.transactionsByType);
    return true;
  } else {
    console.log('❌ Failed to get payment stats:', result.data.message);
    return false;
  }
}

async function testGetSubscriptionStatus() {
  console.log('\n💎 Testing Get Subscription Status...');
  const result = await apiCall('/subscriptions/status');
  
  if (result.data.success) {
    console.log('✅ Subscription status retrieved');
    console.log(`   Tier: ${result.data.data.tier}`);
    console.log(`   Status: ${result.data.data.status || 'N/A'}`);
    return true;
  } else {
    console.log('❌ Failed to get subscription status:', result.data.message);
    return false;
  }
}

async function testUpgradeSubscription() {
  console.log('\n⬆️  Testing Upgrade Subscription...');
  
  const paymentData = {
    paymentMethod: 'card',
    amount: 149,
    transactionId: `TEST-${Date.now()}`,
    cardDetails: {
      cardNumber: '4111111111111111',
      cardName: 'Test User',
      expiryDate: '12/25',
      cvv: '123'
    }
  };
  
  const result = await apiCall('/subscriptions/upgrade', 'POST', paymentData);
  
  if (result.data.success) {
    console.log('✅ Subscription upgraded successfully');
    console.log(`   New tier: ${result.data.data.tier}`);
    console.log(`   Expires: ${result.data.data.endDate}`);
    return true;
  } else {
    console.log('❌ Failed to upgrade subscription:', result.data.message);
    return false;
  }
}

async function testGetPaymentMethods() {
  console.log('\n💳 Testing Get Payment Methods...');
  const result = await apiCall('/payments/methods');
  
  if (result.data.success) {
    console.log('✅ Payment methods retrieved');
    console.log(`   Saved methods: ${result.data.data.length}`);
    return true;
  } else {
    console.log('❌ Failed to get payment methods:', result.data.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 PAYMENT SYSTEM TEST SUITE');
  console.log('================================');
  
  const results = {
    passed: 0,
    failed: 0
  };

  // Test 1: Login
  if (await testLogin()) {
    results.passed++;
  } else {
    results.failed++;
    console.log('\n❌ Cannot continue without authentication');
    return;
  }

  // Test 2: Get Subscription Status
  if (await testGetSubscriptionStatus()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 3: Get Payment History
  if (await testGetPaymentHistory()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 4: Get Payment Stats
  if (await testGetPaymentStats()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 5: Get Payment Methods
  if (await testGetPaymentMethods()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 6: Upgrade Subscription (optional - creates real data)
  // Uncomment to test upgrade flow
  // if (await testUpgradeSubscription()) {
  //   results.passed++;
  // } else {
  //   results.failed++;
  // }

  // Summary
  console.log('\n================================');
  console.log('📊 TEST RESULTS');
  console.log('================================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Payment system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('\n💥 Test suite error:', error);
  process.exit(1);
});
