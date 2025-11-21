// Quick test to check if messages endpoint exists
const testEndpoint = async () => {
  try {
    console.log('Testing messages endpoint...\n');
    
    // Test without auth (should get 401, not 404)
    const response = await fetch('http://localhost:5000/messages/conversations');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 404) {
      console.log('\n❌ PROBLEM: Getting 404 - Route not registered or table missing');
      console.log('\nSOLUTION:');
      console.log('1. Check if messages table exists in Supabase');
      console.log('2. Run: backend/database/create_messages_table.sql');
      console.log('3. Restart backend server');
    } else if (response.status === 401) {
      console.log('\n✅ GOOD: Route exists! (401 = needs authentication)');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testEndpoint();
