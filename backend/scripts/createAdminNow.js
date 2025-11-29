/**
 * Create Admin User - Simple Version
 * Run this to create admin@homigo.com with password admin123
 */

import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  console.log('\n🔐 Creating Admin Account...\n');

  const adminEmail = 'admin@homigo.com';
  const adminPassword = 'admin123';

  try {
    // Step 1: Hash the password
    console.log('🔒 Hashing password...');
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    console.log('✅ Password hashed');

    // Step 2: Check if admin exists
    console.log('📋 Checking if admin exists...');
    const { data: existing } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', adminEmail)
      .maybeSingle();

    if (existing) {
      console.log('⚠️  Admin already exists! Updating password...');
      
      // Update existing admin
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          role: 'admin',
          is_active: true,
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', adminEmail);

      if (updateError) {
        console.error('❌ Error updating admin:', updateError);
        process.exit(1);
      }

      console.log('✅ Admin password updated!');
    } else {
      console.log('📝 Creating new admin...');
      
      // Create new admin
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          full_name: 'System Administrator',
          email: adminEmail,
          password_hash: passwordHash,
          phone: '+639123456789',
          role: 'admin',
          is_active: true,
          is_verified: true
        });

      if (insertError) {
        console.error('❌ Error creating admin:', insertError);
        process.exit(1);
      }

      console.log('✅ Admin created!');
    }

    // Step 3: Verify
    console.log('\n📊 Verifying admin account...');
    const { data: admin } = await supabase
      .from('users')
      .select('id, email, role, is_active, is_verified')
      .eq('email', adminEmail)
      .single();

    if (admin) {
      console.log('\n═══════════════════════════════════════');
      console.log('✅ ADMIN ACCOUNT READY');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:      ', adminEmail);
      console.log('🔑 Password:   ', adminPassword);
      console.log('👤 Role:       ', admin.role);
      console.log('✓  Active:     ', admin.is_active);
      console.log('✓  Verified:   ', admin.is_verified);
      console.log('🆔 ID:         ', admin.id);
      console.log('═══════════════════════════════════════');
      console.log('\n✅ You can now login!\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin().then(() => process.exit(0));
