const axios = require('axios');

const testBackendConnection = async () => {
  const baseUrl = 'http://217.196.51.104:4000/api';
  const endpoints = [
    '/health',
    '/products',
    '/auth/signin',
    '/cart',
    '/orders'
  ];

  console.log('🔍 Testing Backend Connections...\n');
  console.log(`Base URL: ${baseUrl}\n`);

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await axios.get(`${baseUrl}${endpoint}`, { 
        timeout: 5000,
        // For auth endpoints, we expect 401/400 which is normal
        validateStatus: function (status) {
          return status < 500; // Accept all status codes less than 500
        }
      });
      
      if (response.status === 200) {
        console.log(`✅ SUCCESS: ${endpoint}`);
        console.log(`   Status: ${response.status}`);
        if (response.data && typeof response.data === 'object') {
          console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
        } else {
          console.log(`   Response: ${response.data}`);
        }
      } else {
        console.log(`⚠️  PARTIAL: ${endpoint} (Status: ${response.status})`);
        console.log(`   Expected behavior for ${endpoint}`);
      }
      console.log('');
    } catch (error) {
      console.log(`❌ FAILED: ${endpoint}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
};

testBackendConnection(); 