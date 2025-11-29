/**
 * Check Bookings in Database
 * Run this to see if bookings exist and which properties should be unavailable
 */

import { supabase } from './config/database.js';

async function checkBookings() {
  console.log('\n🔍 Checking Bookings in Database...\n');

  try {
    // Check all bookings
    const { data: allBookings, error: allError } = await supabase
      .from('bookings')
      .select(`
        id,
        property_id,
        status,
        properties (
          id,
          title
        ),
        users!bookings_student_id_fkey (
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error fetching bookings:', allError);
      return;
    }

    console.log(`📊 Total bookings in database: ${allBookings?.length || 0}\n`);

    if (!allBookings || allBookings.length === 0) {
      console.log('⚠️  NO BOOKINGS FOUND IN DATABASE!');
      console.log('   This is why properties are not showing as unavailable.');
      console.log('   You need to book a property first.\n');
      return;
    }

    // Show all bookings
    console.log('All Bookings:');
    allBookings.forEach((booking, index) => {
      console.log(`\n${index + 1}. Booking ID: ${booking.id}`);
      console.log(`   Property: ${booking.properties?.title || 'Unknown'}`);
      console.log(`   Student: ${booking.users?.full_name || 'Unknown'}`);
      console.log(`   Status: ${booking.status}`);
    });

    // Check ACTIVE bookings (these should make properties unavailable)
    const { data: activeBookings, error: activeError } = await supabase
      .from('bookings')
      .select(`
        property_id,
        status,
        properties (
          title
        )
      `)
      .in('status', ['active', 'completed']);

    if (activeError) {
      console.error('❌ Error fetching active bookings:', activeError);
      return;
    }

    console.log(`\n\n🏠 Properties that SHOULD show as UNAVAILABLE: ${activeBookings?.length || 0}\n`);

    if (!activeBookings || activeBookings.length === 0) {
      console.log('⚠️  NO ACTIVE/COMPLETED BOOKINGS!');
      console.log('   All bookings have status other than "active" or "completed"');
      console.log('   Properties will NOT show as unavailable.\n');
      return;
    }

    activeBookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.properties?.title || 'Unknown Property'}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Property ID: ${booking.property_id}\n`);
    });

    console.log('✅ These properties should show "NOT AVAILABLE" badge');
    console.log('✅ Make sure backend is restarted to see the changes!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the check
checkBookings()
  .then(() => {
    console.log('✅ Check complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Check failed:', error);
    process.exit(1);
  });
