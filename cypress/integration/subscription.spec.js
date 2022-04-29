/// <reference types="Cypress" />
describe("SubscriptionPage", () => {
    it("should return the subscription page",() => {
        cy.login({isFirstLogin: false});
        cy.visit("/subscription");
    } )
    it("check for current plan",() => {
        cy.get(".css-1gd1h4t").contains("Basic Plan"); 
        cy.get(".css-pq4kmx").should("exist");
        cy.get(".css-1yrxwy4").should("exist");
    } )
    it("check for Upgrade button",() => {
        cy.get(".css-1bssxr9").contains("Upgrade Now"); 
    } )
    // it("check for Premium", () => {
    //     cy.login({ isFirstLogin: false });
    //     cy.visit("/subscription");
    //     cy.request({
    //       method: "POST",
    //       url: "/api/test/change-subscription",
    //       body: { caseId: "test", subscription: "Premium" },
    //     })
    //       .then(() => cy.reload())
    //       .then(() =>
    //         cy.request({
    //           method: "POST",
    //           url: "/api/test/change-subscription",
    //           body: { caseId: "test", subscription: "Basic" },
    //         })
    //       );
    //     //cy.get(".css-1gd1h4t").contains("Premium Plan");
    //   });
      


});
