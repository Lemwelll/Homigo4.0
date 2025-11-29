/**
 * Comprehensive verification script to check ALL pages use Render API properly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All student, landlord, and admin pages
const pagesToCheck = [
  // Student pages
  'src/pages/StudentDashboard.jsx',
  'src/pages/StudentBrowse.jsx',
  'src/pages/StudentReservations.jsx',
  'src/pages/StudentBookings.jsx',
  'src/pages/StudentFavorites.jsx',
  'src/pages/StudentMessages.jsx',
  'src/pages/StudentSettings.jsx',
  'src/pages/StudentEscrow.jsx',
  'src/pages/StudentRegister.jsx',
  'src/pages/StudentLogin.jsx',
  
  // Landlord pages
  'src/pages/LandlordDashboard.jsx',
  'src/pages/LandlordProperties.jsx',
  'src/pages/LandlordReservations.jsx',
  'src/pages/LandlordBookings.jsx',
  'src/pages/LandlordMessages.jsx',
  'src/pages/LandlordSettings.jsx',
  'src/pages/LandlordEscrow.jsx',
  'src/pages/LandlordRegister.jsx',
  'src/pages/LandlordLogin.jsx',
  'src/pages/AddProperty.jsx',
  
  // Admin pages
  'src/pages/AdminDashboard.jsx',
  'src/pages/AdminVerifications.jsx',
  'src/pages/AdminLandlords.jsx',
  'src/pages/AdminReports.jsx',
  'src/pages/AdminAnalytics.jsx',
  'src/pages/AdminSettings.jsx',
  'src/pages/AdminPage.jsx',
  
  // Shared pages
  'src/pages/PropertyDetails.jsx',
  'src/pages/SecurePayment.jsx',
  'src/pages/Notifications.jsx',
  'src/pages/UpgradePremium.jsx',
  'src/pages/PaymentHistory.jsx',
  'src/pages/PaymentMethods.jsx',
  'src/pages/LandmarksMap.jsx',
  'src/pages/PublicListings.jsx'
];

console.log('🔍 Checking ALL pages for proper API configuration...\n');

let totalPages = 0;
let pagesWithFetch = 0;
let pagesWithImport = 0;
let pagesWithIssues = 0;
let issuesList = [];

pagesToCheck.forEach(filePath => {
  try {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  ${filePath} - File not found`);
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    totalPages++;
    
    // Check if page uses fetch()
    const hasFetch = content.includes('fetch(');
    
    // Check if page imports API_URL from config
    const hasProperImport = content.match(/import\s+API_URL\s+from\s+['"]\.\.\/config\/api['"]/);
    
    // Check for hardcoded localhost
    const hasLocalhost = content.match(/['"`]http:\/\/localhost:5000/);
    
    // Check for inline API_URL declaration
    const hasInlineDeclaration = content.match(/const\s+API_URL\s*=\s*import\.meta\.env/);
    
    if (hasFetch) {
      pagesWithFetch++;
      
      if (!hasProperImport) {
        console.log(`❌ ${filePath} - Uses fetch() but missing API_URL import`);
        pagesWithIssues++;
        issuesList.push({
          file: filePath,
          issue: 'Missing API_URL import',
          fix: 'Add: import API_URL from \'../config/api\''
        });
      } else if (hasLocalhost) {
        console.log(`⚠️  ${filePath} - Has hardcoded localhost URL`);
        pagesWithIssues++;
        issuesList.push({
          file: filePath,
          issue: 'Hardcoded localhost URL',
          fix: 'Replace with API_URL variable'
        });
      } else if (hasInlineDeclaration) {
        console.log(`⚠️  ${filePath} - Has inline API_URL declaration`);
        pagesWithIssues++;
        issuesList.push({
          file: filePath,
          issue: 'Inline API_URL declaration',
          fix: 'Remove inline declaration, use import instead'
        });
      } else {
        console.log(`✅ ${filePath} - Properly configured`);
        pagesWithImport++;
      }
    } else {
      console.log(`⚪ ${filePath} - No API calls`);
    }
    
  } catch (error) {
    console.error(`❌ Error checking ${filePath}:`, error.message);
  }
});

console.log('\n' + '='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));
console.log(`Total pages checked: ${totalPages}`);
console.log(`Pages with API calls: ${pagesWithFetch}`);
console.log(`Pages properly configured: ${pagesWithImport}`);
console.log(`Pages with issues: ${pagesWithIssues}`);

if (pagesWithIssues > 0) {
  console.log('\n' + '='.repeat(70));
  console.log('🔧 ISSUES FOUND');
  console.log('='.repeat(70));
  issuesList.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.file}`);
    console.log(`   Issue: ${item.issue}`);
    console.log(`   Fix: ${item.fix}`);
  });
  console.log('\n❌ FAILED - Some pages need fixes');
} else {
  console.log('\n✅ SUCCESS - All pages properly configured!');
  console.log('\n📋 Next steps:');
  console.log('1. npm run build');
  console.log('2. git push');
  console.log('3. Test on mobile');
}

console.log('='.repeat(70));
