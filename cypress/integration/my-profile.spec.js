/// <reference types="Cypress" />
describe("My Profile Page", () => {
  it("should show my profile correctly", () => {
    cy.login({ isFirstLogin: false });
    cy.visit("/my-profile");
    cy.get("h2.css-3w5f16").should("contain", "Test (you)");
    cy.get("p.css-14izkp5").should("contain", "@test");
    cy.get("p.css-1d7mvp1").should(
      "have.text",
      "You have  asked 0 questions, answered 0 questions,  and belong to 1 course."
    );
    cy.get("span.css-9ss27x").eq(0).should("have.text", "Basic Plan");
    cy.get("span.css-9ss27x").eq(1).should("contain", "Created");
    cy.logout();
  });
});
