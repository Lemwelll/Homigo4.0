import dotenv from 'dotenv';
import { supabase } from './config/database.js';

dotenv.config();

async function checkImages() {
    try {
        // Get all property images
        const { data: images, error } = await supabase
            .from('property_images')
            .select('*')
            .limit(10);

        if (error) throw error;

        console.log('Property Images in Database:');
        console.log('============================');
        images.forEach(img => {
            console.log(`\nProperty ID: ${img.property_id}`);
            console.log(`Image URL (first 100 chars): ${img.image_url.substring(0, 100)}...`);
            console.log(`Is Primary: ${img.is_primary}`);
            console.log(`Display Order: ${img.display_order}`);
        });

        // Get properties with their images
        const { data: properties, error: propError } = await supabase
            .from('properties')
            .select(`
        id,
        title,
        property_images (
          image_url,
          is_primary
        )
      `)
            .limit(5);

        if (propError) throw propError;

        console.log('\n\nProperties with Images:');
        console.log('=======================');
        properties.forEach(prop => {
            console.log(`\nProperty: ${prop.title}`);
            console.log(`Number of images: ${prop.property_images.length}`);
            if (prop.property_images.length > 0) {
                console.log(`First image (first 100 chars): ${prop.property_images[0].image_url.substring(0, 100)}...`);
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkImages();
