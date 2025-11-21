/**
 * Test Property Images API
 * Run this to check if properties have unique images
 */

import { supabase } from './config/database.js';

async function testPropertyImages() {
  console.log('🔍 Testing Property Images...\n');

  try {
    // Get all properties with images
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        property_images (
          image_url,
          is_primary
        )
      `)
      .limit(20);

    if (error) throw error;

    console.log(`📊 Found ${properties.length} properties\n`);

    // Track image URLs
    const imageUsage = new Map();
    let propertiesWithoutImages = 0;
    let propertiesWithImages = 0;

    properties.forEach(property => {
      console.log(`\n🏠 ${property.title}`);
      console.log(`   ID: ${property.id}`);

      if (!property.property_images || property.property_images.length === 0) {
        console.log('   ❌ NO IMAGES');
        propertiesWithoutImages++;
      } else {
        propertiesWithImages++;
        const primaryImage = property.property_images.find(img => img.is_primary);
        const imageUrl = primaryImage?.image_url || property.property_images[0]?.image_url;
        
        console.log(`   ✅ ${property.property_images.length} image(s)`);
        console.log(`   📸 Primary: ${imageUrl?.substring(0, 60)}...`);

        // Track usage
        if (imageUrl) {
          if (!imageUsage.has(imageUrl)) {
            imageUsage.set(imageUrl, []);
          }
          imageUsage.get(imageUrl).push(property.title);
        }
      }
    });

    // Summary
    console.log('\n\n📈 SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Total Properties: ${properties.length}`);
    console.log(`With Images: ${propertiesWithImages}`);
    console.log(`Without Images: ${propertiesWithoutImages}`);
    console.log(`Unique Images: ${imageUsage.size}`);

    // Check for duplicates
    console.log('\n\n🔄 DUPLICATE IMAGE CHECK');
    console.log('═══════════════════════════════════════');
    
    let hasDuplicates = false;
    imageUsage.forEach((propertyTitles, imageUrl) => {
      if (propertyTitles.length > 1) {
        hasDuplicates = true;
        console.log(`\n⚠️  ${propertyTitles.length} properties using same image:`);
        console.log(`   Image: ${imageUrl.substring(0, 60)}...`);
        propertyTitles.forEach(title => {
          console.log(`   - ${title}`);
        });
      }
    });

    if (!hasDuplicates) {
      console.log('✅ All properties have unique images!');
    }

    // Recommendations
    console.log('\n\n💡 RECOMMENDATIONS');
    console.log('═══════════════════════════════════════');
    
    if (propertiesWithoutImages > 0) {
      console.log(`⚠️  ${propertiesWithoutImages} properties need images`);
      console.log('   Run: backend/database/check_and_verify_properties.sql');
    }

    if (hasDuplicates) {
      console.log('⚠️  Multiple properties share the same image');
      console.log('   Run: backend/database/fix_duplicate_images.sql');
      console.log('   OR: Have landlords upload unique images');
    }

    if (!hasDuplicates && propertiesWithoutImages === 0) {
      console.log('✅ Everything looks good!');
      console.log('   All properties have unique images');
    }

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the test
testPropertyImages()
  .then(() => {
    console.log('✅ Test complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
