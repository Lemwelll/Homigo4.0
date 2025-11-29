/**
 * Check escrow and property linkage
 */

import { supabase } from './config/database.js';

async function checkEscrowPropertyLink() {
  console.log('🔍 Checking Escrow-Property Linkage...\n');

  try {
    // 1. Check escrow_transactions table
    console.log('1️⃣ Checking escrow_transactions table:');
    const { data: transactions, error: transError } = await supabase
      .from('escrow_transactions')
      .select('id, property_id, status, released_date')
      .eq('status', 'released');

    if (transError) {
      console.error('❌ Error:', transError);
    } else {
      console.log(`   Found ${transactions?.length || 0} released escrow transactions`);
      transactions?.forEach(t => {
        console.log(`   - ID: ${t.id}, Property: ${t.property_id}, Released: ${t.released_date}`);
      });
    }

    // 2. Check escrow_payments table
    console.log('\n2️⃣ Checking escrow_payments table:');
    const { data: payments, error: payError } = await supabase
      .from('escrow_payments')
      .select('id, property_id, status, released_date')
      .eq('status', 'released');

    if (payError) {
      console.error('❌ Error:', payError);
    } else {
      console.log(`   Found ${payments?.length || 0} released escrow payments`);
      payments?.forEach(p => {
        console.log(`   - ID: ${p.id}, Property: ${p.property_id}, Released: ${p.released_date}`);
      });
    }

    // 3. Check properties with released escrow
    console.log('\n3️⃣ Checking properties:');
    const propertyIds = [
      ...(transactions?.map(t => t.property_id) || []),
      ...(payments?.map(p => p.property_id) || [])
    ];

    if (propertyIds.length > 0) {
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, title, landlord_id')
        .in('id', propertyIds);

      if (propError) {
        console.error('❌ Error:', propError);
      } else {
        console.log(`   Found ${properties?.length || 0} properties:`);
        properties?.forEach(p => {
          console.log(`   - ${p.title} (ID: ${p.id})`);
        });
      }
    } else {
      console.log('   No properties with released escrow found');
    }

    // 4. Check Bayson Lemuel specifically
    console.log('\n4️⃣ Checking Bayson Lemuel properties:');
    const { data: baysonProps, error: baysonError } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        landlord_id,
        users!properties_landlord_id_fkey (full_name)
      `)
      .ilike('title', '%bayson%');

    if (baysonError) {
      console.error('❌ Error:', baysonError);
    } else {
      console.log(`   Found ${baysonProps?.length || 0} Bayson properties:`);
      for (const prop of baysonProps || []) {
        console.log(`   - ${prop.title} (ID: ${prop.id})`);
        
        // Check escrow for this property
        const { data: escrowTrans } = await supabase
          .from('escrow_transactions')
          .select('id, status, released_date')
          .eq('property_id', prop.id);
        
        const { data: escrowPay } = await supabase
          .from('escrow_payments')
          .select('id, status, released_date')
          .eq('property_id', prop.id);

        console.log(`     Escrow Transactions: ${escrowTrans?.length || 0}`);
        escrowTrans?.forEach(e => console.log(`       - ${e.status} (${e.released_date || 'N/A'})`));
        
        console.log(`     Escrow Payments: ${escrowPay?.length || 0}`);
        escrowPay?.forEach(e => console.log(`       - ${e.status} (${e.released_date || 'N/A'})`));
      }
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

checkEscrowPropertyLink();
