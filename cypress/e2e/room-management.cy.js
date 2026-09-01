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

    cy.get("#room-leave-button").click();

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

  it("offers the display toggles before joining, but not delete", () => {
    cy.openRoomMenu();
    cy.contains("li", "Activity").should("be.visible");
    cy.contains("li", "Scrumlords").should("be.visible");
    cy.closeMenu();

    cy.get("#community-message-board").should("exist");
    cy.toggleRoomSetting("Activity");
    cy.get("#community-message-board").should("not.exist");
  });

  it("collapses the room panel to a strip of icons", () => {
    cy.joinRoom(username, { userType: "scrumlord" });

    cy.get("#room-side-panel").should("contain", username);
    cy.get("#room-side-panel").find("#room-point-scheme-button").should("be.visible");

    cy.get("#room-side-panel-toggle").click();

    cy.get("#room-side-panel").should("not.contain", "Joined as");
    cy.get("#room-side-panel").find("#room-leave-button").should("be.visible");

    cy.get("#room-side-panel-toggle").click();
    cy.get("#room-side-panel").should("contain", username);
  });

  it("changes the point scheme", () => {
    cy.joinRoom(username, { userType: "scrumlord" });

    cy.get("#room-point-scheme-button").click();

    cy.get("#scheme-selector").click();
    cy.get('ul[role="listbox"]').contains("T-Shirt Sizes").click();
    cy.contains("button", "Update").click();

    cy.get("#community-message-board", { timeout: 10000 }).should(
      "contain",
      "T-Shirt Sizes"
    );
  });

  it("keeps point scheme and delete room to scrumlords", () => {
    cy.joinRoom(username);

    cy.get("#room-side-panel").should("contain", username);
    cy.get("#room-leave-button").should("be.visible");
    cy.get("#room-point-scheme-button").should("not.exist");
    cy.get("#room-delete-button").should("not.exist");

    cy.openRoomMenu();
    cy.get("#room-menu").should("not.contain", "Delete room");
    cy.closeMenu();
  });

  it("walks through the room tutorial and closes on the last page", () => {
    cy.get("#community-tutorial-button").click();

    cy.contains("Step 1 of 10").should("be.visible");
    cy.contains("Join the room").should("be.visible");
    cy.get("#tutorial-back-button").should("be.disabled");

    cy.get("#tutorial-next-button").click();
    cy.contains("Set yourself up").should("be.visible");

    cy.get("#tutorial-back-button").click();
    cy.contains("Join the room").should("be.visible");

    for (let step = 1; step < 10; step += 1) {
      cy.get("#tutorial-next-button").click();
    }
    cy.contains("Step 10 of 10").should("be.visible");
    cy.contains("Watch the status light").should("be.visible");

    cy.get("#tutorial-next-button").should("contain", "Done").click();
    cy.contains("Watch the status light").should("not.exist");
  });

  it("deletes the room after name confirmation and returns to the dashboard", function () {
    cy.joinRoom(username, { userType: "scrumlord" });

    cy.get("#room-delete-button").click();

    cy.contains("button", exactDeleteButton).should("be.disabled");
    cy.get("#name").type(this.roomName);
    cy.contains("button", exactDeleteButton).should("be.enabled").click();

    cy.url({ timeout: 15000 }).should("include", "error=9000");
    cy.contains("Your room was deleted").should("be.visible");
  });
});
