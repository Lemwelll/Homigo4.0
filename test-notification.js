// Quick test to check if notification was created
const testNotification = async () => {
  try {
    console.log('Checking recent notifications...\n');
    
    const response = await fetch('http://localhost:5000/notifications', {
      headers: {
        'Authorization': `Bearer ${process.argv[2] || ''}`
      }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log(`\n✅ Found ${data.data.length} notifications`);
      if (data.data.length > 0) {
        console.log('\nMost recent:');
        console.log('- Title:', data.data[0].title);
        console.log('- Message:', data.data[0].message);
        console.log('- Type:', data.data[0].type);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testNotification();
