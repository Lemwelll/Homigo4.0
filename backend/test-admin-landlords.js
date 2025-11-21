/**
 * Test script for admin landlords endpoint
 * Run this to verify the endpoint is working
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

// Admin credentials
const ADMIN_EMAIL = 'admin@homigo.com';
const ADMIN_PASSWORD = 'admin123';

async function testAdminLandlords() {
  try {
    console.log('🔐 Step 1: Logging in as admin...');
    
    // Login as admin
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }

    console.log('✅ Login successful');
    console.log('   User:', loginData.data.user.full_name);
    console.log('   Role:', loginData.data.user.role);
    
    const token = loginData.data.token;

    console.log('\n📋 Step 2: Fetching all landlords...');
    
    // Fetch landlords
    const landlordsResponse = await fetch(`${API_URL}/admin/landlords`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const landlordsData = await landlordsResponse.json();
    
    if (!landlordsData.success) {
      console.error('❌ Failed to fetch landlords:', landlordsData.message);
      return;
    }

    console.log('✅ Landlords fetched successfully');
    console.log('   Total landlords:', landlordsData.count);
    
    if (landlordsData.data.length > 0) {
      console.log('\n📊 Landlord Details:');
      landlordsData.data.forEach((landlord, index) => {
        console.log(`\n   ${index + 1}. ${landlord.full_name}`);
        console.log(`      Email: ${landlord.email}`);
        console.log(`      Phone: ${landlord.phone || 'N/A'}`);
        console.log(`      Business: ${landlord.business_name || 'N/A'}`);
        console.log(`      Verified: ${landlord.is_verified ? 'Yes' : 'No'}`);
        console.log(`      Properties: ${landlord.total_properties || 0}`);
        console.log(`      Joined: ${new Date(landlord.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('\n⚠️  No landlords found in the database');
      console.log('   Tip: Register a landlord account first');
    }

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
console.log('='.repeat(50));
console.log('Testing Admin Landlords Endpoint');
console.log('='.repeat(50));
console.log('');

testAdminLandlords();
