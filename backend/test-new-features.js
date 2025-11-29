/**
 * Test script for new features:
 * 1. Notification Preferences
 * 2. Property Reviews
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

// Test credentials
const STUDENT_EMAIL = 'student@test.com';
const STUDENT_PASSWORD = 'password123';
const LANDLORD_EMAIL = 'landlord@test.com';
const LANDLORD_PASSWORD = 'password123';

let studentToken = '';
let landlordToken = '';
let testPropertyId = '';

async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
}

async function testNotificationPreferences(token, userType) {
  console.log(`\n🧪 Testing Notification Preferences (${userType})...`);
  
  try {
    // Get preferences
    console.log('  📥 Fetching preferences...');
    const getResponse = await fetch(`${API_URL}/preferences`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getData = await getResponse.json();
    
    if (getData.success) {
      console.log('  ✅ Preferences fetched successfully');
      console.log('  📊 Current preferences:', {
        emailMessages: getData.data.email_messages,
        smsMessages: getData.data.sms_messages,
        weeklyReports: getData.data.weekly_reports
      });
    } else {
      console.log('  ❌ Failed to fetch preferences:', getData.message);
      return false;
    }

    // Update preferences
    console.log('  📤 Updating preferences...');
    const updateResponse = await fetch(`${API_URL}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        emailMessages: true,
        smsMessages: false,
        weeklyReports: true,
        priceDropAlerts: true
      })
    });
    const updateData = await updateResponse.json();
    
    if (updateData.success) {
      console.log('  ✅ Preferences updated successfully');
      return true;
    } else {
      console.log('  ❌ Failed to update preferences:', updateData.message);
      return false;
    }
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    return false;
  }
}

async function testPropertyReviews(studentToken, landlordToken) {
  console.log('\n🧪 Testing Property Reviews...');
  
  try {
    // Get a property ID (assuming properties exist)
    console.log('  📥 Fetching properties...');
    const propsResponse = await fetch(`${API_URL}/properties`);
    const propsData = await propsResponse.json();
    
    if (!propsData.success || propsData.data.length === 0) {
      console.log('  ⚠️  No properties found. Skipping review tests.');
      return false;
    }
    
    testPropertyId = propsData.data[0].id;
    console.log(`  ✅ Using property ID: ${testPropertyId}`);

    // Create a review
    console.log('  📝 Creating review...');
    const createResponse = await fetch(`${API_URL}/reviews/property/${testPropertyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        rating: 5,
        title: 'Amazing property!',
        comment: 'This is a test review. The property was excellent!',
        cleanlinessRating: 5,
        locationRating: 4,
        valueRating: 5
      })
    });
    const createData = await createResponse.json();
    
    if (createData.success) {
      console.log('  ✅ Review created successfully');
      const reviewId = createData.data.id;

      // Get reviews for property
      console.log('  📥 Fetching property reviews...');
      const getResponse = await fetch(`${API_URL}/reviews/property/${testPropertyId}`);
      const getData = await getResponse.json();
      
      if (getData.success) {
        console.log(`  ✅ Found ${getData.data.reviews.length} review(s)`);
        console.log('  📊 Rating stats:', {
          average: getData.data.stats.average_rating,
          total: getData.data.stats.total_reviews
        });
      }

      // Add landlord response (if landlord owns this property)
      console.log('  💬 Adding landlord response...');
      const responseResponse = await fetch(`${API_URL}/reviews/${reviewId}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${landlordToken}`
        },
        body: JSON.stringify({
          response: 'Thank you for your wonderful review! We appreciate your feedback.'
        })
      });
      const responseData = await responseResponse.json();
      
      if (responseData.success) {
        console.log('  ✅ Landlord response added successfully');
      } else {
        console.log('  ⚠️  Landlord response failed (may not own property):', responseData.message);
      }

      return true;
    } else {
      console.log('  ❌ Failed to create review:', createData.message);
      return false;
    }
  } catch (error) {
    console.log('  ❌ Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   TESTING NEW FEATURES                ║');
  console.log('╚════════════════════════════════════════╝');

  // Login
  console.log('\n🔐 Logging in...');
  studentToken = await login(STUDENT_EMAIL, STUDENT_PASSWORD);
  landlordToken = await login(LANDLORD_EMAIL, LANDLORD_PASSWORD);

  if (!studentToken || !landlordToken) {
    console.log('\n❌ Login failed. Please check credentials.');
    console.log('   Make sure you have test accounts:');
    console.log(`   Student: ${STUDENT_EMAIL} / ${STUDENT_PASSWORD}`);
    console.log(`   Landlord: ${LANDLORD_EMAIL} / ${LANDLORD_PASSWORD}`);
    return;
  }

  console.log('✅ Login successful');

  // Test notification preferences
  const studentPrefsResult = await testNotificationPreferences(studentToken, 'Student');
  const landlordPrefsResult = await testNotificationPreferences(landlordToken, 'Landlord');

  // Test property reviews
  const reviewsResult = await testPropertyReviews(studentToken, landlordToken);

  // Summary
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   TEST RESULTS SUMMARY                ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n✅ Student Notification Preferences: ${studentPrefsResult ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Landlord Notification Preferences: ${landlordPrefsResult ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Property Reviews System: ${reviewsResult ? 'PASS' : 'FAIL'}`);

  const allPassed = studentPrefsResult && landlordPrefsResult && reviewsResult;
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED! Features are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run tests
runTests().catch(console.error);
