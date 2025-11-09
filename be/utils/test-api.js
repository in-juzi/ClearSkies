const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTBlODYzNzMwYTA4ZTkwNjZhOTAyN2MiLCJpYXQiOjE3NjI3MTg0MzksImV4cCI6MTc2MjcyMjAzOX0.fqT6V-h9KKjUgxKVyCjz5pdMCe5gMKQHO6ICOcf1_1A';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/inventory',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      const chamomile = response.inventory?.filter(item => item.itemId === 'chamomile').slice(0, 3);

      console.log('API Response - First 3 chamomile stacks:');
      console.log('');

      if (chamomile && chamomile.length > 0) {
        chamomile.forEach((item, i) => {
          console.log(`Stack ${i+1}:`);
          console.log('  instanceId:', item.instanceId);
          console.log('  qualities:', JSON.stringify(item.qualities));
          console.log('  traits:', JSON.stringify(item.traits));
          console.log('  qualityDetails:', Object.keys(item.qualityDetails || {}).length, 'entries');
          console.log('  traitDetails:', Object.keys(item.traitDetails || {}).length, 'entries');
          console.log('');
        });
      } else {
        console.log('No chamomile found or error:', response);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
