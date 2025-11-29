/**
 * Script to replace all hardcoded localhost URLs with proper API_URL import
 * This ensures the app uses the Render backend URL in production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need to be updated
const filesToUpdate = [
  'src/pages/StudentSettings.jsx',
  'src/pages/StudentRegister.jsx',
  'src/pages/StudentMessages.jsx',
  'src/pages/SecurePayment.jsx',
  'src/pages/PublicListings.jsx',
  'src/pages/PropertyDetails.jsx',
  'src/pages/PaymentMethods.jsx',
  'src/pages/PaymentHistory.jsx',
  'src/pages/LandmarksMap.jsx',
  'src/pages/LandlordSettings.jsx',
  'src/pages/LandlordRegister.jsx',
  'src/pages/LandlordEscrow.jsx',
  'src/pages/AdminLandlords.jsx',
  'src/context/StudentContext.jsx',
  'src/context/PropertyContext.jsx',
  'src/context/NotificationContext.jsx',
  'src/context/MessageContext.jsx',
  'src/context/AuthContext.jsx',
  'src/context/AdminContext.jsx',
  'src/context/AccountTierContext.jsx',
  'src/components/PropertyReviews.jsx'
];

console.log('🔧 Starting localhost URL replacement...\n');

let totalReplacements = 0;

filesToUpdate.forEach(filePath => {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let replacements = 0;

    // Count occurrences before replacement
    const matches = content.match(/http:\/\/localhost:5000/g);
    if (matches) {
      replacements = matches.length;
    }

    // Replace hardcoded localhost URLs with API_URL variable
    const updatedContent = content.replace(/['"]http:\/\/localhost:5000['"]/g, 'API_URL');

    // Check if file needs API_URL import
    const needsImport = !content.includes("from '../config/api'") && 
                        !content.includes("from '../../config/api'") &&
                        !content.includes('const API_URL =') &&
                        replacements > 0;

    if (needsImport) {
      // Determine correct import path based on file location
      const isInPages = filePath.includes('/pages/');
      const isInContext = filePath.includes('/context/');
      const isInComponents = filePath.includes('/components/');
      
      let importPath = '../config/api';
      if (isInContext || isInComponents) {
        importPath = '../config/api';
      }

      // Add import after the last import statement
      const lastImportIndex = updatedContent.lastIndexOf('import ');
      const endOfLastImport = updatedContent.indexOf('\n', lastImportIndex);
      
      const beforeImports = updatedContent.substring(0, endOfLastImport + 1);
      const afterImports = updatedContent.substring(endOfLastImport + 1);
      
      const finalContent = beforeImports + 
                          `import API_URL from '${importPath}'\n` + 
                          afterImports;
      
      fs.writeFileSync(fullPath, finalContent, 'utf8');
    } else {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
    }

    if (replacements > 0) {
      console.log(`✅ ${filePath}: ${replacements} replacement(s)`);
      totalReplacements += replacements;
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Complete! Total replacements: ${totalReplacements}`);
console.log('\n📝 Next steps:');
console.log('1. Verify .env.production has: VITE_API_URL=https://homigo4-0-14.onrender.com');
console.log('2. Rebuild your app: npm run build');
console.log('3. Deploy to Vercel');
console.log('4. Test on mobile - network errors should be gone! 🚀');
