import { supabase } from './config/database.js';

async function checkBookings() {
  console.log('🔍 Checking for actual bookings in database...\n');

  try {
    // Check all bookings
    const { data: bookings, error: bookError } = await supabase
      .from('bookings')
      .select(`
        id,
        property_id,
        student_id,
        status,
        created_at,
        properties (
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (bookError) {
      console.error('❌ Error fetching bookings:', bookError);
      return;
    }

    console.log(`📊 Total bookings found: ${bookings?.length || 0}\n`);

    if (bookings && bookings.length > 0) {
      console.log('📋 Booking Details:');
      bookings.forEach((booking, index) => {
        console.log(`\n${index + 1}. Property: ${booking.properties?.title || 'Unknown'}`);
        console.log(`   Status: ${booking.status}`);
        console.log(`   Property ID: ${booking.property_id}`);
        console.log(`   Created: ${new Date(booking.created_at).toLocaleString()}`);
      });

      // Check which statuses should mark property as unavailable
      const unavailableStatuses = ['active', 'completed', 'approved'];
      const unavailableBookings = bookings.filter(b => 
        unavailableStatuses.includes(b.status)
      );

      console.log(`\n\n🏠 Properties that should show "NOT AVAILABLE":`);
      console.log(`   Total: ${unavailableBookings.length}`);
      
      if (unavailableBookings.length > 0) {
        unavailableBookings.forEach((booking, index) => {
          console.log(`\n   ${index + 1}. ${booking.properties?.title || 'Unknown'}`);
          console.log(`      Status: ${booking.status}`);
        });
      } else {
        console.log('   ⚠️ No bookings with status: active, completed, or approved');
      }

      // Show all unique statuses
      const uniqueStatuses = [...new Set(bookings.map(b => b.status))];
      console.log(`\n\n📌 All booking statuses in database:`);
      uniqueStatuses.forEach(status => {
        const count = bookings.filter(b => b.status === status).length;
        console.log(`   - ${status}: ${count}`);
      });

    } else {
      console.log('⚠️ No bookings found in database');
      console.log('\nTo test the "NOT AVAILABLE" feature:');
      console.log('1. Login as a student');
      console.log('2. Book a property');
      console.log('3. The booked property will show as "NOT AVAILABLE"');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkBookings();
