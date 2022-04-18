/// <reference types="Cypress" />
describe("Home Page", () => {
  it("should display the home page", () => {
    cy.visit("/");
    cy.get("button").should("contain", "Continue with Google");
    cy.get("button").click();
  });
});
