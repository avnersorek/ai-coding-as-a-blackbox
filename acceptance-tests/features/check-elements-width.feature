Feature: Check elements width

  Scenario: Check that the input and button have the same width
    When I go to the home page
    Then the "input" and "button" should have the same width
