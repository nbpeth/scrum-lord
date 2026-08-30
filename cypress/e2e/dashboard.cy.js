describe("dashboard", () => {
  it("connects to the server and shows a healthy status indicator", () => {
    cy.visit("/");
    cy.get("#connection-status-alert", { timeout: 10000 }).should(
      "have.attr",
      "aria-label",
      "Connected"
    );
  });

  it("creates a private room and navigates into it", () => {
    cy.uniqueRoomName().then((roomName) => {
      cy.createRoom(roomName);
      cy.contains(roomName).should("be.visible");
    });
  });

  it("lists a visited room under Your rooms", () => {
    cy.uniqueRoomName().then((roomName) => {
      cy.createRoom(roomName);

      cy.visit("/");
      cy.get("#dashboard-start-button").click();
      cy.get("#dashboard-your-rooms").contains(roomName).should("be.visible");

      cy.get("#dashboard-your-rooms").contains(roomName).click();
      cy.url().should("include", "/communities/");
      cy.contains(roomName).should("be.visible");
    });
  });

  it("filters Your rooms by search", () => {
    const seededPrivateRooms = {
      "seed-1": { id: "seed-1", name: "alpha-room" },
      "seed-2": { id: "seed-2", name: "beta-room" },
    };
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "privateRooms",
          JSON.stringify(seededPrivateRooms)
        );
      },
    });

    cy.get("#dashboard-start-button").click();
    cy.get("#dashboard-your-rooms").should("contain", "alpha-room");
    cy.get("#dashboard-your-rooms").should("contain", "beta-room");

    cy.get('input[aria-label="search"]').type("alpha");
    cy.get("#dashboard-your-rooms").should("contain", "alpha-room");
    cy.get("#dashboard-your-rooms").should("not.contain", "beta-room");
  });

  it("shows the version, repo links, and support button in the footer", () => {
    cy.intercept("https://api.github.com/repos/nbpeth/scrum-lord/tags", {
      body: [{ name: "v9.9.9" }],
    });
    cy.visit("/");

    cy.contains("footer", "v9.9.9").should("be.visible");
    cy.contains("footer a", "Change log").should(
      "have.attr",
      "href",
      "https://github.com/nbpeth/scrum-lord/releases"
    );
    cy.contains("footer a", "Issues").should(
      "have.attr",
      "href",
      "https://github.com/nbpeth/scrum-lord/issues"
    );
    cy.get('footer a[href*="buymeacoffee"]').should("exist");
  });

  it("walks through the tutorial and closes on the last page", () => {
    cy.visit("/");
    cy.get("#dashboard-tutorial-button").click();

    cy.contains("Step 1 of 5").should("be.visible");
    cy.contains("Press the big button").should("be.visible");
    cy.get("#tutorial-back-button").should("be.disabled");

    cy.get("#tutorial-next-button").click();
    cy.contains("Find a room, or start one").should("be.visible");

    cy.get("#tutorial-back-button").click();
    cy.contains("Press the big button").should("be.visible");

    cy.get("#tutorial-next-button").click();
    cy.get("#tutorial-next-button").click();
    cy.get("#tutorial-next-button").click();
    cy.contains("Save that URL now").should("be.visible");

    cy.get("#tutorial-next-button").click();
    cy.contains("Step 5 of 5").should("be.visible");
    cy.contains("Watch the status light").should("be.visible");

    cy.get("#tutorial-next-button").should("contain", "Done").click();
    cy.contains("Watch the status light").should("not.exist");
  });

  it("shows an error banner when a room does not exist", () => {
    cy.visit("/communities/00000000-0000-0000-0000-000000000000");
    cy.url({ timeout: 10000 }).should("include", "error=404");
    cy.contains("Room not found").should("be.visible");
  });
});
