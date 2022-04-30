/// <reference types="Cypress" />
describe("My Courses Page", () => {
  it("should onboard a user, add a course, and delete a course", () => {
    cy.login({ isFirstLogin: true });
    cy.get("button.css-8pcd7y").click();
    cy.get("input#field-14").type(
      "CSDS 132.  Introduction to Programming in Java"
    );
    cy.get("button.css-m5gqdz").click();
    cy.get("button.css-djxqlt").click();
    cy.get("button.css-8pcd7y").click();
    cy.get("button[aria-label='close']").click();
    cy.get("button.css-n45e6f").click();
    cy.wait(500);
    cy.logout();
  });
});
