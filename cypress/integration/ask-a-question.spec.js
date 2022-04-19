/// <reference types="Cypress" />
describe("Ask a question page", () => {
  it("should display the page", () => {
    cy.visit("/ask-a-question");
    cy.get("h1").should("contain", "Ask a question");
  });
  
  it("should display the form", () => {
    cy.visit("/ask-a-question");
    cy.get("form").should("be.visible");
  });
});
