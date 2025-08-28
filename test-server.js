const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing frontend server...');
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:8080...');
    const response = await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle0',
      timeout: 10000
    });
    
    console.log(`Status: ${response.status()}`);
    console.log(`Title: ${await page.title()}`);
    
    // Check for form elements
    const emailField = await page.$('#email');
    const passwordField = await page.$('#password');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log(`Email field found: ${!!emailField}`);
    console.log(`Password field found: ${!!passwordField}`);
    console.log(`Submit button found: ${!!submitButton}`);
    
    // Test form validation
    console.log('\nTesting form validation...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    const errorMessages = await page.$$('.error-message');
    console.log(`Error messages found: ${errorMessages.length}`);
    
    // Test valid login
    console.log('\nTesting valid login...');
    await page.type('#email', 'user@example.com');
    await page.type('#password', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    console.log(`Final URL: ${page.url()}`);
    
    const welcomeMessage = await page.$('.welcome-message');
    console.log(`Welcome message found: ${!!welcomeMessage}`);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();