/**
 * Create Admin Account Script
 * Run this script to create a single admin account
 * Usage: node backend/scripts/createAdmin.js
 */

import bcrypt from 'bcrypt';
import { supabase } from '../config/database.js';

const createAdminAccount = async () => {
  try {
    console.log('🔧 Creating admin account...\n');

    // Admin credentials
    const adminData = {
      full_name: 'System Administrator',
      email: 'admin@homigo.com',
      password: 'Admin@123',
      phone: '+639123456789',
      role: 'admin'
    };

    // Delete any existing admin accounts (to ensure only 1 admin)
    console.log('🗑️  Removing existing admin accounts...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('role', 'admin');

    if (deleteError) {
      console.error('Error deleting existing admins:', deleteError);
    } else {
      console.log('✅ Existing admin accounts removed\n');
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(adminData.password, 10);
    console.log('✅ Password hashed\n');

    // Create the admin account
    console.log('👤 Creating admin account...');
    const { data: admin, error: createError } = await supabase
      .from('users')
      .insert({
        full_name: adminData.full_name,
        email: adminData.email,
        password_hash: passwordHash,
        phone: adminData.phone,
        role: adminData.role,
        is_active: true,
        is_verified: true
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating admin:', createError);
      process.exit(1);
    }

    console.log('✅ Admin account created successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 ADMIN ACCOUNT DETAILS');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Name:     ${admin.full_name}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log(`Phone:    ${admin.phone}`);
    console.log(`Role:     ${admin.role}`);
    console.log(`ID:       ${admin.id}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🌐 Login at: http://localhost:5173/login');
    console.log('   Select "Admin" as user type\n');
    console.log('⚠️  IMPORTANT: Change this password in production!\n');

    // Verify only one admin exists
    const { data: allAdmins, error: countError } = await supabase
      .from('users')
      .select('id, email')
      .eq('role', 'admin');

    if (!countError) {
      console.log(`✅ Total admin accounts: ${allAdmins.length}`);
      if (allAdmins.length > 1) {
        console.log('⚠️  WARNING: Multiple admin accounts detected!');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdminAccount();
