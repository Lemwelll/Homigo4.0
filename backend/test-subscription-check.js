/**
 * Test Subscription Check
 * Run this to verify subscription status is being read correctly
 */

import { supabase } from './config/database.js';

async function testSubscriptionCheck() {
  console.log('\n🔍 Testing Subscription Check...\n');

  try {
    // Get all users with their subscriptions
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .in('role', ['student', 'landlord'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log(`Found ${users.length} users\n`);

    // Check subscription for each user
    for (const user of users) {
      console.log(`\n👤 User: ${user.full_name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);

      // Check subscriptions table
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('tier, status, start_date, end_date')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) {
        console.log(`   ❌ Error: ${subError.message}`);
      } else if (subscription) {
        console.log(`   ✅ Subscription: ${subscription.tier.toUpperCase()}`);
        console.log(`   📅 Valid until: ${subscription.end_date || 'N/A'}`);
      } else {
        console.log(`   ⚠️  No active subscription (defaults to FREE)`);
      }

      // If landlord, check property count
      if (user.role === 'landlord') {
        const { data: properties, error: propError } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', user.id);

        if (!propError) {
          const count = properties?.length || 0;
          const tier = subscription?.tier || 'free';
          const limit = tier === 'free' ? 3 : '∞';
          console.log(`   🏠 Properties: ${count}/${limit}`);
        }
      }

      // If student, check reservation count
      if (user.role === 'student') {
        const { data: reservations, error: resError } = await supabase
          .from('reservations')
          .select('id')
          .eq('student_id', user.id)
          .in('status', ['reserved', 'approved']);

        if (!resError) {
          const count = reservations?.length || 0;
          const tier = subscription?.tier || 'free';
          const limit = tier === 'free' ? 2 : '∞';
          console.log(`   📋 Active Reservations: ${count}/${limit}`);
        }
      }
    }

    console.log('\n\n📊 Summary of All Active Subscriptions:\n');

    const { data: allSubs, error: allSubsError } = await supabase
      .from('subscriptions')
      .select(`
        tier,
        status,
        users (
          email,
          full_name,
          role
        )
      `)
      .eq('status', 'active');

    if (!allSubsError && allSubs) {
      const premiumCount = allSubs.filter(s => s.tier === 'premium').length;
      const freeCount = allSubs.filter(s => s.tier === 'free').length;

      console.log(`   Premium: ${premiumCount}`);
      console.log(`   Free: ${freeCount}`);
      console.log(`   Total: ${allSubs.length}`);

      if (premiumCount > 0) {
        console.log('\n   Premium Users:');
        allSubs
          .filter(s => s.tier === 'premium')
          .forEach(s => {
            console.log(`   - ${s.users.full_name} (${s.users.email}) - ${s.users.role}`);
          });
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSubscriptionCheck()
  .then(() => {
    console.log('\n✅ Test completed\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
