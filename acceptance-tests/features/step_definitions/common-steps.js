const { When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { FRONTEND_BASE_URL } = require('shared-constants');

setDefaultTimeout(60 * 1000);

// Global variables shared across step definition files
global.browser = null;
global.page = null;
global.response = null;

Before(async () => {
  global.browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  global.page = await global.browser.newPage();
  await global.page.setViewport({ width: 1440, height: 900 });
  
  // Clear any existing session storage to ensure clean state
  await global.page.evaluateOnNewDocument(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
});

After(async () => {
  await global.browser.close();
});

When('I go to {string}', async (url) => {
  global.response = await global.page.goto(url);
});

When('I go to the home page', async () => {
  global.response = await global.page.goto(FRONTEND_BASE_URL);
});

Then('I should get a {int} status code', async (statusCode) => {
  expect(global.response.status()).to.equal(statusCode);
});

Then('the page should match the snapshot {string}', async function (snapshotName) {
  const pixelmatch = (await import('pixelmatch')).default;
  const snapshotsDir = './__image_snapshots__';
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir);
  }

  const snapshotPath = path.join(snapshotsDir, `${snapshotName}.png`);
  const image = await global.page.screenshot();

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
  const linkExists = await global.page.evaluate((url) => {
    return !!document.querySelector(`link[href="${url}"]`);
  }, fontUrl);

  expect(linkExists).to.be.true;
});

Then('the {string} and {string} should have the same width', async (selector1, selector2) => {
  const width1 = await global.page.evaluate((sel) => {
    return document.querySelector(sel).offsetWidth;
  }, selector1);

  const width2 = await global.page.evaluate((sel) => {
    return document.querySelector(sel).offsetWidth;
  }, selector2);

  expect(width1).to.equal(width2);
});

Then('the page title should equal {string}', async (expectedTitle) => {
  const actualTitle = await global.page.title();
  expect(actualTitle).to.equal(expectedTitle);
});

// Export globals for reference (though they're now accessible via global object)
module.exports = { 
  getBrowser: () => global.browser,
  getPage: () => global.page,
  getResponse: () => global.response
};