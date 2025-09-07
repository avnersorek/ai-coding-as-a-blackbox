Feature: Check font

  Scenario: Check that the Inter font is loaded from Google Fonts CDN
    When I go to "http://localhost:8080/ai-coding-as-a-blackbox/"
    Then the page should use the "Inter" font from Google Fonts CDN
