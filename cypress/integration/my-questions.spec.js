/// <reference types="Cypress" />
describe("My Questions Page", () => {
  it("should show my question", () => {
    cy.login({ isFirstLogin: false });
    cy.visit("/my-questions", {
      failOnStatusCode: false,
    });
    cy.request({
      method: "POST",
      url: "/api/test/post-question",
      body: {
        question: "What is java?",
        courseId: 1295,
        publisherName: "Test",
        userCaseId: "test",
        courseName: "CSDS 132.  Introduction to Programming in Java",
      },
    });
    cy.reload();
    cy.wait(500);
    cy.get("h2.css-1fgd7yy").first().should("contain", "What is java?");
    cy.get("p.css-hno8fu")
      .first()
      .should("have.text", "CSDS 132.  Introduction to Programming in Java");
    cy.get("span.css-eywthe").first().should("have.text", "no answers");
    cy.get("span.css-1xt3xam").first().should("have.text", "Not Viewed");
    cy.get("span.css-1vs580o").first().should("have.text", "no Attachment");
    cy.logout();
  });
});
