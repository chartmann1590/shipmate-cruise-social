import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Performing static code & bundle validation...');

const htmlPath = path.join(__dirname, 'dist', 'index.html');
const assetDir = path.join(__dirname, 'dist', 'assets');
const assets = fs.readdirSync(assetDir);
const cssPath = path.join(assetDir, assets.find((file) => file.endsWith('.css')));
const jsPath = path.join(assetDir, assets.find((file) => file.endsWith('.js')));

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

console.log(`📄 index.html size: ${htmlContent.length} bytes`);
console.log(`🎨 index.css size: ${cssContent.length} bytes`);
console.log(`⚡ index.js size: ${jsContent.length} bytes`);

// Verify critical DOM elements in HTML
if (htmlContent.includes('<div id="root"></div>') && htmlContent.includes('manifest.json')) {
  console.log('✅ HTML structure & PWA manifest link verified.');
} else {
  console.error('❌ HTML structure error');
  process.exit(1);
}

// Verify bundle contains key application strings
const requiredSymbols = [
  'ShipMate',
  'Wonder of the Seas',
  'Crown & Anchor',
  'Princess Cruises',
  'Drink Package Tracker'
];

let missing = 0;
for (const symbol of requiredSymbols) {
  if (jsContent.includes(symbol)) {
    console.log(`✅ Symbol verified in production JS bundle: "${symbol}"`);
  } else {
    console.error(`❌ Missing symbol in bundle: "${symbol}"`);
    missing++;
  }
}

if (missing === 0) {
  console.log('\n🎉 ALL BUNDLE VALIDATION CHECKS PASSED SUCCESSFULLY!');
} else {
  process.exit(1);
}
