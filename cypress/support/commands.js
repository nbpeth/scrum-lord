import { generate } from "random-words";

Cypress.Commands.add("uniqueRoomName", () => {
  const name = `${generate({ exactly: 2, minLength: 5, join: "-" })}-${Date.now()}`;
  return cy.wrap(name);
});

Cypress.Commands.add("createRoom", (roomName) => {
  cy.visit("/");
  cy.get("#dashboard-start-button").click();
  cy.get("#new-room-button").click();
  cy.get("#new-room-name-text-input").clear().type(roomName);
  cy.get("#new-room-create-button").click();
  cy.url({ timeout: 10000 }).should("include", "/communities/");
  cy.contains(roomName, { timeout: 10000 }).should("be.visible");
});

Cypress.Commands.add("openRoomMenu", () => {
  cy.get('[data-testid="MenuIcon"]').click();
});

Cypress.Commands.add("closeMenu", () => {
  cy.get("body").type("{esc}");
});

const typeUsernameThenSelectUserType = (username, userType) => {
  cy.get("#username").clear().type(username);
  cy.get(`#user-type-${userType}`).click();
};

Cypress.Commands.add("joinRoom", (username, { userType = "voter" } = {}) => {
  cy.get("#room-join-button").click();

  typeUsernameThenSelectUserType(username, userType);

  cy.contains("button", /^Join$/).click();

  if (userType === "voter") {
    cy.get("#vote-card-container", { timeout: 10000 }).should(
      "contain",
      username
    );
  }
});

Cypress.Commands.add("toggleRoomSetting", (label) => {
  cy.openRoomMenu();
  cy.contains("li", label).find('input[type="checkbox"]').click();
  cy.closeMenu();
});
