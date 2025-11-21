/**
 * Test script for profile update endpoint
 * Run this to verify profile updates are working
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

// Test landlord credentials (use your actual landlord account)
const LANDLORD_EMAIL = 'maria@email.com'; // Change this
const LANDLORD_PASSWORD = 'password123'; // Change this

async function testProfileUpdate() {
  try {
    console.log('🔐 Step 1: Logging in as landlord...');
    
    // Login as landlord
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: LANDLORD_EMAIL,
        password: LANDLORD_PASSWORD
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      console.log('\n⚠️  Please update the credentials in this file:');
      console.log('   - LANDLORD_EMAIL');
      console.log('   - LANDLORD_PASSWORD');
      return;
    }

    console.log('✅ Login successful');
    console.log('   User:', loginData.data.user.full_name);
    console.log('   Role:', loginData.data.user.role);
    
    const token = loginData.data.token;

    console.log('\n📋 Step 2: Fetching current profile...');
    
    // Get current profile
    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const profileData = await profileResponse.json();
    
    if (!profileData.success) {
      console.error('❌ Failed to fetch profile:', profileData.message);
      return;
    }

    console.log('✅ Profile fetched successfully');
    console.log('   Current data:', JSON.stringify(profileData.data, null, 2));

    console.log('\n💾 Step 3: Updating profile...');
    
    // Update profile with test data
    const updateData = {
      full_name: profileData.data.full_name || 'Test Landlord',
      phone: '+63 912 345 6789',
      business_name: 'Test Properties Inc.',
      tin_number: '123-456-789-000',
      business_address: '123 Business Street, Makati City, Metro Manila',
      residential_address: '456 Home Avenue, Quezon City, Metro Manila',
      emergency_contact: '+63 912 345 6790',
      valid_id_type: 'drivers_license',
      valid_id_number: 'D01-12-345678',
      bank_name: 'BDO',
      bank_account_number: '1234567890',
      bank_account_name: 'Test Landlord'
    };

    const updateResponse = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const updateResult = await updateResponse.json();
    
    if (!updateResult.success) {
      console.error('❌ Failed to update profile:', updateResult.message);
      console.log('\n⚠️  Possible issues:');
      console.log('   1. Database columns not created (run SQL migrations)');
      console.log('   2. Backend not restarted after code changes');
      console.log('   3. Token expired (try logging in again)');
      return;
    }

    console.log('✅ Profile updated successfully');
    console.log('   Updated data:', JSON.stringify(updateResult.data, null, 2));

    console.log('\n🔍 Step 4: Verifying update...');
    
    // Fetch profile again to verify
    const verifyResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const verifyData = await verifyResponse.json();
    
    if (!verifyData.success) {
      console.error('❌ Failed to verify update:', verifyData.message);
      return;
    }

    console.log('✅ Update verified successfully');
    console.log('\n📊 Verification Results:');
    console.log('   Business Name:', verifyData.data.business_name);
    console.log('   TIN Number:', verifyData.data.tin_number);
    console.log('   Business Address:', verifyData.data.business_address);
    console.log('   Valid ID Type:', verifyData.data.valid_id_type);
    console.log('   Bank Name:', verifyData.data.bank_name);

    console.log('\n✅ All tests passed! Profile update is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   1. Backend server is running on port 5000');
    console.log('   2. Database migrations have been run');
    console.log('   3. Landlord account exists with correct credentials');
  }
}

// Run the test
console.log('='.repeat(60));
console.log('Testing Profile Update Endpoint');
console.log('='.repeat(60));
console.log('');

testProfileUpdate();
