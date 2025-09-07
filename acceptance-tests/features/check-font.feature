Feature: Check font

  Scenario: Check that the Inter font is loaded from Google Fonts CDN
    When I go to the home page
    Then the page should use the "Inter" font from Google Fonts CDN
