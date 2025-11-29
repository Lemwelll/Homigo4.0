/**
 * Test Analytics Dashboard Endpoint
 * Run this to verify the analytics API is working
 */

import fetch from 'node-fetch';

const API_URL = 'https://homigo-backend.onrender.com';
// const API_URL = 'http://localhost:5000';

async function testAnalytics() {
  console.log('🧪 Testing Admin Analytics Dashboard...\n');

  // You'll need to replace this with a valid admin token
  const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

  // Set date range (last 30 days)
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  console.log(`📅 Date Range: ${startDate} to ${endDate}\n`);

  try {
    // Test 1: Dashboard Report
    console.log('1️⃣ Testing Dashboard Report...');
    const dashboardResponse = await fetch(
      `${API_URL}/reports/dashboard?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const dashboardData = await dashboardResponse.json();
    
    if (dashboardData.success) {
      console.log('✅ Dashboard Report: SUCCESS');
      console.log(`   💰 Total Revenue: ₱${dashboardData.data.revenue.totalRevenue.toLocaleString()}`);
      console.log(`   📊 Transactions: ${dashboardData.data.revenue.transactionCount}`);
      console.log(`   🏠 Total Bookings: ${dashboardData.data.bookings.total}`);
      console.log(`   ✅ Confirmed: ${dashboardData.data.bookings.confirmed}`);
      console.log(`   ⏳ Pending: ${dashboardData.data.bookings.pending}`);
      console.log(`   👥 New Students: ${dashboardData.data.users.newStudents}`);
      console.log(`   🏢 New Landlords: ${dashboardData.data.users.newLandlords}`);
      console.log(`   🎯 Top Properties: ${dashboardData.data.topProperties.length}`);
      console.log(`   💳 Free Tier: ${dashboardData.data.subscriptions.free}`);
      console.log(`   💎 Premium Tier: ${dashboardData.data.subscriptions.premium}`);
      console.log(`   ✔️ Verified Landlords: ${dashboardData.data.verifications.verified}`);
    } else {
      console.log('❌ Dashboard Report: FAILED');
      console.log(`   Error: ${dashboardData.message}`);
    }

    console.log('\n');

    // Test 2: Revenue Report
    console.log('2️⃣ Testing Revenue Report...');
    const revenueResponse = await fetch(
      `${API_URL}/reports/revenue?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const revenueData = await revenueResponse.json();
    
    if (revenueData.success) {
      console.log('✅ Revenue Report: SUCCESS');
      console.log(`   Total: ₱${revenueData.data.totalRevenue.toLocaleString()}`);
      console.log(`   Transactions: ${revenueData.data.transactionCount}`);
      console.log(`   Daily Entries: ${revenueData.data.dailyRevenue.length}`);
    } else {
      console.log('❌ Revenue Report: FAILED');
      console.log(`   Error: ${revenueData.message}`);
    }

    console.log('\n');

    // Test 3: Booking Stats
    console.log('3️⃣ Testing Booking Stats...');
    const bookingResponse = await fetch(
      `${API_URL}/reports/bookings?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const bookingData = await bookingResponse.json();
    
    if (bookingData.success) {
      console.log('✅ Booking Stats: SUCCESS');
      console.log(`   Total: ${bookingData.data.total}`);
      console.log(`   Confirmed: ${bookingData.data.confirmed}`);
      console.log(`   Pending: ${bookingData.data.pending}`);
      console.log(`   Completed: ${bookingData.data.completed}`);
      console.log(`   Cancelled: ${bookingData.data.cancelled}`);
    } else {
      console.log('❌ Booking Stats: FAILED');
      console.log(`   Error: ${bookingData.message}`);
    }

    console.log('\n');

    // Test 4: Property Performance
    console.log('4️⃣ Testing Property Performance...');
    const propertyResponse = await fetch(
      `${API_URL}/reports/properties?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const propertyData = await propertyResponse.json();
    
    if (propertyData.success) {
      console.log('✅ Property Performance: SUCCESS');
      console.log(`   Properties Tracked: ${propertyData.data.length}`);
      if (propertyData.data.length > 0) {
        console.log(`   Top Property: ${propertyData.data[0].title}`);
        console.log(`   Top Revenue: ₱${propertyData.data[0].revenue.toLocaleString()}`);
      }
    } else {
      console.log('❌ Property Performance: FAILED');
      console.log(`   Error: ${propertyData.message}`);
    }

    console.log('\n');

    // Test 5: User Activity
    console.log('5️⃣ Testing User Activity...');
    const userResponse = await fetch(
      `${API_URL}/reports/users?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const userData = await userResponse.json();
    
    if (userData.success) {
      console.log('✅ User Activity: SUCCESS');
      console.log(`   New Students: ${userData.data.newStudents}`);
      console.log(`   New Landlords: ${userData.data.newLandlords}`);
      console.log(`   Active Students: ${userData.data.totalActiveStudents}`);
      console.log(`   Active Landlords: ${userData.data.totalActiveLandlords}`);
    } else {
      console.log('❌ User Activity: FAILED');
      console.log(`   Error: ${userData.message}`);
    }

    console.log('\n');

    // Test 6: Subscription Report
    console.log('6️⃣ Testing Subscription Report...');
    const subscriptionResponse = await fetch(
      `${API_URL}/reports/subscriptions`,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const subscriptionData = await subscriptionResponse.json();
    
    if (subscriptionData.success) {
      console.log('✅ Subscription Report: SUCCESS');
      console.log(`   Free: ${subscriptionData.data.free}`);
      console.log(`   Basic: ${subscriptionData.data.basic}`);
      console.log(`   Premium: ${subscriptionData.data.premium}`);
      console.log(`   Active: ${subscriptionData.data.active}`);
    } else {
      console.log('❌ Subscription Report: FAILED');
      console.log(`   Error: ${subscriptionData.message}`);
    }

    console.log('\n');

    // Test 7: Verification Report
    console.log('7️⃣ Testing Verification Report...');
    const verificationResponse = await fetch(
      `${API_URL}/reports/verifications`,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const verificationData = await verificationResponse.json();
    
    if (verificationData.success) {
      console.log('✅ Verification Report: SUCCESS');
      console.log(`   Pending: ${verificationData.data.pending}`);
      console.log(`   Verified: ${verificationData.data.verified}`);
      console.log(`   Total: ${verificationData.data.total}`);
    } else {
      console.log('❌ Verification Report: FAILED');
      console.log(`   Error: ${verificationData.message}`);
    }

    console.log('\n');
    console.log('✅ All Analytics Tests Complete!');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Backend server is running');
    console.log('   2. You have a valid admin token');
    console.log('   3. Database has some data');
  }
}

// Instructions
console.log('📝 INSTRUCTIONS:');
console.log('1. Login as admin and get your token from localStorage');
console.log('2. Replace ADMIN_TOKEN in this file with your token');
console.log('3. Run: node backend/test-analytics.js\n');

// Uncomment to run the test
// testAnalytics();

export default testAnalytics;
