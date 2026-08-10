import http from 'node:http';
import fs from 'node:fs';

const checkUrl = (urlPath) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ [200 OK] ${urlPath} (${data.length} bytes, Content-Type: ${res.headers['content-type']})`);
          resolve({ status: 200, length: data.length });
        } else {
          console.error(`❌ [${res.statusCode}] ${urlPath}`);
          reject(new Error(`Status ${res.statusCode} for ${urlPath}`));
        }
      });
    }).on('error', (err) => {
      console.error(`💥 Network Error connecting to ${urlPath}:`, err.message);
      reject(err);
    });
  });
};

(async () => {
  console.log('🔍 Testing ShipMate HTTP Server endpoints & static assets...\n');
  try {
    await checkUrl('/');
    await checkUrl('/manifest.json');
    await checkUrl('/sw.js');
    await checkUrl('/favicon.svg');
   const assets = fs.readdirSync(new URL('./dist/assets', import.meta.url));
   await checkUrl(`/assets/${assets.find((file) => file.endsWith('.css'))}`);
   await checkUrl(`/assets/${assets.find((file) => file.endsWith('.js'))}`);
    console.log('\n🎉 ALL HTTP ENDPOINTS & BUNDLED ASSETS LOADED WITH HTTP 200 OK!');
  } catch (err) {
    console.error('\n❌ HTTP Verification failed:', err.message);
    process.exit(1);
  }
})();
