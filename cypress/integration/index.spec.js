/// <reference types="Cypress" />
describe("Home Page", () => {
  it("should display the home page", () => {
    cy.visit("/");
    cy.get("button.css-1i69bkx").should("contain.text", "Continue with Google");
    cy.get("img.css-1phd9a0").should("exist");
  });

  it("should successfully login", () => {
    cy.login({ isFirstLogin: true });
    cy.url().should("include", "/my-courses");
    cy.logout();
  });

  it("should unsuccessfully login", () => {
    cy.visit("/?error=AccessDenied");
    cy.get("div[role=alert]").should("contain.text", "Access Denied");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
