const { createHandlers } = require("./handlers");

const makeDeps = (overrides = {}) => {
  const communityClient = {
    addCommunity: jest.fn().mockResolvedValue([{ id: "c1", name: "room" }]),
    getCommunitiesAsArray: jest.fn().mockResolvedValue([{ id: "c1" }]),
    getCommunityBy: jest.fn().mockResolvedValue({ id: "c1" }),
    joinCommunity: jest.fn().mockResolvedValue({ id: "c1", citizens: [] }),
    leaveCommunity: jest.fn().mockResolvedValue({ id: "c1", citizens: [] }),
    submitVote: jest.fn().mockResolvedValue({ id: "c1", doubleVote: false }),
    reveal: jest.fn().mockResolvedValue({ id: "c1", isSynergized: false }),
    reset: jest.fn().mockResolvedValue({ id: "c1" }),
    deleteCommunity: jest.fn().mockResolvedValue({ deleted: true, id: "c1" }),
    editPointScheme: jest.fn().mockResolvedValue({ id: "c1" }),
    startTimer: jest.fn().mockResolvedValue({ id: "c1", timer: {} }),
    stopTimer: jest.fn().mockResolvedValue({ id: "c1", revealed: true }),
    cancelTimer: jest.fn().mockResolvedValue({ id: "c1" }),
    ...overrides.communityClient,
  };
  const notifyClients = jest.fn();
  const hotdogAlert = { handleReaction: jest.fn() };
  const timers = overrides.timers ?? {};
  const ws = { send: jest.fn(), id: "ws-1" };

  const handlers = createHandlers({
    communityClient,
    notifyClients,
    hotdogAlert,
    timers,
  });

  return { handlers, communityClient, notifyClients, hotdogAlert, timers, ws };
};

const user = { username: "sam", userId: "u1", userColor: "#fff" };

describe("create-community", () => {
  it("replies privately to the caller for private rooms and broadcasts the list", async () => {
    const { handlers, notifyClients, ws } = makeDeps();

    await handlers["create-community"](
      { community: { name: "room", isPrivate: true } },
      ws
    );

    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "community-created-complete-reply",
        payload: { result: [{ id: "c1", name: "room" }] },
      })
    );
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "community-created-reply",
        payload: { communities: [{ id: "c1" }] },
      },
    });
  });

  it("does not reply privately for public rooms", async () => {
    const { handlers, ws } = makeDeps();

    await handlers["create-community"](
      { community: { name: "room", isPrivate: false } },
      ws
    );

    expect(ws.send).not.toHaveBeenCalled();
  });
});

describe("join-community", () => {
  it("joins with the provided color and broadcasts to the room", async () => {
    const { handlers, communityClient, notifyClients } = makeDeps();

    await handlers["join-community"]({
      community: { id: "c1", ...user, userType: "voter", votingMember: true },
    });

    expect(communityClient.joinCommunity).toHaveBeenCalledWith({
      communityId: "c1",
      username: "sam",
      userId: "u1",
      userColor: "#fff",
      userType: "voter",
      votingMember: true,
    });
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "community-joined-reply",
        payload: {
          joinedUser: {
            username: "sam",
            userId: "u1",
            userType: "voter",
            votingMember: true,
            userColor: "#fff",
          },
          community: { id: "c1", citizens: [] },
        },
      },
      communityId: "c1",
    });
  });

  it("carries the scrum lord user type through as a non-voting member", async () => {
    const { handlers, communityClient } = makeDeps();

    await handlers["join-community"]({
      community: {
        id: "c1",
        ...user,
        userType: "scrumlord",
        votingMember: false,
      },
    });

    expect(communityClient.joinCommunity).toHaveBeenCalledWith(
      expect.objectContaining({ userType: "scrumlord", votingMember: false })
    );
  });

  it("falls back to a random color when none is given", async () => {
    const { handlers, communityClient } = makeDeps();

    await handlers["join-community"]({
      community: { id: "c1", username: "sam", userId: "u1" },
    });

    const { userColor } = communityClient.joinCommunity.mock.calls[0][0];
    expect(userColor).toEqual(expect.any(String));
    expect(userColor.length).toBeGreaterThan(0);
  });
});

describe("get-community", () => {
  it("replies with the community targeted at the room", async () => {
    const { handlers, notifyClients } = makeDeps();

    await handlers["get-community"]({ communityId: "c1" });

    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "get-community-reply",
        payload: { community: { id: "c1" }, communityId: "c1" },
      },
      communityId: "c1",
    });
  });
});

describe("submit-vote", () => {
  it("submits and broadcasts the result with the doubleVote flag", async () => {
    const { handlers, communityClient, notifyClients } = makeDeps({
      communityClient: {
        submitVote: jest.fn().mockResolvedValue({ id: "c1", doubleVote: true }),
      },
    });

    await handlers["submit-vote"]({
      community: { id: "c1", userId: "u1", username: "sam", vote: 5 },
      userColor: "#fff",
    });

    expect(communityClient.submitVote).toHaveBeenCalledWith({
      communityId: "c1",
      userId: "u1",
      vote: 5,
    });
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "submit-vote-reply",
        payload: {
          community: { id: "c1", doubleVote: true },
          username: "sam",
          userId: "u1",
          userColor: "#fff",
          doubleVote: true,
        },
      },
      communityId: "c1",
    });
  });
});

describe("reveal", () => {
  it("reveals and broadcasts with the synergy flag", async () => {
    const { handlers, communityClient, notifyClients } = makeDeps({
      communityClient: {
        reveal: jest.fn().mockResolvedValue({ id: "c1", isSynergized: true }),
      },
    });

    await handlers.reveal({ community: { id: "c1" }, ...user });

    expect(communityClient.reveal).toHaveBeenCalledWith({ communityId: "c1" });
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "reveal-reply",
        payload: {
          community: { id: "c1", isSynergized: true },
          ...user,
          isSynergized: true,
        },
      },
      communityId: "c1",
    });
  });

  it("kills a running timer before revealing", async () => {
    const timer = setTimeout(() => {}, 100000);
    const timers = { c1: { timer } };
    const { handlers, communityClient } = makeDeps({ timers });

    await handlers.reveal({ community: { id: "c1" }, ...user });

    expect(communityClient.cancelTimer).toHaveBeenCalledWith({
      communityId: "c1",
    });
    expect(timers.c1).toBeUndefined();
    clearTimeout(timer);
  });
});

describe("reset", () => {
  it("resets and broadcasts", async () => {
    const { handlers, communityClient, notifyClients } = makeDeps();

    await handlers.reset({ community: { id: "c1" }, ...user });

    expect(communityClient.reset).toHaveBeenCalledWith({ communityId: "c1" });
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "reset-reply",
        payload: { community: { id: "c1" }, ...user },
      },
      communityId: "c1",
    });
  });
});

describe("delete-community", () => {
  it("deletes and broadcasts the delete result to the room", async () => {
    const { handlers, notifyClients } = makeDeps();

    await handlers["delete-community"]({
      community: { id: "c1" },
      userId: "u1",
      username: "sam",
    });

    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "delete-community-reply",
        payload: { deleted: true, id: "c1" },
      },
      communityId: "c1",
    });
  });
});

describe("community-reaction", () => {
  it("broadcasts the reaction", async () => {
    const { handlers, notifyClients, hotdogAlert } = makeDeps();

    await handlers["community-reaction"]({
      community: { id: "c1" },
      event: "party",
      ...user,
    });

    expect(hotdogAlert.handleReaction).not.toHaveBeenCalled();
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "community-reaction-reply",
        payload: { event: "party", ...user },
      },
      communityId: "c1",
    });
  });

  it("routes hotdog reactions through the hotdog alert", async () => {
    const { handlers, hotdogAlert } = makeDeps();
    const payload = { community: { id: "c1" }, event: "hotdog", ...user };

    await handlers["community-reaction"](payload);

    expect(hotdogAlert.handleReaction).toHaveBeenCalledWith(payload);
  });
});

describe("edit-point-scheme", () => {
  it("updates the scheme and broadcasts it", async () => {
    const { handlers, communityClient, notifyClients } = makeDeps();

    await handlers["edit-point-scheme"]({
      community: { id: "c1" },
      scheme: "tshirt",
      ...user,
    });

    expect(communityClient.editPointScheme).toHaveBeenCalledWith({
      communityId: "c1",
      scheme: "tshirt",
    });
    expect(notifyClients).toHaveBeenCalledWith({
      message: {
        type: "edit-point-scheme-reply",
        payload: { community: { id: "c1" }, ...user, scheme: "tshirt" },
      },
      communityId: "c1",
    });
  });
});

describe("start-timer / cancel-timer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts the timer, then broadcasts the finish when it runs out", async () => {
    const timers = {};
    const { handlers, communityClient, notifyClients } = makeDeps({ timers });

    await handlers["start-timer"](
      { community: { id: "c1" }, timerLength: 2, ...user },
      { send: jest.fn() }
    );

    expect(communityClient.startTimer).toHaveBeenCalledWith({
      communityId: "c1",
      timerLength: 2,
    });
    expect(notifyClients).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.objectContaining({ type: "start-timer-reply" }),
      })
    );
    expect(timers.c1).toBeDefined();

    await jest.advanceTimersByTimeAsync(2150);

    expect(communityClient.stopTimer).toHaveBeenCalledWith({
      communityId: "c1",
    });
    expect(notifyClients).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.objectContaining({ type: "timer-finished-reply" }),
      })
    );
    expect(timers.c1).toBeUndefined();
  });

  it("rejects a start when a timer is already running", async () => {
    const { handlers, communityClient, notifyClients, ws } = makeDeps({
      communityClient: {
        getCommunityBy: jest
          .fn()
          .mockResolvedValue({ id: "c1", timerRunning: true }),
      },
    });

    await handlers["start-timer"](
      { community: { id: "c1" }, timerLength: 2, ...user },
      ws
    );

    expect(ws.send).toHaveBeenCalledWith(
      expect.stringContaining("Timer already running")
    );
    expect(communityClient.startTimer).not.toHaveBeenCalled();
    expect(notifyClients).not.toHaveBeenCalled();
  });

  it("cancels a running timer and broadcasts the cancellation", async () => {
    const timer = setTimeout(() => {}, 100000);
    const timers = { c1: { timer } };
    const { handlers, communityClient, notifyClients } = makeDeps({ timers });

    await handlers["cancel-timer"](
      { community: { id: "c1" }, ...user },
      { send: jest.fn() }
    );

    expect(communityClient.cancelTimer).toHaveBeenCalledWith({
      communityId: "c1",
    });
    expect(notifyClients).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.objectContaining({ type: "cancel-timer-reply" }),
      })
    );
    expect(timers.c1).toBeUndefined();
  });

  it("ignores a cancel when no timer is running", async () => {
    const { handlers, communityClient, notifyClients, ws } = makeDeps();

    await handlers["cancel-timer"]({ community: { id: "c1" }, ...user }, ws);

    expect(communityClient.cancelTimer).not.toHaveBeenCalled();
    expect(notifyClients).not.toHaveBeenCalled();
  });
});
