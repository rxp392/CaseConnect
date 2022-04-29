/// <reference types="Cypress" />
describe("My Courses Page", () => {
  it("should onboard a user correctly", () => {
    cy.login({ isFirstLogin: true });
  });
});
