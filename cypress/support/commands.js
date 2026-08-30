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

const typeUsernameThenSetVotingMembership = (username, voting) => {
  cy.get("#username").clear().type(username);
  if (!voting) {
    cy.get('input[type="checkbox"]').uncheck();
  }
};

Cypress.Commands.add("joinRoom", (username, { voting = true } = {}) => {
  cy.openRoomMenu();
  cy.contains("button", "Join room").click();

  typeUsernameThenSetVotingMembership(username, voting);

  cy.contains("button", /^Join$/).click();
  cy.closeMenu();

  if (voting) {
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
