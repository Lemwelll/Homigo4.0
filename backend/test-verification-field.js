/**
 * Test script to verify that verification_status field is being returned
 */

const API_URL = 'http://localhost:5000';

async function testVerificationField() {
  try {
    console.log('🔍 Testing /properties/verified endpoint...\n');
    
    const response = await fetch(`${API_URL}/properties/verified`);
    const data = await response.json();
    
    if (!data.success) {
      console.error('❌ API returned error:', data.message);
      return;
    }
    
    console.log(`✅ Found ${data.data.length} properties\n`);
    
    // Check each property for verification_status field
    data.data.forEach((property, index) => {
      console.log(`Property ${index + 1}: ${property.title}`);
      console.log(`  - ID: ${property.id}`);
      console.log(`  - verification_status: ${property.verification_status || 'MISSING!'}`);
      console.log(`  - Has field: ${property.hasOwnProperty('verification_status') ? 'YES ✅' : 'NO ❌'}`);
      console.log('');
    });
    
    // Summary
    const withField = data.data.filter(p => p.hasOwnProperty('verification_status')).length;
    const verified = data.data.filter(p => p.verification_status === 'verified').length;
    
    console.log('\n📊 Summary:');
    console.log(`  - Total properties: ${data.data.length}`);
    console.log(`  - With verification_status field: ${withField}`);
    console.log(`  - Status = 'verified': ${verified}`);
    
    if (withField === data.data.length && verified > 0) {
      console.log('\n✅ SUCCESS! All properties have verification_status field');
    } else {
      console.log('\n❌ ISSUE: Some properties missing verification_status field');
      console.log('   → Make sure backend server is restarted after code changes');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Backend server is running (npm run dev in backend folder)');
    console.log('   2. Server is on http://localhost:5000');
  }
}

testVerificationField();
