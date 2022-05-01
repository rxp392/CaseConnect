import hkdf from "@panva/hkdf";
import { EncryptJWT } from "jose";

async function getDerivedEncryptionKey(secret) {
  return await hkdf(
    "sha256",
    secret,
    "",
    "NextAuth.js Generated Encryption Key",
    32
  );
}

export async function encode(token, secret) {
  const maxAge = 30 * 24 * 60 * 60;
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(Date.now() / 1000 + maxAge)
    .setJti("test")
    .encrypt(encryptionSecret);
}

Cypress.Commands.add("login", ({ isFirstLogin }) => {
  cy.fixture("session")
    .then((sessionJSON) =>
      cy.request({
        method: "DELETE",
        url: "/api/test/delete-user",
        body: { caseId: sessionJSON.user.caseId },
      })
    )
    .then(() => cy.fixture("session"))
    .then(({ user }) =>
      cy.request({
        method: "POST",
        url: "/api/test/seed-user",
        body: { ...user, isFirstLogin },
      })
    )
    .then(() => cy.fixture("session"))
    .then((sessionJSON) =>
      encode(sessionJSON, Cypress.env("NEXTAUTH_JWT_SECRET"))
    )
    .then((encryptedToken) =>
      cy.setCookie("next-auth.session-token", encryptedToken)
    )
    .then(() => cy.visit("/my-courses", { failOnStatusCode: false }))
    .then(() => {
      if (!isFirstLogin) {
        cy.request({
          method: "POST",
          url: "/api/protected/courses/post",
          body: { caseId: "test", courseIds: [{ id: 1295 }] },
        });
      }
    });
});

Cypress.Commands.add("logout", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit("/");
  cy.fixture("session").then((sessionJSON) =>
    cy.request({
      method: "DELETE",
      url: "/api/test/delete-user",
      body: { caseId: sessionJSON.user.caseId },
    })
  );
});
