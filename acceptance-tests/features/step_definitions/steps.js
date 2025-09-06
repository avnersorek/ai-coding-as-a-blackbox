const { When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

setDefaultTimeout(60 * 1000);

let browser;
let page;
let response;

Before(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  await page.setViewport({ width: 4370, height: 2406 });
});

After(async () => {
  await browser.close();
});

When('I go to {string}', async (url) => {
  response = await page.goto(url);
});

Then('I should get a {int} status code', async (statusCode) => {
  expect(response.status()).to.equal(statusCode);
});

Then('the page should match the snapshot {string}', async function (snapshotName) {
  const pixelmatch = (await import('pixelmatch')).default;
  const snapshotsDir = './__image_snapshots__';
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir);
  }

  const snapshotPath = path.join(snapshotsDir, `${snapshotName}.png`);
  const image = await page.screenshot();

  if (!fs.existsSync(snapshotPath)) {
    fs.writeFileSync(snapshotPath, image);
    console.log(`New snapshot created at ${snapshotPath}`);
    return;
  }

  const baseline = PNG.sync.read(fs.readFileSync(snapshotPath));
  const current = PNG.sync.read(image);
  const { width, height } = baseline;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(baseline.data, current.data, diff.data, width, height, { threshold: 0.2 });

  // Allow minimal pixel differences (up to 0.01% of total pixels) to handle CI environment rendering variations
  const totalPixels = width * height;
  const maxAllowedDiffPixels = Math.ceil(totalPixels * 0.0001); // 0.01% tolerance

  if (numDiffPixels > maxAllowedDiffPixels) {
    const diffPath = path.join(snapshotsDir, `${snapshotName}-diff.png`);
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    throw new Error(`Snapshots do not match. ${numDiffPixels} pixels differ (max allowed: ${maxAllowedDiffPixels}). See diff at ${diffPath}`);
  }

  expect(numDiffPixels).to.be.at.most(maxAllowedDiffPixels);
});

Then('the page should use the {string} font from Google Fonts CDN', async (fontName) => {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;
  const linkExists = await page.evaluate((url) => {
    return !!document.querySelector(`link[href="${url}"]`);
  }, fontUrl);

  expect(linkExists).to.be.true;
});

Then('the {string} and {string} should have the same width', async (selector1, selector2) => {
  const width1 = await page.evaluate((sel) => {
    return document.querySelector(sel).offsetWidth;
  }, selector1);

  const width2 = await page.evaluate((sel) => {
    return document.querySelector(sel).offsetWidth;
  }, selector2);

  expect(width1).to.equal(width2);
});

Then('the page title should equal {string}', async (expectedTitle) => {
  const actualTitle = await page.title();
  expect(actualTitle).to.equal(expectedTitle);
});

// Login flow step definitions

Then('I should see the email input field', async () => {
  const emailField = await page.$('#email');
  expect(emailField).to.not.be.null;
});

Then('I should see the password input field', async () => {
  const passwordField = await page.$('#password');
  expect(passwordField).to.not.be.null;
});

Then('I should see the continue button', async () => {
  const continueButton = await page.$('button[type="submit"]');
  expect(continueButton).to.not.be.null;
});

When('I enter {string} in the email field', async (email) => {
  await page.type('#email', email);
});

When('I enter {string} in the password field', async (password) => {
  await page.type('#password', password);
});

When('I click the continue button', async () => {
  await page.click('button[type="submit"]');
  // Wait for either navigation or error message to appear
  try {
    await page.waitForFunction(
      () => window.location.href.includes('/welcome') || document.querySelector('.error-message, .email-error, .password-error, .credentials-error'),
      { timeout: 5000 }
    );
  } catch (error) {
    // Continue if timeout - some tests expect immediate form validation
  }
});

When('I click the continue button without filling any fields', async () => {
  await page.click('button[type="submit"]');
  // Wait for validation error messages to appear
  try {
    await page.waitForSelector('.error-message, .validation-error, .email-error, .password-error', { timeout: 3000 });
  } catch (error) {
    // Continue if no errors appear - some forms handle validation differently
  }
});

Then('I should be redirected to the welcome page', async () => {
  await page.waitForSelector('.welcome-message', { timeout: 8000 });
  const url = page.url();
  expect(url).to.include('/welcome');
});

Then('I should see the welcome message', async () => {
  const welcomeMessage = await page.$('.welcome-message');
  expect(welcomeMessage).to.not.be.null;
  
  const messageText = await page.evaluate(element => element.textContent, welcomeMessage);
  expect(messageText.toLowerCase()).to.include('welcome');
});

Then('I should see an error message about invalid email format', async () => {
  // Wait for error message to appear
  await page.waitForSelector('.error-message, .email-error', { timeout: 5000 });
  
  const errorMessage = await page.$('.error-message, .email-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/invalid.*email|email.*format/);
});

Then('I should see an error message about invalid credentials', async () => {
  // Wait for error message to appear
  await page.waitForSelector('.error-message, .credentials-error', { timeout: 5000 });
  
  const errorMessage = await page.$('.error-message, .credentials-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/invalid.*credentials|incorrect.*username.*password/);
});

Then('I should see validation error messages', async () => {
  const errorMessages = await page.$$('.error-message, .validation-error');
  expect(errorMessages.length).to.be.greaterThan(0);
});

Then('I should see an error message about required email', async () => {
  // Wait for error message to appear
  await page.waitForSelector('.error-message, .email-error', { timeout: 5000 });
  
  const errorMessage = await page.$('.error-message, .email-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/email.*required|required.*email/);
});

Then('I should see an error message about required password', async () => {
  // Wait for error message to appear
  await page.waitForSelector('.error-message, .password-error', { timeout: 5000 });
  
  const errorMessage = await page.$('.error-message, .password-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/password.*required|required.*password/);
});

// Navigation step definitions

Then('I should see the navigation menu', async () => {
  const navMenu = await page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.not.be.null;
});

Then('I should not see the navigation menu', async () => {
  const navMenu = await page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.be.null;
});

Then('the navigation menu should contain the {string} link', async (linkText) => {
  const navLink = await page.$x(`//nav//a[contains(text(), "${linkText}")]`);
  expect(navLink.length).to.be.greaterThan(0);
});

Then('the navigation menu should be responsive', async () => {
  // Test mobile breakpoint
  await page.setViewport({ width: 375, height: 667 });
  const navMenu = await page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.not.be.null;
  
  // Check if mobile navigation elements are present (hamburger menu, etc.)
  const mobileNavElements = await page.$$('.hamburger, .mobile-menu, .menu-toggle');
  const isResponsive = mobileNavElements.length > 0 || await page.evaluate(() => {
    const nav = document.querySelector('nav, .navigation, .nav-menu');
    return nav && window.getComputedStyle(nav).display !== 'none';
  });
  
  expect(isResponsive).to.be.true;
  
  // Restore viewport
  await page.setViewport({ width: 4370, height: 2406 });
});

Then('the navigation menu should be accessible', async () => {
  const navMenu = await page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.not.be.null;
  
  // Check for accessibility attributes
  const hasAriaLabel = await page.evaluate(() => {
    const nav = document.querySelector('nav, .navigation, .nav-menu');
    return nav && (nav.getAttribute('aria-label') || nav.getAttribute('role'));
  });
  
  expect(hasAriaLabel).to.not.be.null;
});

When('I click on the {string} navigation link', async (linkText) => {
  const navLink = await page.$x(`//nav//a[contains(text(), "${linkText}")]`);
  expect(navLink.length).to.be.greaterThan(0);
  
  await navLink[0].click();
  
  // Wait for navigation to complete
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

Then('I should be on the products page', async () => {
  await page.waitForFunction(
    () => window.location.href.includes('/products'),
    { timeout: 5000 }
  );
  
  const url = page.url();
  expect(url).to.include('/products');
});

Then('I should be on the welcome page', async () => {
  await page.waitForFunction(
    () => window.location.href.includes('/welcome'),
    { timeout: 5000 }
  );
  
  const url = page.url();
  expect(url).to.include('/welcome');
});

Then('the {string} navigation item should be active', async (linkText) => {
  const activeNavLink = await page.$x(`//nav//a[contains(text(), "${linkText}") and (contains(@class, "active") or contains(@class, "current") or @aria-current)]`);
  expect(activeNavLink.length).to.be.greaterThan(0);
});

Then('the page title should be {string}', async (expectedTitle) => {
  const actualTitle = await page.title();
  expect(actualTitle).to.equal(expectedTitle);
});

Then('I should still be authenticated', async () => {
  // Check for authentication indicators
  const authIndicators = await page.$$('.user-menu, .logout-button, nav, .navigation');
  expect(authIndicators.length).to.be.greaterThan(0);
});

When('I navigate back using the browser back button', async () => {
  await page.goBack();
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

When('I navigate forward using the browser forward button', async () => {
  await page.goForward();
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

Given('I am not authenticated', async () => {
  // Clear any existing authentication data
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Clear cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });
});

When('I visit the products page directly', async () => {
  await page.goto('http://localhost:8080/products');
});

Then('I should be redirected to the login page', async () => {
  await page.waitForFunction(
    () => window.location.href.includes('/login') || window.location.pathname === '/',
    { timeout: 5000 }
  );
  
  const url = page.url();
  const isOnLoginPage = url.includes('/login') || url.endsWith('/');
  expect(isOnLoginPage).to.be.true;
});

Given('I am on the products page', async () => {
  // First authenticate
  await page.goto('http://localhost:8080');
  await page.type('#email', 'user@example.com');
  await page.type('#password', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.welcome-message', { timeout: 8000 });
  
  // Then navigate to products page
  const navLink = await page.$x(`//nav//a[contains(text(), "Products")]`);
  if (navLink.length > 0) {
    await navLink[0].click();
    await page.waitForFunction(
      () => window.location.href.includes('/products'),
      { timeout: 5000 }
    );
  }
});

When('I logout from the navigation', async () => {
  const logoutButton = await page.$('.logout-button, .logout-link, [data-testid="logout"]');
  if (logoutButton) {
    await logoutButton.click();
  } else {
    // Try to find logout in user menu or navigation
    const userMenu = await page.$('.user-menu, .profile-menu');
    if (userMenu) {
      await userMenu.click();
      await page.waitForSelector('.logout-button, .logout-link', { timeout: 2000 });
      const logoutLink = await page.$('.logout-button, .logout-link');
      await logoutLink.click();
    }
  }
  
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

When('I visit an invalid route {string}', async (route) => {
  await page.goto(`http://localhost:8080${route}`);
});

Then('I should see a 404 error page', async () => {
  const errorPage = await page.$('.error-404, .not-found, [data-testid="404"]');
  if (!errorPage) {
    // Check for common 404 text content
    const pageText = await page.evaluate(() => document.body.textContent);
    const has404Content = /404|not found|page not found/i.test(pageText);
    expect(has404Content).to.be.true;
  } else {
    expect(errorPage).to.not.be.null;
  }
});

Then('I should still see the navigation menu if authenticated', async () => {
  // Check if user is authenticated by looking for auth indicators
  const authIndicators = await page.$$('.user-menu, .logout-button');
  if (authIndicators.length > 0) {
    const navMenu = await page.$('nav, .navigation, .nav-menu');
    expect(navMenu).to.not.be.null;
  }
});

When('I click on the {string} navigation link', async (linkText) => {
  const navLink = await page.$x(`//nav//a[contains(text(), "${linkText}")]`);
  expect(navLink.length).to.be.greaterThan(0);
  
  await navLink[0].click();
  
  // Wait for navigation to complete
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});
