/**
 * Create Admin User Script
 * Creates an admin user with email: admin@homigo.com and password: admin123
 */

import bcrypt from 'bcrypt';
import { supabase } from '../config/database.js';

const createAdminUser = async () => {
  try {
    console.log('🔐 Creating admin user...\n');

    const adminData = {
      email: 'admin@homigo.com',
      password: 'admin123',
      fullName: 'System Administrator',
      phone: '+639123456789'
    };

    // Check if admin already exists
    console.log('📋 Checking if admin user already exists...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', adminData.email)
      .maybeSingle();

    if (checkError) {
      console.error('❌ Error checking for existing user:', checkError);
      throw checkError;
    }

    if (existingUser) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Role:', existingUser.role);
      console.log('🆔 ID:', existingUser.id);
      console.log('\n✅ No action needed - admin user is already set up.');
      return;
    }

    // Hash the password
    console.log('🔒 Hashing password...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminData.password, saltRounds);
    console.log('✅ Password hashed successfully');

    // Create the admin user
    console.log('👤 Creating admin user in database...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        full_name: adminData.fullName,
        email: adminData.email,
        password_hash: passwordHash,
        phone: adminData.phone,
        role: 'admin',
        is_active: true,
        is_verified: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating admin user:', insertError);
      throw insertError;
    }

    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    ', adminData.email);
    console.log('🔑 Password: ', adminData.password);
    console.log('👤 Name:     ', adminData.fullName);
    console.log('📱 Phone:    ', adminData.phone);
    console.log('🆔 User ID:  ', newUser.id);
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdminUser()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
