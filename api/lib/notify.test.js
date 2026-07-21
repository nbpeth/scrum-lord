const { createClientNotifier, notifyCaller } = require("./notify");

const makeClient = (targetCommunityId) => ({
  targetCommunityId,
  send: jest.fn(),
});

describe("notifyCaller", () => {
  it("sends the serialized message to the single client", () => {
    const ws = makeClient();
    const message = { type: "x-reply", payload: { a: 1 } };

    notifyCaller(ws, message);

    expect(ws.send).toHaveBeenCalledWith(JSON.stringify(message));
  });
});

describe("createClientNotifier", () => {
  const message = { type: "some-reply", payload: {} };

  it("sends targeted messages only to clients watching that room", () => {
    const inRoom = makeClient("room-1");
    const otherRoom = makeClient("room-2");
    const lobby = makeClient(undefined);
    const notifyClients = createClientNotifier({
      clients: new Set([inRoom, otherRoom, lobby]),
    });

    notifyClients({ message, communityId: "room-1" });

    expect(inRoom.send).toHaveBeenCalledWith(JSON.stringify(message));
    expect(otherRoom.send).not.toHaveBeenCalled();
    expect(lobby.send).not.toHaveBeenCalled();
  });

  it("sends untargeted messages only to lobby clients", () => {
    const inRoom = makeClient("room-1");
    const lobby = makeClient(undefined);
    const notifyClients = createClientNotifier({
      clients: new Set([inRoom, lobby]),
    });

    notifyClients({ message });

    expect(inRoom.send).not.toHaveBeenCalled();
    expect(lobby.send).toHaveBeenCalledWith(JSON.stringify(message));
  });
});
