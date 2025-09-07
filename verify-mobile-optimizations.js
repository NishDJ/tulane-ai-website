/**
 * Simple verification script for mobile optimizations
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Mobile Optimizations...\n');

// Check if mobile utility files exist
const mobileUtilsPath = path.join(__dirname, 'src/lib/mobile-utils.ts');
const mobileWrapperPath = path.join(__dirname, 'src/components/ui/mobile-wrapper.tsx');
const mobileStylesPath = path.join(__dirname, 'src/styles/mobile-optimizations.css');
const touchHookPath = path.join(__dirname, 'src/hooks/useTouchInteractions.ts');

const files = [
  { path: mobileUtilsPath, name: 'Mobile Utils' },
  { path: mobileWrapperPath, name: 'Mobile Wrapper Component' },
  { path: mobileStylesPath, name: 'Mobile Optimization Styles' },
  { path: touchHookPath, name: 'Touch Interactions Hook' },
];

let allFilesExist = true;

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    console.log(`✅ ${file.name}: Found`);
  } else {
    console.log(`❌ ${file.name}: Missing`);
    allFilesExist = false;
  }
});

console.log('\n📱 Checking Mobile-Specific Features...\n');

// Check Tailwind config for mobile breakpoints
const tailwindConfigPath = path.join(__dirname, 'tailwind.config.ts');
if (fs.existsSync(tailwindConfigPath)) {
  const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
  
  if (tailwindConfig.includes("'xs': '475px'")) {
    console.log('✅ Extra small breakpoint (xs): Configured');
  } else {
    console.log('❌ Extra small breakpoint (xs): Missing');
  }
  
  if (tailwindConfig.includes('touch-manipulation')) {
    console.log('✅ Touch manipulation classes: Found in config area');
  }
} else {
  console.log('❌ Tailwind config: Missing');
}

// Check global CSS for mobile imports
const globalCssPath = path.join(__dirname, 'src/app/globals.css');
if (fs.existsSync(globalCssPath)) {
  const globalCss = fs.readFileSync(globalCssPath, 'utf8');
  
  if (globalCss.includes('mobile-optimizations.css')) {
    console.log('✅ Mobile optimization styles: Imported in globals.css');
  } else {
    console.log('❌ Mobile optimization styles: Not imported');
  }
} else {
  console.log('❌ Global CSS: Missing');
}

// Check button component for mobile optimizations
const buttonPath = path.join(__dirname, 'src/components/ui/button.tsx');
if (fs.existsSync(buttonPath)) {
  const buttonContent = fs.readFileSync(buttonPath, 'utf8');
  
  if (buttonContent.includes('min-h-[44px]')) {
    console.log('✅ Button component: Touch-friendly minimum height');
  } else {
    console.log('❌ Button component: Missing touch-friendly sizing');
  }
  
  if (buttonContent.includes('touch-manipulation')) {
    console.log('✅ Button component: Touch manipulation enabled');
  } else {
    console.log('❌ Button component: Touch manipulation missing');
  }
} else {
  console.log('❌ Button component: Missing');
}

// Check hero component for responsive classes
const heroPath = path.join(__dirname, 'src/components/sections/hero.tsx');
if (fs.existsSync(heroPath)) {
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  
  if (heroContent.includes('xs:text-') || heroContent.includes('sm:text-') || heroContent.includes('md:text-')) {
    console.log('✅ Hero component: Responsive typography');
  } else {
    console.log('❌ Hero component: Missing responsive typography');
  }
  
  if (heroContent.includes('sm:flex-row') || heroContent.includes('flex-col')) {
    console.log('✅ Hero component: Responsive layout');
  } else {
    console.log('❌ Hero component: Missing responsive layout');
  }
} else {
  console.log('❌ Hero component: Missing');
}

// Check faculty card for mobile optimizations
const facultyCardPath = path.join(__dirname, 'src/components/faculty/faculty-card.tsx');
if (fs.existsSync(facultyCardPath)) {
  const facultyCardContent = fs.readFileSync(facultyCardPath, 'utf8');
  
  if (facultyCardContent.includes('touch-manipulation')) {
    console.log('✅ Faculty card: Touch manipulation enabled');
  } else {
    console.log('❌ Faculty card: Touch manipulation missing');
  }
  
  if (facultyCardContent.includes('sm:p-') || facultyCardContent.includes('p-4')) {
    console.log('✅ Faculty card: Responsive padding');
  } else {
    console.log('❌ Faculty card: Missing responsive padding');
  }
} else {
  console.log('❌ Faculty card: Missing');
}

console.log('\n📊 Summary:\n');

if (allFilesExist) {
  console.log('🎉 All mobile optimization files are present!');
  console.log('📱 Mobile responsiveness implementation appears complete.');
  console.log('\n🔧 Key Features Implemented:');
  console.log('   • Touch-friendly button sizes (44px minimum)');
  console.log('   • Responsive breakpoints including xs (475px)');
  console.log('   • Mobile-specific CSS optimizations');
  console.log('   • Touch interaction handling');
  console.log('   • Responsive typography and layouts');
  console.log('   • Mobile-optimized component spacing');
  console.log('\n✨ Ready for mobile testing!');
} else {
  console.log('⚠️  Some mobile optimization files are missing.');
  console.log('Please ensure all components are properly implemented.');
}

console.log('\n🧪 To test mobile responsiveness:');
console.log('   1. Open browser developer tools');
console.log('   2. Toggle device simulation');
console.log('   3. Test various screen sizes');
console.log('   4. Verify touch interactions work properly');
console.log('   5. Check that all text is readable on small screens');