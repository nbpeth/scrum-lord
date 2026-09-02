describe("room voting", () => {
  const username = "cypress-voter";
  const emptyVoteSlot = "-";

  beforeEach(() => {
    cy.uniqueRoomName().then((roomName) => {
      cy.wrap(roomName).as("roomName");
      cy.createRoom(roomName);
      cy.joinRoom(username);
    });
  });

  it("shows the joined citizen with no vote cast", () => {
    cy.get("#vote-card-container").should("contain", username);
    cy.get("#vote-card-container").should("contain", emptyVoteSlot);
  });

  it("casts a vote, reveals it, and resets the round", () => {
    cy.get("#vote-selector").click();
    cy.get('ul[role="listbox"]').contains(/^5$/).click();
    cy.contains("button", "Vote").click();

    cy.get("#vote-card-container", { timeout: 10000 }).should("contain", "5");

    cy.contains("button", "Reveal").should("be.enabled").click();
    cy.contains("button", "Reveal", { timeout: 10000 }).should("be.disabled");
    cy.contains("button", "Reset").should("be.enabled");

    cy.get("#vote-card-container", { timeout: 10000 }).should("contain", "5");

    cy.contains("button", "Reset").click();
    cy.contains("button", "Reveal", { timeout: 10000 }).should("be.enabled");
    cy.get("#vote-card-container").should("contain", emptyVoteSlot);
  });

  it("records room activity on the message board", () => {
    cy.get("#community-message-board", { timeout: 10000 }).should(
      "contain",
      `"${username}" has joined`
    );

    cy.get("#vote-selector").click();
    cy.get('ul[role="listbox"]').contains(/^8$/).click();
    cy.contains("button", "Vote").click();

    cy.get("#community-message-board", { timeout: 10000 }).should(
      "contain",
      `"${username}" has voted`
    );
  });

  it("sends reactions to the room", () => {
    cy.get('button[title="hotdog"]').click();

    cy.get("#community-message-board", { timeout: 10000 }).should(
      "contain",
      "🌭"
    );
  });

  it("sends an overflow reaction from the tray", () => {
    cy.get('button[title="shrug"]').should("not.exist");

    cy.get("#more-reactions-button").click();
    cy.get("#reaction-tray").find('button[title="shrug"]').click();

    cy.get("#community-message-board", { timeout: 10000 }).should(
      "contain",
      "🤷"
    );
  });

  it("starts and cancels the voting timer", () => {
    cy.contains("button", "Timer").should("be.visible").click();
    cy.contains("button", "Cancel", { timeout: 10000 }).click();
    cy.contains("button", "Timer", { timeout: 10000 }).should("be.visible");
  });
});
