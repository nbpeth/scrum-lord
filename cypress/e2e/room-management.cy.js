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

  it("shows scrum lords in the lurker box instead of the vote grid", () => {
    cy.joinRoom("cypress-observer", { userType: "scrumlord" });

    cy.get("#lurker-box", { timeout: 10000 }).should(
      "contain",
      "cypress-observer"
    );
    cy.get("#vote-card-container").should("not.contain", "cypress-observer");

    cy.toggleRoomSetting("Scrumlords");
    cy.get("#lurker-box").should("not.exist");
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

  it("walks through the room tutorial and closes on the last page", () => {
    cy.get("#community-tutorial-button").click();

    cy.contains("Step 1 of 10").should("be.visible");
    cy.contains("Open the menu to join").should("be.visible");
    cy.get("#tutorial-back-button").should("be.disabled");

    cy.get("#tutorial-next-button").click();
    cy.contains("Set yourself up").should("be.visible");

    cy.get("#tutorial-back-button").click();
    cy.contains("Open the menu to join").should("be.visible");

    for (let step = 1; step < 10; step += 1) {
      cy.get("#tutorial-next-button").click();
    }
    cy.contains("Step 10 of 10").should("be.visible");
    cy.contains("Watch the status light").should("be.visible");

    cy.get("#tutorial-next-button").should("contain", "Done").click();
    cy.contains("Watch the status light").should("not.exist");
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
