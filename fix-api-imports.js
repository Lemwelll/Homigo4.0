/**
 * Fix API imports - Remove duplicate/incorrect API_URL declarations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  'src/pages/StudentSettings.jsx',
  'src/pages/PublicListings.jsx',
  'src/pages/PaymentMethods.jsx',
  'src/pages/PaymentHistory.jsx',
  'src/pages/LandmarksMap.jsx',
  'src/pages/LandlordSettings.jsx',
  'src/pages/AdminLandlords.jsx',
  'src/context/StudentContext.jsx',
  'src/context/PropertyContext.jsx',
  'src/context/NotificationContext.jsx',
  'src/context/MessageContext.jsx',
  'src/context/AdminContext.jsx',
  'src/context/AccountTierContext.jsx',
  'src/components/PropertyReviews.jsx'
];

console.log('🔧 Fixing API imports...\n');

filesToFix.forEach(filePath => {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove lines like: const API_URL = API_URL
    content = content.replace(/^const API_URL = API_URL\s*$/gm, '');
    
    // Remove lines like: const API_URL = 'http://localhost:5000'
    content = content.replace(/^const API_URL = ['"]http:\/\/localhost:5000['"]\s*$/gm, '');
    
    // Check if file already has the import
    const hasImport = content.includes("from '../config/api'") || 
                     content.includes("from '../../config/api'");
    
    if (!hasImport) {
      // Determine correct import path
      const isInPages = filePath.includes('/pages/');
      const isInContext = filePath.includes('/context/');
      const isInComponents = filePath.includes('/components/');
      
      let importPath = '../config/api';
      
      // Add import after the last import statement
      const lastImportMatch = content.match(/import .+ from .+\n/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertPosition = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertPosition) + 
                 `import API_URL from '${importPath}'\n` +
                 content.slice(insertPosition);
      }
    }
    
    // Clean up multiple blank lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log('\n🎉 API imports fixed!');
console.log('\nRun verification: node verify-api-urls.js');
