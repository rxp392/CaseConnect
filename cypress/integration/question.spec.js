/// <reference types="Cypress" />
describe("Question Page", () => {
  it("should show question", () => {
    cy.login({ isFirstLogin: false });
    cy.visit("/my-questions");
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
    cy.get("button.css-1v7yr4e").first().click();
    cy.url().should("include", "/question?");
    cy.get("h2.css-8kzi14").should("contain", "What is java?");
    cy.get("p.css-1wixzzf")
      .first()
      .should("have.text", "CSDS 132.  Introduction to Programming in Java");
    cy.get("p.css-1wixzzf").should(
      "contain",
      `${new Date().toLocaleDateString()} by Test`
    );
    cy.get("h2.css-jh76pu").should("contain", "No Answers Have Been Posted 😥");
    cy.get("button.css-ra0mjv").first().click();
    cy.get("textarea.css-1vzhn8z").type("?");
    cy.get("button.css-jxg557").click();
    cy.get("h2.css-8kzi14").should("contain", "What is java??");
    cy.get("button.css-ra0mjv").eq(1).click();
    cy.get("button.css-n45e6f").click();
    cy.url().should("include", "/questions");
    cy.logout();
  });
});
