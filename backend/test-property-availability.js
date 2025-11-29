import { supabase } from './config/database.js';

async function testPropertyAvailability() {
  console.log('🔍 Testing Property Availability System...\n');

  try {
    // 1. Check all properties
    console.log('📋 Step 1: Fetching all properties...');
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id, title, verification_status')
      .limit(5);

    if (propError) throw propError;
    console.log(`✅ Found ${properties.length} properties`);
    properties.forEach(p => console.log(`   - ${p.title} (${p.id})`));

    // 2. Check all bookings
    console.log('\n📋 Step 2: Fetching all bookings...');
    const { data: bookings, error: bookError } = await supabase
      .from('bookings')
      .select('id, property_id, status, created_at');

    if (bookError) throw bookError;
    console.log(`✅ Found ${bookings?.length || 0} bookings`);
    if (bookings && bookings.length > 0) {
      bookings.forEach(b => console.log(`   - Property ${b.property_id}: ${b.status}`));
    }

    // 3. Test the verified properties endpoint
    console.log('\n📋 Step 3: Testing /properties/verified endpoint...');
    const response = await fetch('http://localhost:5000/properties/verified');
    const data = await response.json();

    if (data.success) {
      console.log(`✅ API returned ${data.data.length} properties`);
      
      // Check which properties have isRented flag
      const rentedProperties = data.data.filter(p => p.isRented);
      console.log(`\n🏠 Properties marked as RENTED: ${rentedProperties.length}`);
      
      if (rentedProperties.length > 0) {
        rentedProperties.forEach(p => {
          console.log(`   ✓ ${p.title} - isRented: ${p.isRented}`);
        });
      } else {
        console.log('   ⚠️ No properties are currently marked as rented');
      }

      // Show all properties with their status
      console.log('\n📊 All Properties Status:');
      data.data.forEach(p => {
        console.log(`   - ${p.title}: isRented=${p.isRented || false}`);
      });
    }

    // 4. Create a test booking to verify the system works
    if (properties.length > 0 && (!bookings || bookings.length === 0)) {
      console.log('\n⚠️ No bookings found. To test the "NOT AVAILABLE" feature:');
      console.log('   1. Go to the student portal');
      console.log('   2. Book a property');
      console.log('   3. Refresh the browse page');
      console.log('   4. The booked property should show "NOT AVAILABLE" in gray');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPropertyAvailability();
