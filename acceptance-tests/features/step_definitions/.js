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
