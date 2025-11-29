/**
 * Automated Script to Fix API URLs
 * Replaces all localhost:5000 with environment variable
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/context/AuthContext.jsx',
  'src/context/StudentContext.jsx',
  'src/context/MessageContext.jsx',
  'src/pages/StudentRegister.jsx',
  'src/pages/LandlordRegister.jsx',
  'src/pages/StudentLogin.jsx',
  'src/pages/LandlordLogin.jsx',
  'src/pages/PropertyDetails.jsx',
  // Add more files as needed
];

console.log('🔧 Starting API URL fix...\n');

let totalFixed = 0;

filesToFix.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${filePath} (not found)`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Check if API_URL is already imported
    const hasImport = content.includes("import API_URL from") || content.includes("import { API_URL }");

    // Replace localhost:5000 with ${API_URL}
    const regex = /['"]http:\/\/localhost:5000/g;
    const matches = content.match(regex);

    if (matches && matches.length > 0) {
      console.log(`📝 Fixing ${filePath}...`);
      console.log(`   Found ${matches.length} occurrence(s)`);

      // Replace all occurrences
      content = content.replace(/['"]http:\/\/localhost:5000/g, '`${API_URL}');
      
      // Add import if not present
      if (!hasImport) {
        // Find the last import statement
        const importRegex = /import .+ from .+['"]\n/g;
        const imports = content.match(importRegex);
        
        if (imports && imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          const lastImportIndex = content.lastIndexOf(lastImport);
          const insertPosition = lastImportIndex + lastImport.length;
          
          content = content.slice(0, insertPosition) + 
                   "import API_URL from '../config/api'\n" +
                   content.slice(insertPosition);
          
          console.log(`   ✅ Added API_URL import`);
        }
      }

      // Write back
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Fixed!\n`);
      totalFixed++;
    } else {
      console.log(`✓ ${filePath} (no changes needed)\n`);
    }

  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Done! Fixed ${totalFixed} file(s)`);
console.log('\n📋 Next steps:');
console.log('1. Update .env.production with your backend URL');
console.log('2. git add .');
console.log('3. git commit -m "Fix mobile network error"');
console.log('4. git push');
console.log('5. Test on mobile!');
