jest.mock("./postgresClient");

const postgresClient = require("./postgresClient");
const communityClient = require("./communityClient");

const row = (data, extra = {}) => ({ id: data.id, data, ...extra });

beforeEach(() => {
  jest.resetAllMocks();
});

describe("getCommunitiesAsArray", () => {
  it("maps rows to summaries and hides private rooms", async () => {
    postgresClient.getCommunities.mockResolvedValue([
      row(
        {
          id: "pub",
          name: "public room",
          citizens: [{}, {}],
          synergy: { hits: 1, total: 2 },
          isPrivate: false,
        },
        { last_modified: "2026-01-01" }
      ),
      row({ id: "priv", name: "private room", citizens: [], isPrivate: true }),
      { id: "broken", data: null },
    ]);

    const result = await communityClient.getCommunitiesAsArray();

    expect(result).toEqual([
      {
        id: "pub",
        name: "public room",
        description: undefined,
        citizens: 2,
        lastModified: "2026-01-01",
        synergy: { hits: 1, total: 2 },
        isPrivate: false,
      },
    ]);
  });

  it("returns an empty list when the query fails", async () => {
    postgresClient.getCommunities.mockResolvedValue(undefined);

    expect(await communityClient.getCommunitiesAsArray()).toEqual([]);
  });
});

describe("getCommunityBy", () => {
  it("returns the community data", async () => {
    postgresClient.getCommunityById.mockResolvedValue([
      row({ id: "c1", name: "room" }),
    ]);

    expect(await communityClient.getCommunityBy("c1")).toEqual({
      id: "c1",
      name: "room",
    });
  });

  it("returns null when the community does not exist", async () => {
    postgresClient.getCommunityById.mockResolvedValue([]);

    expect(await communityClient.getCommunityBy("missing")).toBeNull();
  });
});

describe("addCommunity", () => {
  it("seeds citizens and synergy and maps the created row", async () => {
    postgresClient.addCommunity.mockResolvedValue([
      row({ id: "c1", name: "room", isPrivate: true, citizens: [] }),
    ]);

    const result = await communityClient.addCommunity({
      name: "room",
      isPrivate: true,
    });

    expect(postgresClient.addCommunity).toHaveBeenCalledWith({
      community: { name: "room", isPrivate: true, citizens: [], synergy: {} },
    });
    expect(result).toEqual([
      {
        id: "c1",
        isPrivate: true,
        name: "room",
        description: undefined,
        citizens: 0,
      },
    ]);
  });
});

describe("submitVote", () => {
  const communityWith = (citizen, revealed) =>
    postgresClient.getCommunityById.mockResolvedValue([
      row({ id: "c1", revealed, citizens: [citizen] }),
    ]);

  beforeEach(() => {
    postgresClient.submitVote.mockResolvedValue([
      row({ id: "c1", citizens: [] }),
    ]);
  });

  it("is not a double vote before the reveal", async () => {
    communityWith({ userId: "u1", vote: 3 }, false);

    const result = await communityClient.submitVote({
      communityId: "c1",
      userId: "u1",
      vote: 5,
    });

    expect(result.doubleVote).toBe(false);
    expect(postgresClient.submitVote).toHaveBeenCalledWith(
      expect.objectContaining({ doubleVote: false })
    );
  });

  it("is a double vote when changing a cast vote after the reveal", async () => {
    communityWith({ userId: "u1", vote: 3 }, true);

    const result = await communityClient.submitVote({
      communityId: "c1",
      userId: "u1",
      vote: 5,
    });

    expect(result.doubleVote).toBe(true);
  });

  it("is not a double vote when re-submitting the same vote after the reveal", async () => {
    communityWith({ userId: "u1", vote: 5 }, true);

    const result = await communityClient.submitVote({
      communityId: "c1",
      userId: "u1",
      vote: 5,
    });

    expect(result.doubleVote).toBe(false);
  });

  it("stays a double vote once flagged", async () => {
    communityWith({ userId: "u1", vote: 5, doubleVote: true }, true);

    const result = await communityClient.submitVote({
      communityId: "c1",
      userId: "u1",
      vote: 5,
    });

    expect(result.doubleVote).toBe(true);
  });

  it("is not a double vote when voting for the first time after the reveal", async () => {
    communityWith({ userId: "u1" }, true);

    const result = await communityClient.submitVote({
      communityId: "c1",
      userId: "u1",
      vote: 5,
    });

    expect(result.doubleVote).toBe(false);
  });
});

describe("verifySynergy", () => {
  const { verifySynergy } = communityClient;

  it("is synergized when all voting members agree", () => {
    expect(
      verifySynergy({
        citizens: [
          { votingMember: true, vote: 5 },
          { votingMember: true, vote: 5 },
        ],
      })
    ).toBe(true);
  });

  it("is not synergized when votes differ", () => {
    expect(
      verifySynergy({
        citizens: [
          { votingMember: true, vote: 5 },
          { votingMember: true, vote: 8 },
        ],
      })
    ).toBe(false);
  });

  it("ignores lurkers' votes", () => {
    expect(
      verifySynergy({
        citizens: [
          { votingMember: true, vote: 5 },
          { votingMember: false, vote: 8 },
          { votingMember: true, vote: 5 },
        ],
      })
    ).toBe(true);
  });

  it("is not synergized with fewer than two citizens", () => {
    expect(verifySynergy({ citizens: [{ votingMember: true, vote: 5 }] })).toBe(
      false
    );
    expect(verifySynergy({ citizens: [] })).toBe(false);
    expect(verifySynergy(null)).toBe(false);
  });

  it("is not synergized when votes are missing", () => {
    expect(
      verifySynergy({
        citizens: [
          { votingMember: true, vote: null },
          { votingMember: true, vote: null },
        ],
      })
    ).toBe(false);
  });
});

describe("reveal", () => {
  it("synergizes the community when all votes match", async () => {
    const synergized = {
      id: "c1",
      citizens: [
        { votingMember: true, vote: 5 },
        { votingMember: true, vote: 5 },
      ],
    };
    postgresClient.revealCommunity.mockResolvedValue([row(synergized)]);
    postgresClient.synergizeCommunity.mockResolvedValue([
      row({ ...synergized, synergy: { hits: 1 } }),
    ]);

    const result = await communityClient.reveal({ communityId: "c1" });

    expect(postgresClient.synergizeCommunity).toHaveBeenCalledWith({
      communityId: "c1",
    });
    expect(result.isSynergized).toBe(true);
    expect(result.synergy).toEqual({ hits: 1 });
  });

  it("does not synergize when votes differ", async () => {
    postgresClient.revealCommunity.mockResolvedValue([
      row({
        id: "c1",
        citizens: [
          { votingMember: true, vote: 5 },
          { votingMember: true, vote: 8 },
        ],
      }),
    ]);

    const result = await communityClient.reveal({ communityId: "c1" });

    expect(postgresClient.synergizeCommunity).not.toHaveBeenCalled();
    expect(result.isSynergized).toBe(false);
  });
});

describe("startTimer", () => {
  it("computes the timer end from the timer length", async () => {
    postgresClient.startTimer.mockResolvedValue([row({ id: "c1" })]);
    const before = Date.now();

    await communityClient.startTimer({ communityId: "c1", timerLength: 60 });

    const { timerEnd } = postgresClient.startTimer.mock.calls[0][0];
    const expectedEnd = before + 60000;
    expect(timerEnd.getTime()).toBeGreaterThanOrEqual(expectedEnd - 50);
    expect(timerEnd.getTime()).toBeLessThanOrEqual(expectedEnd + 5000);
  });
});

describe("deleteCommunity", () => {
  it("deletes and reports who did it", async () => {
    postgresClient.deleteCommunity.mockResolvedValue([]);

    const result = await communityClient.deleteCommunity({
      community: { id: "c1" },
      userId: "u1",
      username: "sam",
    });

    expect(postgresClient.deleteCommunity).toHaveBeenCalledWith({
      community: { id: "c1" },
    });
    expect(result).toEqual({
      deleted: true,
      id: "c1",
      userId: "u1",
      username: "sam",
    });
  });
});
