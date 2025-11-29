/**
 * Test script for Escrow Accept/Decline endpoints
 * Run with: node backend/test-escrow-accept-decline.js
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

// Test credentials - update these with actual test accounts
const LANDLORD_EMAIL = 'landlord@test.com';
const LANDLORD_PASSWORD = 'password123';

async function loginLandlord() {
  console.log('\n🔐 Logging in as landlord...');
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: LANDLORD_EMAIL,
      password: LANDLORD_PASSWORD,
      userType: 'landlord'
    })
  });

  const data = await response.json();
  if (data.success) {
    console.log('✅ Login successful');
    return data.token;
  } else {
    throw new Error('Login failed: ' + data.message);
  }
}

async function getLandlordEscrow(token) {
  console.log('\n📋 Fetching landlord escrow transactions...');
  const response = await fetch(`${API_URL}/escrow/landlord`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (data.success) {
    console.log(`✅ Found ${data.escrowPayments.length} transactions`);
    return data.escrowPayments;
  } else {
    throw new Error('Failed to fetch escrow: ' + data.message);
  }
}

async function acceptPayment(token, escrowId) {
  console.log(`\n✅ Accepting payment ${escrowId}...`);
  const response = await fetch(`${API_URL}/escrow/${escrowId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (data.success) {
    console.log('✅ Payment accepted successfully!');
    console.log('   Status:', data.escrow.status);
    console.log('   Released Date:', data.escrow.released_date);
    return data.escrow;
  } else {
    throw new Error('Failed to accept payment: ' + data.message);
  }
}

async function declinePayment(token, escrowId, reason) {
  console.log(`\n❌ Declining payment ${escrowId}...`);
  const response = await fetch(`${API_URL}/escrow/${escrowId}/decline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reason })
  });

  const data = await response.json();
  if (data.success) {
    console.log('✅ Payment declined successfully!');
    console.log('   Status:', data.escrow.status);
    console.log('   Refunded Date:', data.escrow.refunded_date);
    console.log('   Reason:', data.escrow.refund_reason);
    return data.escrow;
  } else {
    throw new Error('Failed to decline payment: ' + data.message);
  }
}

async function runTests() {
  try {
    console.log('🧪 Testing Escrow Accept/Decline Endpoints');
    console.log('==========================================');

    // Login
    const token = await loginLandlord();

    // Get escrow transactions
    const transactions = await getLandlordEscrow(token);

    // Find a held transaction
    const heldTransaction = transactions.find(t => t.status === 'held');
    
    if (!heldTransaction) {
      console.log('\n⚠️  No held transactions found to test with');
      console.log('   Create a booking first to test Accept/Decline');
      return;
    }

    console.log('\n📦 Found held transaction:');
    console.log('   ID:', heldTransaction.id);
    console.log('   Amount:', heldTransaction.amount);
    console.log('   Property:', heldTransaction.property?.title);
    console.log('   Student:', heldTransaction.student?.full_name);

    // Ask which action to test
    console.log('\n⚠️  This script will modify the database!');
    console.log('   To test ACCEPT: Uncomment the acceptPayment line');
    console.log('   To test DECLINE: Uncomment the declinePayment line');
    
    // Uncomment ONE of these to test:
    // await acceptPayment(token, heldTransaction.id);
    // await declinePayment(token, heldTransaction.id, 'Testing decline functionality');

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
