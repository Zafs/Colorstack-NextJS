#!/usr/bin/env node

const https = require('https');

const INDEXNOW_CONFIG = {
  host: 'colorstack.app',
  key: 'c27d93af16a5408390e2286537ebaede',
  urlList: [
    'https://colorstack.app/',
    'https://colorstack.app/privacy.html',
    'https://colorstack.app/terms.html'
  ]
};

function submitToIndexNow() {
  const postData = JSON.stringify(INDEXNOW_CONFIG);
  
  const options = {
    hostname: 'www.bing.com',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    res.on('data', (chunk) => {
      console.log(`Response: ${chunk}`);
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ IndexNow submission successful!');
        console.log(`Submitted ${INDEXNOW_CONFIG.urlList.length} URLs for indexing.`);
      } else {
        console.log('❌ IndexNow submission failed.');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// Run if called directly
if (require.main === module) {
  console.log('🚀 Submitting URLs to Bing IndexNow...');
  console.log(`Host: ${INDEXNOW_CONFIG.host}`);
  console.log(`Key: ${INDEXNOW_CONFIG.key}`);
  console.log(`URLs: ${INDEXNOW_CONFIG.urlList.join(', ')}`);
  console.log('');
  
  submitToIndexNow();
}

module.exports = { submitToIndexNow, INDEXNOW_CONFIG };
