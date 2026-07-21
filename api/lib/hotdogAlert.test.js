const { createHotdogAlert, eventTypes } = require("./hotdogAlert");

const reaction = (communityId = "room-1") => ({
  community: { id: communityId },
  event: "hotdog",
  userId: "u1",
  username: "sam",
  userColor: "#fff",
});

describe("createHotdogAlert", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not alert below the threshold", () => {
    const notifyClients = jest.fn();
    const alert = createHotdogAlert({ notifyClients, max: 3 });

    alert.handleReaction(reaction());
    alert.handleReaction(reaction());

    expect(notifyClients).not.toHaveBeenCalled();
    expect(alert.getSlot("room-1").value).toBe(2);
  });

  it("decays reaction levels while below the threshold", () => {
    const notifyClients = jest.fn();
    const alert = createHotdogAlert({
      notifyClients,
      max: 5,
      decayDelayMs: 2000,
    });

    alert.handleReaction(reaction());
    expect(alert.getSlot("room-1").value).toBe(1);

    jest.advanceTimersByTime(2000);
    expect(alert.getSlot("room-1").value).toBe(0);
  });

  it("broadcasts an overload alert when the threshold is hit", () => {
    const notifyClients = jest.fn();
    const decayDelayLongerThanTest = 60000;
    const alert = createHotdogAlert({
      notifyClients,
      max: 2,
      decayDelayMs: decayDelayLongerThanTest,
    });

    alert.handleReaction(reaction());
    alert.handleReaction(reaction());

    expect(notifyClients).toHaveBeenCalledTimes(1);
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: eventTypes.communityAlerts.hotdog.active,
        payload: {
          event: "hotdog",
          userId: "u1",
          username: "sam",
          userColor: "#fff",
        },
      },
      communityId: "room-1",
    });
    expect(alert.getSlot("room-1").active).toBe(true);
  });

  it("only alerts once while the overload is active", () => {
    const notifyClients = jest.fn();
    const alert = createHotdogAlert({ notifyClients, max: 2 });

    alert.handleReaction(reaction());
    alert.handleReaction(reaction());
    alert.handleReaction(reaction());
    alert.handleReaction(reaction());

    expect(notifyClients).toHaveBeenCalledTimes(1);
  });

  it("clears the overload and notifies after the overload duration", () => {
    const notifyClients = jest.fn();
    const alert = createHotdogAlert({
      notifyClients,
      max: 2,
      overloadDurationMs: 60000,
    });

    alert.handleReaction(reaction());
    alert.handleReaction(reaction());
    notifyClients.mockClear();

    jest.advanceTimersByTime(60000);

    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: eventTypes.communityAlerts.hotdog.inactive,
        payload: expect.objectContaining({ hotdogCapacity: 0 }),
      },
      communityId: "room-1",
    });
    expect(alert.getSlot("room-1")).toEqual({ active: false, value: 0 });
  });

  it("tracks rooms independently", () => {
    const notifyClients = jest.fn();
    const alert = createHotdogAlert({ notifyClients, max: 2 });

    alert.handleReaction(reaction("room-1"));
    alert.handleReaction(reaction("room-2"));

    expect(alert.getSlot("room-1").value).toBe(1);
    expect(alert.getSlot("room-2").value).toBe(1);
    expect(notifyClients).not.toHaveBeenCalled();
  });
});
