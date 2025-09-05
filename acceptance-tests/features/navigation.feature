Feature: Navigation

  Background:
    Given I go to "http://localhost:8080"
    And I enter "user@example.com" in the email field
    And I enter "password123" in the password field
    And I click the continue button
    And I should be redirected to the welcome page

  Scenario: Navigation menu is present on authenticated pages
    Then I should see the navigation menu
    And the navigation menu should contain the "Products" link

  Scenario: Navigation menu is responsive and accessible
    Then the navigation menu should be responsive
    And the navigation menu should be accessible

  Scenario: Active page is highlighted in navigation
    When I click on the "Products" navigation link
    Then I should be on the products page
    And the "Products" navigation item should be active

  Scenario: Clicking Products link navigates to products page
    When I click on the "Products" navigation link
    Then I should be on the products page
    And the page title should be "AI Coding - Products"

  Scenario: Navigation persists user authentication state
    When I click on the "Products" navigation link
    Then I should be on the products page
    And I should still be authenticated
    And I should see the navigation menu

  Scenario: Navigation works with browser back button
    When I click on the "Products" navigation link
    And I navigate back using the browser back button
    Then I should be on the welcome page
    And I should still be authenticated

  Scenario: Navigation works with browser forward button
    When I click on the "Products" navigation link
    And I navigate back using the browser back button
    And I navigate forward using the browser forward button
    Then I should be on the products page
    And I should still be authenticated

  Scenario: Unauthenticated users are redirected to login when accessing products page
    Given I am not authenticated
    When I visit the products page directly
    Then I should be redirected to the login page

  Scenario: Navigation appears only after successful login
    Given I go to "http://localhost:8080"
    Then I should not see the navigation menu
    When I enter "user@example.com" in the email field
    And I enter "password123" in the password field
    And I click the continue button
    Then I should see the navigation menu

  Scenario: Logout functionality from navigation works correctly
    Given I am on the products page
    When I logout from the navigation
    Then I should be redirected to the login page
    And I should not see the navigation menu

  Scenario: Navigation handles invalid routes properly
    When I visit an invalid route "/invalid-page"
    Then I should see a 404 error page
    But I should still see the navigation menu if authenticated

  Scenario: Multiple navigation items work correctly
    When I click on the "Products" navigation link
    Then I should be on the products page
    And the "Products" navigation item should be active
    When I click on the "Home" navigation link
    Then I should be on the welcome page
    And the "Home" navigation item should be active