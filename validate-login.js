// Simple validation script to check if frontend is working
const http = require('http');

console.log('Testing frontend server connectivity...');

const req = http.request({
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET',
  timeout: 5000
}, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse received - server is running!');
    console.log(`Content length: ${data.length}`);
    
    // Check for key elements
    const hasTitle = data.includes('<title>AI Coding - Login</title>');
    const hasEmailField = data.includes('id="email"') || data.includes("id='email'");
    const hasPasswordField = data.includes('id="password"') || data.includes("id='password'");
    const hasInterFont = data.includes('fonts.googleapis.com/css2?family=Inter');
    
    console.log(`\nContent checks:`);
    console.log(`- Has correct title: ${hasTitle}`);
    console.log(`- Has Inter font link: ${hasInterFont}`);
    console.log(`- Contains React app div: ${data.includes('<div id="root"></div>')}`);
    
    if (res.statusCode === 200 && hasTitle && hasInterFont) {
      console.log('\n✅ Basic validation passed!');
    } else {
      console.log('\n❌ Some issues detected');
    }
  });
});

req.on('error', (e) => {
  console.error(`Request failed: ${e.message}`);
});

req.on('timeout', () => {
  console.error('Request timed out');
  req.destroy();
});

req.end();