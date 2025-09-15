const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { FRONTEND_BASE_URL, FRONTEND_BASE_ROUTE } = require('shared-constants');

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
  const navLink = await global.page.$$(`nav a`);
  const linkTexts = await Promise.all(navLink.map(link => global.page.evaluate(el => el.textContent, link)));
  const hasLink = linkTexts.some(text => text.includes(linkText));
  expect(hasLink).to.be.true;
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
  const navLinks = await global.page.$$('nav a');
  let targetLink = null;
  
  for (const link of navLinks) {
    const text = await global.page.evaluate(el => el.textContent, link);
    if (text.includes(linkText)) {
      targetLink = link;
      break;
    }
  }
  
  expect(targetLink).to.not.be.null;
  await targetLink.click();
  
  // Wait for navigation to complete
  await global.page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 5000 }
  );
});

Then('I should be on the products page', async () => {
  await global.page.waitForFunction(
    () => window.location.href.includes('/products') || window.location.pathname.endsWith('/products'),
    { timeout: 5000 }
  );
  
  const url = global.page.url();
  expect(url).to.include('/products');
});

Then('I should be on the welcome page', async () => {
  await global.page.waitForFunction(
    () => window.location.href.includes('/welcome') || window.location.pathname.endsWith('/welcome'),
    { timeout: 5000 }
  );
  
  const url = global.page.url();
  expect(url).to.include('/welcome');
});

Then('the {string} navigation item should be active', async (linkText) => {
  const navLinks = await global.page.$$('nav a');
  let foundActiveLink = false;
  
  for (const link of navLinks) {
    const text = await global.page.evaluate(el => el.textContent, link);
    if (text.includes(linkText)) {
      const className = await global.page.evaluate(el => el.className, link);
      const ariaCurrent = await global.page.evaluate(el => el.getAttribute('aria-current'), link);
      
      if (className.includes('active') || className.includes('current') || ariaCurrent) {
        foundActiveLink = true;
        break;
      }
    }
  }
  
  expect(foundActiveLink).to.be.true;
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
  await global.page.goto(FRONTEND_BASE_URL + 'products');
});

Then('I should be redirected to the login page', async () => {
  await global.page.waitForFunction(
    () => window.location.href.includes('/login') || window.location.pathname === '/' || window.location.pathname === FRONTEND_BASE_ROUTE || window.location.pathname === FRONTEND_BASE_ROUTE.replace(/\/$/, ''),
    { timeout: 5000 }
  );
  
  const url = global.page.url();
  const isOnLoginPage = url.includes('/login') || url.endsWith(FRONTEND_BASE_ROUTE) || url.endsWith(FRONTEND_BASE_ROUTE.replace(/\/$/, '')) || url.endsWith('/');
  expect(isOnLoginPage).to.be.true;
});

Given('I am on the products page', async () => {
  // First authenticate
  await global.page.goto(FRONTEND_BASE_URL);
  // Clear any existing form values and type fresh values
  await global.page.evaluate(() => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
  });
  await global.page.type('#email', 'user@example.com');
  await global.page.type('#password', 'password123');
  await global.page.click('button[type="submit"]');
  await global.page.waitForSelector('.welcome-message', { timeout: 8000 });
  
  // Then navigate to products page
  const navLinks = await global.page.$$('nav a');
  let productsLink = null;
  
  for (const link of navLinks) {
    const text = await global.page.evaluate(el => el.textContent, link);
    if (text.includes('Products')) {
      productsLink = link;
      break;
    }
  }
  
  if (productsLink) {
    await productsLink.click();
    // Wait for navigation to complete
    await global.page.waitForFunction(
      () => document.readyState === 'complete',
      { timeout: 3000 }
    );
    await global.page.waitForFunction(
      () => window.location.href.includes('/products') || window.location.pathname.endsWith('/products'),
      { timeout: 5000 }
    );
  } else {
    throw new Error('Products navigation link not found');
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
  // Navigate using history.pushState to preserve session state
  await global.page.evaluate((route) => {
    window.history.pushState({}, '', route);
    // Trigger React Router to handle the route change
    const event = new PopStateEvent('popstate', { state: {} });
    window.dispatchEvent(event);
  }, route);
  
  // Wait for navigation to complete
  await global.page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 3000 }
  );
});

Then('I should see a 404 error page', async () => {
  // Wait a moment for the page to render
  await global.page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout: 3000 }
  );
  
  const errorPage = await global.page.$('.error-404, .not-found, [data-testid="404"]');
  if (!errorPage) {
    // Check for common 404 text content
    const pageText = await global.page.evaluate(() => document.body.textContent);
    const has404Content = /404|not found|page not found/i.test(pageText);
    
    // Debug: log what content we actually found
    if (!has404Content) {
      console.log('404 page content not found. Page content:', pageText);
      console.log('Current URL:', await global.page.url());
    }
    
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