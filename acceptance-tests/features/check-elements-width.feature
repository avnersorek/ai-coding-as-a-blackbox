Feature: Check elements width

  Scenario: Check that the input and button have the same width
    When I go to "http://localhost:8080/ai-coding-as-a-blackbox/"
    Then the "input" and "button" should have the same width
