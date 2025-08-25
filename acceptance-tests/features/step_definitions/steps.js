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
  browser = await puppeteer.launch();
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

  if (numDiffPixels > 0) {
    const diffPath = path.join(snapshotsDir, `${snapshotName}-diff.png`);
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    throw new Error(`Snapshots do not match. See diff at ${diffPath}`);
  }

  expect(numDiffPixels).to.equal(0);
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
