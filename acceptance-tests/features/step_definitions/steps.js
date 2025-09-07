const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

setDefaultTimeout(60 * 1000);

const BASE_URL = 'http://localhost:8080/ai-coding-as-a-blackbox/';

let browser;
let page;
let response;

Before(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
});

After(async () => {
  await browser.close();
});

When('I go to {string}', async (url) => {
  response = await page.goto(url);
});

When('I go to the home page', async () => {
  response = await page.goto(BASE_URL);
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

  const numDiffPixels = pixelmatch(baseline.data, current.data, diff.data, width, height, { threshold: 0.1 });

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
