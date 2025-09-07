const { execSync } = require('child_process');

try {
  console.log('Running acceptance tests...');
  const result = execSync('cd acceptance-tests && npm test', { 
    stdio: 'inherit',
    encoding: 'utf8' 
  });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}