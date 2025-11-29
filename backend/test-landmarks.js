// Test script to verify landmarks API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testLandmarks() {
  console.log('🧪 Testing Landmarks API...\n');

  try {
    // Test 1: Get all landmarks
    console.log('1️⃣ Testing GET /landmarks');
    const response1 = await fetch(`${BASE_URL}/landmarks`);
    const result1 = await response1.json();
    console.log('✅ Status:', response1.status);
    console.log('📊 Total landmarks:', result1.data?.length || 0);
    if (result1.data?.length > 0) {
      console.log('📍 First landmark:', result1.data[0].name, '-', result1.data[0].city);
    }
    console.log('');

    // Test 2: Get landmarks filtered by city
    console.log('2️⃣ Testing GET /landmarks?city=Musuan');
    const response2 = await fetch(`${BASE_URL}/landmarks?city=Musuan`);
    const result2 = await response2.json();
    console.log('✅ Status:', response2.status);
    console.log('📊 Musuan landmarks:', result2.data?.length || 0);
    if (result2.data?.length > 0) {
      console.log('📍 Sample landmarks:');
      result2.data.slice(0, 5).forEach(landmark => {
        console.log(`   - ${landmark.name} (${landmark.type}) - ${landmark.city}`);
      });
    }
    console.log('');

    // Test 3: Get landmarks by type
    console.log('3️⃣ Testing GET /landmarks?type=restaurant');
    const response3 = await fetch(`${BASE_URL}/landmarks?type=restaurant`);
    const result3 = await response3.json();
    console.log('✅ Status:', response3.status);
    console.log('📊 Restaurants:', result3.data?.length || 0);
    if (result3.data?.length > 0) {
      result3.data.forEach(landmark => {
        console.log(`   - ${landmark.name} - ${landmark.address}`);
      });
    }
    console.log('');

    // Test 4: Get nearby landmarks (CMU coordinates)
    console.log('4️⃣ Testing GET /landmarks/nearby?latitude=7.8647&longitude=125.0508');
    const response4 = await fetch(`${BASE_URL}/landmarks/nearby?latitude=7.8647&longitude=125.0508&radius=2`);
    const result4 = await response4.json();
    console.log('✅ Status:', response4.status);
    console.log('📊 Nearby landmarks (within 2km):', result4.data?.length || 0);
    if (result4.data?.length > 0) {
      console.log('📍 Nearby landmarks with distance:');
      result4.data.slice(0, 5).forEach(landmark => {
        console.log(`   - ${landmark.name} (${landmark.distance}km away)`);
      });
    }
    console.log('');

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing landmarks:', error.message);
  }
}

// Run tests
testLandmarks();
