Feature: Login Flow

  Background:
    Given I go to "http://localhost:8080"

  Scenario: Login form elements are present
    Then I should see the email input field
    And I should see the password input field
    And I should see the continue button

  # TODO: Implement actual login functionality before enabling these tests
  # The scenarios below test login behavior that hasn't been implemented yet
  
  @skip
  Scenario: Successful login with valid credentials
    When I enter "user@example.com" in the email field
    And I enter "password123" in the password field
    And I click the continue button
    Then I should be redirected to the welcome page
    And I should see the welcome message

  @skip
  Scenario: Failed login with invalid email
    When I enter "invalid-email" in the email field
    And I enter "password123" in the password field
    And I click the continue button
    Then I should see an error message about invalid email format

  @skip
  Scenario: Failed login with incorrect credentials
    When I enter "wrong@example.com" in the email field
    And I enter "wrongpassword" in the password field
    And I click the continue button
    Then I should see an error message about invalid credentials

  @skip
  Scenario: Failed login with empty fields
    When I click the continue button without filling any fields
    Then I should see validation error messages

  @skip
  Scenario: Failed login with empty email
    When I enter "password123" in the password field
    And I click the continue button
    Then I should see an error message about required email

  @skip
  Scenario: Failed login with empty password
    When I enter "user@example.com" in the email field
    And I click the continue button
    Then I should see an error message about required password