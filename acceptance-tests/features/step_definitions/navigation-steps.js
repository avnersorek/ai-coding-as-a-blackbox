const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('chai');

// Import common-steps to ensure globals are initialized
require('./common-steps');

// Navigation step definitions

Then('I should see the navigation menu', async () => {
  const navMenu = await global.page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.not.be.null;
});

Then('I should not see the navigation menu', async () => {
  const navMenu = await global.page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.be.null;
});

Then('the navigation menu should contain the {string} link', async (linkText) => {
  const navLink = await global.page.$x(`//nav//a[contains(text(), "${linkText}")]`);
  expect(navLink.length).to.be.greaterThan(0);
});

Then('the navigation menu should be responsive', async () => {
  // Test mobile breakpoint
  await global.page.setViewport({ width: 375, height: 667 });
  const navMenu = await global.page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.not.be.null;
  
  // Check if mobile navigation elements are present (hamburger menu, etc.)
  const mobileNavElements = await global.page.$$('.hamburger, .mobile-menu, .menu-toggle');
  const isResponsive = mobileNavElements.length > 0 || await global.page.evaluate(() => {
    const nav = document.querySelector('nav, .navigation, .nav-menu');
    return nav && window.getComputedStyle(nav).display !== 'none';
  });
  
  expect(isResponsive).to.be.true;
  
  // Restore viewport
  await global.page.setViewport({ width: 1440, height: 900 });
});

Then('the navigation menu should be accessible', async () => {
  const navMenu = await global.page.$('nav, .navigation, .nav-menu');
  expect(navMenu).to.not.be.null;
  
  // Check for accessibility attributes
  const hasAriaLabel = await global.page.evaluate(() => {
    const nav = document.querySelector('nav, .navigation, .nav-menu');
    return nav && (nav.getAttribute('aria-label') || nav.getAttribute('role'));
  });
  
  expect(hasAriaLabel).to.not.be.null;
});

When('I click on the {string} navigation link', async (linkText) => {
  const navLink = await global.page.$x(`//nav//a[contains(text(), "${linkText}")]`);
  expect(navLink.length).to.be.greaterThan(0);
  
  await navLink[0].click();
  
  // Wait for navigation to complete
  await global.page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

Then('I should be on the products page', async () => {
  await global.page.waitForFunction(
    () => window.location.href.includes('/products'),
    { timeout: 5000 }
  );
  
  const url = global.page.url();
  expect(url).to.include('/products');
});

Then('I should be on the welcome page', async () => {
  await global.page.waitForFunction(
    () => window.location.href.includes('/welcome'),
    { timeout: 5000 }
  );
  
  const url = global.page.url();
  expect(url).to.include('/welcome');
});

Then('the {string} navigation item should be active', async (linkText) => {
  const activeNavLink = await global.page.$x(`//nav//a[contains(text(), "${linkText}") and (contains(@class, "active") or contains(@class, "current") or @aria-current)]`);
  expect(activeNavLink.length).to.be.greaterThan(0);
});

Then('the page title should be {string}', async (expectedTitle) => {
  const actualTitle = await global.page.title();
  expect(actualTitle).to.equal(expectedTitle);
});

Then('I should still be authenticated', async () => {
  // Check for authentication indicators
  const authIndicators = await global.page.$$('.user-menu, .logout-button, nav, .navigation');
  expect(authIndicators.length).to.be.greaterThan(0);
});

When('I navigate back using the browser back button', async () => {
  await global.page.goBack();
  await global.page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

When('I navigate forward using the browser forward button', async () => {
  await global.page.goForward();
  await global.page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

When('I visit the products page directly', async () => {
  await global.page.goto('http://localhost:8080/products');
});

Then('I should be redirected to the login page', async () => {
  await global.page.waitForFunction(
    () => window.location.href.includes('/login') || window.location.pathname === '/',
    { timeout: 5000 }
  );
  
  const url = global.page.url();
  const isOnLoginPage = url.includes('/login') || url.endsWith('/');
  expect(isOnLoginPage).to.be.true;
});

Given('I am on the products page', async () => {
  // First authenticate
  await global.page.goto('http://localhost:8080');
  await global.page.type('#email', 'user@example.com');
  await global.page.type('#password', 'password123');
  await global.page.click('button[type="submit"]');
  await global.page.waitForSelector('.welcome-message', { timeout: 8000 });
  
  // Then navigate to products page
  const navLink = await global.page.$x(`//nav//a[contains(text(), "Products")]`);
  if (navLink.length > 0) {
    await navLink[0].click();
    await global.page.waitForFunction(
      () => window.location.href.includes('/products'),
      { timeout: 5000 }
    );
  }
});

When('I logout from the navigation', async () => {
  const logoutButton = await global.page.$('.logout-button, .logout-link, [data-testid="logout"]');
  if (logoutButton) {
    await logoutButton.click();
  } else {
    // Try to find logout in user menu or navigation
    const userMenu = await global.page.$('.user-menu, .profile-menu');
    if (userMenu) {
      await userMenu.click();
      await global.page.waitForSelector('.logout-button, .logout-link', { timeout: 2000 });
      const logoutLink = await global.page.$('.logout-button, .logout-link');
      await logoutLink.click();
    }
  }
  
  await global.page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

When('I visit an invalid route {string}', async (route) => {
  await global.page.goto(`http://localhost:8080${route}`);
});

Then('I should see a 404 error page', async () => {
  const errorPage = await global.page.$('.error-404, .not-found, [data-testid="404"]');
  if (!errorPage) {
    // Check for common 404 text content
    const pageText = await global.page.evaluate(() => document.body.textContent);
    const has404Content = /404|not found|page not found/i.test(pageText);
    expect(has404Content).to.be.true;
  } else {
    expect(errorPage).to.not.be.null;
  }
});

Then('I should still see the navigation menu if authenticated', async () => {
  // Check if user is authenticated by looking for auth indicators
  const authIndicators = await global.page.$$('.user-menu, .logout-button');
  if (authIndicators.length > 0) {
    const navMenu = await global.page.$('nav, .navigation, .nav-menu');
    expect(navMenu).to.not.be.null;
  }
});