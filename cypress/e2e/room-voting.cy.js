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
    cy.get("#vote-button").click();
    cy.get("#vote-deck").contains("button", /^5$/).click();

    cy.get("#vote-card-container", { timeout: 10000 }).should("contain", "5");
    cy.get("#vote-button").should("contain", "5");

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

    cy.get("#vote-button").click();
    cy.get("#vote-deck").contains("button", /^8$/).click();

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
    cy.get("#timer-button").should("contain", "1:00").click();

    cy.get("#timer-countdown", { timeout: 10000 }).should("be.visible").click();

    cy.get("#timer-button", { timeout: 10000 }).should("be.visible");
  });

  it("starts the timer from a preset", () => {
    cy.get("#timer-presets-button").click();
    cy.get("#timer-presets").contains("button", "0:30").click();

    cy.get("#timer-countdown", { timeout: 10000 }).should("be.visible");
    cy.get("#timer-countdown").click();

    cy.get("#timer-button", { timeout: 10000 }).should("contain", "0:30");
  });
});
