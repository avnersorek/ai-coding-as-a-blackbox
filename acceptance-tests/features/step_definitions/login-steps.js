const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('chai');

// Import common-steps to ensure globals are initialized
require('./common-steps');

// Login flow step definitions

Then('I should see the email input field', async () => {
  const emailField = await global.page.$('#email');
  expect(emailField).to.not.be.null;
});

Then('I should see the password input field', async () => {
  const passwordField = await global.page.$('#password');
  expect(passwordField).to.not.be.null;
});

Then('I should see the continue button', async () => {
  const continueButton = await global.page.$('button[type="submit"]');
  expect(continueButton).to.not.be.null;
});

When('I enter {string} in the email field', async (email) => {
  await global.page.type('#email', email);
});

When('I enter {string} in the password field', async (password) => {
  await global.page.type('#password', password);
});

When('I click the continue button', async () => {
  await global.page.click('button[type="submit"]');
  // Wait for either navigation or error message to appear
  try {
    await global.page.waitForFunction(
      () => window.location.href.includes('/welcome') || document.querySelector('.error-message, .email-error, .password-error, .credentials-error'),
      { timeout: 5000 }
    );
  } catch (error) {
    // Continue if timeout - some tests expect immediate form validation
  }
});

When('I click the continue button without filling any fields', async () => {
  await global.page.click('button[type="submit"]');
  // Wait for validation error messages to appear
  try {
    await global.page.waitForSelector('.error-message, .validation-error, .email-error, .password-error', { timeout: 3000 });
  } catch (error) {
    // Continue if no errors appear - some forms handle validation differently
  }
});

Then('I should be redirected to the welcome page', async () => {
  await global.page.waitForSelector('.welcome-message', { timeout: 8000 });
  const url = global.page.url();
  expect(url).to.include('/welcome');
});

Then('I should see the welcome message', async () => {
  const welcomeMessage = await global.page.$('.welcome-message');
  expect(welcomeMessage).to.not.be.null;
  
  const messageText = await global.page.evaluate(element => element.textContent, welcomeMessage);
  expect(messageText.toLowerCase()).to.include('welcome');
});

Then('I should see an error message about invalid email format', async () => {
  // Wait for error message to appear
  await global.page.waitForSelector('.error-message, .email-error', { timeout: 5000 });
  
  const errorMessage = await global.page.$('.error-message, .email-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await global.page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/invalid.*email|email.*format/);
});

Then('I should see an error message about invalid credentials', async () => {
  // Wait for error message to appear
  await global.page.waitForSelector('.error-message, .credentials-error', { timeout: 5000 });
  
  const errorMessage = await global.page.$('.error-message, .credentials-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await global.page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/invalid.*credentials|incorrect.*username.*password/);
});

Then('I should see validation error messages', async () => {
  const errorMessages = await global.page.$$('.error-message, .validation-error');
  expect(errorMessages.length).to.be.greaterThan(0);
});

Then('I should see an error message about required email', async () => {
  // Wait for error message to appear
  await global.page.waitForSelector('.error-message, .email-error', { timeout: 5000 });
  
  const errorMessage = await global.page.$('.error-message, .email-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await global.page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/email.*required|required.*email/);
});

Then('I should see an error message about required password', async () => {
  // Wait for error message to appear
  await global.page.waitForSelector('.error-message, .password-error', { timeout: 5000 });
  
  const errorMessage = await global.page.$('.error-message, .password-error');
  expect(errorMessage).to.not.be.null;
  
  const errorText = await global.page.evaluate(element => element.textContent, errorMessage);
  expect(errorText.toLowerCase()).to.match(/password.*required|required.*password/);
});

Given('I am not authenticated', async () => {
  // Clear any existing authentication data
  await global.page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Clear cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });
});