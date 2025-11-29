/**
 * Verification script to check if any localhost URLs remain
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToCheck = [
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

console.log('🔍 Verifying API URLs...\n');

let foundIssues = false;

filesToCheck.forEach(filePath => {
  try {
    const fullPath = path.join(__dirname, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for hardcoded localhost URLs
    const localhostMatches = content.match(/['"]http:\/\/localhost:5000['"]/g);
    
    if (localhostMatches) {
      console.log(`❌ ${filePath}: Found ${localhostMatches.length} hardcoded localhost URL(s)`);
      foundIssues = true;
    } else {
      console.log(`✅ ${filePath}: Clean`);
    }
    
  } catch (error) {
    console.error(`⚠️  Error checking ${filePath}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));

if (foundIssues) {
  console.log('❌ ISSUES FOUND - Some files still have hardcoded localhost URLs');
  console.log('Run: node fix-localhost-urls.js');
} else {
  console.log('✅ ALL CLEAR - No hardcoded localhost URLs found!');
  console.log('\n📋 Next steps:');
  console.log('1. npm run build');
  console.log('2. Deploy to Vercel');
  console.log('3. Test on mobile 🚀');
}

console.log('='.repeat(60));
