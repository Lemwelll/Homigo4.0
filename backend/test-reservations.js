/**
 * Test script for Reservations API
 * Run with: node backend/test-reservations.js
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

// Test data
const testStudent = {
  email: 'teststudent2@test.com',
  password: 'Test@123',
  full_name: 'Test Student 2',
  role: 'student',
  university: 'Test University',
  student_id_number: 'TEST456'
};

const testLandlord = {
  email: 'testlandlord2@test.com',
  password: 'Test@123',
  full_name: 'Test Landlord 2',
  role: 'landlord',
  business_name: 'Test Properties',
  business_permit: 'BP123456'
};

let studentToken = '';
let landlordToken = '';
let testPropertyId = '';
let testReservationId = '';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error.message);
    return { status: 500, data: { success: false, message: error.message } };
  }
};

// Test functions
const testRegisterStudent = async () => {
  console.log('\n1. Testing student registration...');
  
  const result = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testStudent)
  });
  
  if (result.data.success) {
    console.log('✅ Student registered successfully');
    return true;
  } else {
    console.log('❌ Student registration failed:', result.data.message);
    return false;
  }
};

const testLoginStudent = async () => {
  console.log('\n2. Testing student login...');
  
  const result = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testStudent.email,
      password: testStudent.password,
      role: testStudent.role
    })
  });
  
  if (result.data.success) {
    studentToken = result.data.token;
    console.log('✅ Student login successful');
    return true;
  } else {
    console.log('❌ Student login failed:', result.data.message);
    return false;
  }
};

const testRegisterLandlord = async () => {
  console.log('\n3. Testing landlord registration...');
  
  const result = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testLandlord)
  });
  
  if (result.data.success) {
    console.log('✅ Landlord registered successfully');
    return true;
  } else {
    console.log('❌ Landlord registration failed:', result.data.message);
    return false;
  }
};

const testLoginLandlord = async () => {
  console.log('\n4. Testing landlord login...');
  
  const result = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testLandlord.email,
      password: testLandlord.password,
      role: testLandlord.role
    })
  });
  
  if (result.data.success) {
    landlordToken = result.data.token;
    console.log('✅ Landlord login successful');
    return true;
  } else {
    console.log('❌ Landlord login failed:', result.data.message);
    return false;
  }
};

const testGetVerifiedProperties = async () => {
  console.log('\n5. Testing get verified properties...');
  
  const result = await apiCall('/properties/verified');
  
  if (result.data.success && result.data.data.length > 0) {
    testPropertyId = result.data.data[0].id;
    console.log('✅ Properties fetched successfully');
    console.log(`   Using property ID: ${testPropertyId}`);
    return true;
  } else {
    console.log('❌ No verified properties found');
    console.log('   Please create and verify at least one property first');
    return false;
  }
};

const testCreateReservation = async () => {
  console.log('\n6. Testing create reservation...');
  
  const result = await apiCall('/reservations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({
      property_id: testPropertyId,
      message: 'Test reservation message'
    })
  });
  
  if (result.data.success) {
    testReservationId = result.data.data.id;
    console.log('✅ Reservation created successfully');
    console.log(`   Reservation ID: ${testReservationId}`);
    console.log(`   Expiry: ${result.data.data.expiry_date}`);
    return true;
  } else {
    console.log('❌ Failed to create reservation:', result.data.message);
    return false;
  }
};

const testGetStudentReservations = async () => {
  console.log('\n7. Testing get student reservations...');
  
  const result = await apiCall('/reservations', {
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  if (result.data.success && result.data.data.length > 0) {
    console.log('✅ Student reservations fetched successfully');
    console.log(`   Found ${result.data.data.length} reservation(s)`);
    return true;
  } else {
    console.log('❌ Failed to fetch student reservations');
    return false;
  }
};

const testGetLandlordReservations = async () => {
  console.log('\n8. Testing get landlord reservations...');
  
  const result = await apiCall('/reservations', {
    headers: {
      'Authorization': `Bearer ${landlordToken}`
    }
  });
  
  if (result.data.success) {
    console.log('✅ Landlord reservations fetched successfully');
    console.log(`   Found ${result.data.data.length} reservation(s)`);
    return true;
  } else {
    console.log('❌ Failed to fetch landlord reservations');
    return false;
  }
};

const testGetReservationById = async () => {
  console.log('\n9. Testing get reservation by ID...');
  
  const result = await apiCall(`/reservations/${testReservationId}`, {
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  if (result.data.success) {
    console.log('✅ Reservation fetched by ID successfully');
    console.log(`   Status: ${result.data.data.status}`);
    return true;
  } else {
    console.log('❌ Failed to fetch reservation by ID');
    return false;
  }
};

const testApproveReservation = async () => {
  console.log('\n10. Testing approve reservation...');
  
  const result = await apiCall(`/reservations/${testReservationId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${landlordToken}`
    },
    body: JSON.stringify({
      status: 'approved'
    })
  });
  
  if (result.data.success) {
    console.log('✅ Reservation approved successfully');
    return true;
  } else {
    console.log('❌ Failed to approve reservation:', result.data.message);
    return false;
  }
};

const testCancelReservation = async () => {
  console.log('\n11. Testing cancel reservation...');
  
  const result = await apiCall(`/reservations/${testReservationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });
  
  if (result.data.success) {
    console.log('✅ Reservation cancelled successfully');
    return true;
  } else {
    console.log('❌ Failed to cancel reservation:', result.data.message);
    return false;
  }
};

const testCheckActiveReservation = async () => {
  console.log('\n12. Testing check active reservation...');
  
  const result = await apiCall(`/reservations/check/${testPropertyId}`);
  
  if (result.data.success) {
    console.log('✅ Active reservation check successful');
    console.log(`   Has active: ${result.data.data.has_active_reservation}`);
    return true;
  } else {
    console.log('❌ Failed to check active reservation');
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🧪 Starting Reservations API Tests');
  console.log('===================================');
  
  const tests = [
    testRegisterStudent,
    testLoginStudent,
    testRegisterLandlord,
    testLoginLandlord,
    testGetVerifiedProperties,
    testCreateReservation,
    testGetStudentReservations,
    testGetLandlordReservations,
    testGetReservationById,
    testApproveReservation,
    testCancelReservation,
    testCheckActiveReservation
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n===================================');
  console.log('🏁 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Reservations API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Main execution
const main = async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Backend server is not running on http://localhost:5000');
    console.log('   Please start the server with: cd backend && npm start');
    process.exit(1);
  }
  
  await runTests();
};

main();
