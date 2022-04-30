/// <reference types="Cypress" />
describe("Ask a Question Page", () => {
  it("should ask a question correctly", () => {
    cy.login({ isFirstLogin: false });
    cy.visit("/ask-a-question");
    cy.get("textarea#question").type("What is java?");
    cy.get("select#courseName").select(
      "CSDS 132.  Introduction to Programming in Java"
    );
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/questions");
    cy.logout();
  });
});
