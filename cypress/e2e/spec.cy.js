import { generate } from "random-words";

describe("template spec", () => {
  it("can create a public room", () => {
    cy.visit("http://localhost:3000");

    const connectionStatus = cy.get("#connection-status-alert");
    connectionStatus.should("have.text", "Connected");

    const startButton = cy.get("#dashboard-start-button");
    startButton.click();

    const newRoomButton = cy.get("#new-room-button");
    newRoomButton.click();

    const newRoomNameInput = cy.get("#new-room-name-text-input");
    newRoomNameInput.clear();

    const roomName = generate({
      exactly: 2,
      minLength: 5,
      join: " ",
    });

    newRoomNameInput.type(roomName);

    const privateCheckbox = cy.get("#new-room-private-checkbox");
    privateCheckbox.click();

    const createButton = cy.get("#new-room-create-button");
    createButton.click();

    // Wait for the room to be created, then click on it
    const publicRooms = cy.get("#dashboard-public-rooms", { timeout: 3000 });
    const roomButton = publicRooms.contains(roomName);
    roomButton.click();
  });
});
