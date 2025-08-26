Feature: Check localhost

  Scenario: Check that localhost returns a 200 status code
    When I go to "http://localhost:8080"
    Then I should get a 200 status code

  Scenario: Check that the home page matches the snapshot
    When I go to "http://localhost:8080"
    Then the page should match the snapshot "home-page"

  Scenario: Check that the page title matches the expected value
    When I go to "http://localhost:8080"
    Then the page title should equal "AI Coding - Login"
