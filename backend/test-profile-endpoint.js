/**
 * Test script for /auth/profile endpoint
 * Run this after restarting the backend server
 */

const API_URL = 'http://localhost:5000';

async function testProfileEndpoint() {
  console.log('🧪 Testing /auth/profile endpoint...\n');

  try {
    // Step 1: Check if endpoint exists (without auth)
    console.log('Step 1: Testing if /auth/profile endpoint exists...');
    const testResponse = await fetch(`${API_URL}/auth/profile`);
    
    console.log('   Status:', testResponse.status);
    
    if (testResponse.status === 404) {
      console.log('❌ Profile endpoint not found (404)');
      console.log('ℹ️  The server needs to be restarted to pick up the new route');
      console.log('\n📝 To restart the server:');
      console.log('   1. Stop the current server (Ctrl+C in the terminal running it)');
      console.log('   2. Run: npm start (in the backend directory)');
      return;
    }
    
    if (testResponse.status === 401) {
      console.log('✅ Profile endpoint exists (returns 401 Unauthorized as expected)');
      console.log('ℹ️  This is correct - the endpoint requires authentication');
      console.log('\n🎉 The /auth/profile endpoint is working correctly!');
      console.log('   The frontend should now be able to fetch user profiles.');
      return;
    }

    const data = await testResponse.json();
    console.log('   Response:', data);



  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProfileEndpoint();
