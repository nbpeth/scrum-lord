describe("room management", () => {
  const username = "cypress-admin";
  const exactDeleteButton = /^Delete$/;

  beforeEach(() => {
    cy.uniqueRoomName().then((roomName) => {
      cy.wrap(roomName).as("roomName");
      cy.createRoom(roomName);
    });
  });

  it("lets a citizen leave the room", () => {
    cy.joinRoom(username);

    cy.openRoomMenu();
    cy.contains("button", "Leave").click();
    cy.closeMenu();

    cy.contains("No one is here", { timeout: 10000 }).should("be.visible");
  });

  it("shows observers in the lurker box", () => {
    cy.joinRoom("cypress-observer", { voting: false });
    cy.toggleRoomSetting("Observers");

    cy.get("#lurker-box", { timeout: 10000 }).should(
      "contain",
      "cypress-observer"
    );
    cy.get("#vote-card-container").should("not.contain", "cypress-observer");
  });

  it("changes the point scheme", () => {
    cy.joinRoom(username);

    cy.openRoomMenu();
    cy.contains("li", "Edit point scheme").click();

    cy.get("#scheme-selector").click();
    cy.get('ul[role="listbox"]').contains("T-Shirt Sizes").click();
    cy.contains("button", "Update").click();
    cy.closeMenu();

    cy.get("#vote-selector").click();
    cy.get('ul[role="listbox"]', { timeout: 10000 }).should("contain", "XS");
  });

  it("deletes the room after name confirmation and returns to the dashboard", function () {
    cy.joinRoom(username);

    cy.openRoomMenu();
    cy.contains("button", "Delete room").click();

    cy.contains("button", exactDeleteButton).should("be.disabled");
    cy.get("#name").type(this.roomName);
    cy.contains("button", exactDeleteButton).should("be.enabled").click();

    cy.url({ timeout: 15000 }).should("include", "error=9000");
    cy.contains("Your room was deleted").should("be.visible");
  });
});
