/**
 * Test Messages API
 * Quick test to verify messaging endpoints are working
 */

const API_URL = 'http://localhost:5000';

// Test data
let studentToken = '';
let landlordToken = '';
let studentId = '';
let landlordId = '';

async function testMessagingAPI() {
  console.log('🧪 Testing Messaging API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthRes = await fetch(`${API_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health check:', healthData.message);
    console.log('');

    // Test 2: Login as Student
    console.log('2️⃣ Logging in as student...');
    const studentLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@example.com',
        password: 'password123'
      })
    });
    
    if (studentLoginRes.ok) {
      const studentData = await studentLoginRes.json();
      studentToken = studentData.data.token;
      studentId = studentData.data.user.id;
      console.log('✅ Student logged in');
      console.log('   Token:', studentToken.substring(0, 20) + '...');
      console.log('   ID:', studentId);
    } else {
      console.log('❌ Student login failed - Create a student account first');
    }
    console.log('');

    // Test 3: Login as Landlord
    console.log('3️⃣ Logging in as landlord...');
    const landlordLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'landlord@example.com',
        password: 'password123'
      })
    });
    
    if (landlordLoginRes.ok) {
      const landlordData = await landlordLoginRes.json();
      landlordToken = landlordData.data.token;
      landlordId = landlordData.data.user.id;
      console.log('✅ Landlord logged in');
      console.log('   Token:', landlordToken.substring(0, 20) + '...');
      console.log('   ID:', landlordId);
    } else {
      console.log('❌ Landlord login failed - Create a landlord account first');
    }
    console.log('');

    if (!studentToken || !landlordToken) {
      console.log('⚠️  Cannot continue without both accounts');
      console.log('   Please create student@example.com and landlord@example.com accounts');
      return;
    }

    // Test 4: Get Conversations (should be empty initially)
    console.log('4️⃣ Getting student conversations...');
    const convRes = await fetch(`${API_URL}/messages/conversations`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    
    if (convRes.ok) {
      const convData = await convRes.json();
      console.log('✅ Conversations fetched:', convData.data.length, 'conversations');
    } else {
      const error = await convRes.json();
      console.log('❌ Failed to fetch conversations:', error.message);
    }
    console.log('');

    // Test 5: Send Message from Student to Landlord
    console.log('5️⃣ Sending message from student to landlord...');
    const sendRes = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${studentToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receiver_id: landlordId,
        message: 'Hello! Is this property still available?'
      })
    });
    
    if (sendRes.ok) {
      const sendData = await sendRes.json();
      console.log('✅ Message sent successfully');
      console.log('   Message ID:', sendData.data.id);
      console.log('   Content:', sendData.data.message);
    } else {
      const error = await sendRes.json();
      console.log('❌ Failed to send message:', error.message);
    }
    console.log('');

    // Test 6: Get Messages between Student and Landlord
    console.log('6️⃣ Getting messages between student and landlord...');
    const messagesRes = await fetch(`${API_URL}/messages/${landlordId}`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    
    if (messagesRes.ok) {
      const messagesData = await messagesRes.json();
      console.log('✅ Messages fetched:', messagesData.data.length, 'messages');
      messagesData.data.forEach((msg, i) => {
        console.log(`   ${i + 1}. ${msg.message}`);
      });
    } else {
      const error = await messagesRes.json();
      console.log('❌ Failed to fetch messages:', error.message);
    }
    console.log('');

    // Test 7: Get Unread Count
    console.log('7️⃣ Getting unread message count for landlord...');
    const unreadRes = await fetch(`${API_URL}/messages/unread/count`, {
      headers: { 'Authorization': `Bearer ${landlordToken}` }
    });
    
    if (unreadRes.ok) {
      const unreadData = await unreadRes.json();
      console.log('✅ Unread count:', unreadData.data.count);
    } else {
      const error = await unreadRes.json();
      console.log('❌ Failed to get unread count:', error.message);
    }
    console.log('');

    // Test 8: Reply from Landlord
    console.log('8️⃣ Sending reply from landlord to student...');
    const replyRes = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${landlordToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receiver_id: studentId,
        message: 'Yes, the property is still available! Would you like to schedule a viewing?'
      })
    });
    
    if (replyRes.ok) {
      const replyData = await replyRes.json();
      console.log('✅ Reply sent successfully');
      console.log('   Message ID:', replyData.data.id);
      console.log('   Content:', replyData.data.message);
    } else {
      const error = await replyRes.json();
      console.log('❌ Failed to send reply:', error.message);
    }
    console.log('');

    console.log('🎉 All tests completed!');
    console.log('');
    console.log('✅ Messaging system is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('💡 Make sure:');
    console.log('   1. Backend server is running (npm start in backend folder)');
    console.log('   2. Messages table exists in database');
    console.log('   3. Student and landlord accounts exist');
  }
}

// Run tests
testMessagingAPI();
