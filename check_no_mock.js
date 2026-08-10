import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetDir = path.join(__dirname, 'dist', 'assets');
const bundlePath = path.join(assetDir, fs.readdirSync(assetDir).find((file) => file.endsWith('.js')));
const bundleCode = fs.readFileSync(bundlePath, 'utf8');

const forbiddenNames = [
  'Sarah Jenkins',
  'Marcus & Elena Vance',
  'Chloe Zhang',
  'Marcus Vance'
];

let failed = 0;
for (const name of forbiddenNames) {
  if (bundleCode.includes(name)) {
    console.error(`❌ Found legacy mock string: "${name}"`);
    failed++;
  }
}

if (failed === 0) {
  console.log('✅ VERIFIED: ZERO legacy mock names in production JS bundle!');
} else {
  process.exit(1);
}
