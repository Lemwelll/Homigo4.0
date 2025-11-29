import dotenv from 'dotenv';
import { supabase } from './config/database.js';

dotenv.config();

async function checkView() {
  try {
    // Check if view exists and what it returns
    const { data, error } = await supabase
      .from('fast_verified_properties')
      .select('*')
      .limit(2);

    if (error) {
      console.log('View does not exist or error:', error.message);
      return;
    }

    console.log('View exists! Data:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data && data.length > 0) {
      console.log('\nFirst property keys:', Object.keys(data[0]));
      console.log('\nDoes it have property_images?', 'property_images' in data[0]);
      console.log('Does it have primary_image?', 'primary_image' in data[0]);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkView();
