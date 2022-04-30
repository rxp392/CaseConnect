/// <reference types="Cypress" />
describe("Subscription Page", () => {
  beforeEach(() => {
    cy.login({ isFirstLogin: false });
    cy.visit("/subscription");
  });
  afterEach(() => {
    cy.logout();
  });

  it("should show a basic subscription correctly", () => {
    cy.get("button.css-1bssxr9").should("exist");
  });

  it("should show a premium subscription correctly", () => {
    cy.request("POST", "/api/test/change-subscription", {
      caseId: "test",
      subscription: "Premium",
    });
    cy.reload();
    cy.get("h2.css-121pujs").should(
      "contain",
      "Congratulations! You're a Premium user"
    );
    cy.get("p.css-hvlzr0").should(
      "contain",
      "You can now ask and view unlimited questions"
    );
  });
});
