const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};
const mockPool = {
  connect: jest.fn().mockResolvedValue(mockClient),
};

jest.mock("pg", () => ({
  Pool: jest.fn(() => mockPool),
}));

const postgresClient = require("./postgresClient");

beforeEach(() => {
  jest.clearAllMocks();
  mockPool.connect.mockResolvedValue(mockClient);
  mockClient.query.mockResolvedValue({ rows: [] });
});

describe("executeQuery behavior", () => {
  it("returns the rows and releases the client", async () => {
    const rows = [{ id: "c1" }];
    mockClient.query.mockResolvedValue({ rows });

    const result = await postgresClient.getCommunities();

    expect(result).toEqual(rows);
    expect(mockClient.release).toHaveBeenCalledTimes(1);
  });

  it("returns undefined and still releases the client when the query fails", async () => {
    mockClient.query.mockRejectedValue(new Error("boom"));
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await postgresClient.getCommunities();

    expect(result).toBeUndefined();
    expect(mockClient.release).toHaveBeenCalledTimes(1);
    consoleError.mockRestore();
  });
});

describe("addCommunity", () => {
  it("inserts the community with a generated id", async () => {
    await postgresClient.addCommunity({ community: { name: "room" } });

    const [query, values] = mockClient.query.mock.calls[0];
    const [generatedId, insertedData] = values;
    expect(query).toContain("INSERT INTO communities");
    expect(generatedId).toEqual(expect.any(String));
    expect(insertedData).toEqual({ name: "room", id: generatedId });
  });
});

describe("getCommunityById", () => {
  it("selects by id", async () => {
    await postgresClient.getCommunityById({ id: "c1" });

    const [query, values] = mockClient.query.mock.calls[0];
    expect(query).toContain("SELECT * FROM communities where id = $1");
    expect(values).toEqual(["c1"]);
  });
});

describe("joinCommunity", () => {
  it("appends the citizen as a jsonb array element", async () => {
    await postgresClient.joinCommunity({
      communityId: "c1",
      username: "sam",
      userId: "u1",
      userColor: "#fff",
      userType: "voter",
      votingMember: true,
    });

    const [query, values] = mockClient.query.mock.calls[0];
    expect(query).toContain("jsonb_set");
    expect(JSON.parse(values[0])).toEqual([
      {
        username: "sam",
        userId: "u1",
        userType: "voter",
        votingMember: true,
        userColor: "#fff",
      },
    ]);
    expect(values[1]).toBe("c1");
  });
});

describe("submitVote", () => {
  it("serializes the vote and defaults doubleVote to false", async () => {
    await postgresClient.submitVote({
      communityId: "c1",
      userId: "u1",
      vote: 5,
    });

    const [, values] = mockClient.query.mock.calls[0];
    expect(values).toEqual(["c1", "u1", "5", false]);
  });

  it("passes string votes and the doubleVote flag through", async () => {
    await postgresClient.submitVote({
      communityId: "c1",
      userId: "u1",
      vote: "XL",
      doubleVote: true,
    });

    const [, values] = mockClient.query.mock.calls[0];
    expect(values).toEqual(["c1", "u1", '"XL"', true]);
  });
});

describe("timers", () => {
  it("startTimer stores a running timer blob", async () => {
    const timerEnd = new Date("2026-01-01T00:01:00Z");

    await postgresClient.startTimer({
      communityId: "c1",
      timerLength: 60,
      timerEnd,
    });

    const [, values] = mockClient.query.mock.calls[0];
    expect(JSON.parse(values[0])).toEqual({
      running: true,
      value: 60,
      timerEnd: timerEnd.toISOString(),
    });
    expect(values[1]).toBe("c1");
  });

  it("stopTimer stops the timer and reveals the votes", async () => {
    await postgresClient.stopTimer({ communityId: "c1" });

    const [query, values] = mockClient.query.mock.calls[0];
    expect(query).toContain("'{revealed}', 'true'");
    expect(JSON.parse(values[0])).toEqual({ running: false });
  });

  it("cancelTimer stops the timer without revealing", async () => {
    await postgresClient.cancelTimer({ communityId: "c1" });

    const [query, values] = mockClient.query.mock.calls[0];
    expect(query).not.toContain("revealed");
    expect(JSON.parse(values[0])).toEqual({ running: false });
  });
});

describe("deleteCommunity", () => {
  it("deletes by community id", async () => {
    await postgresClient.deleteCommunity({ community: { id: "c1" } });

    const [query, values] = mockClient.query.mock.calls[0];
    expect(query).toContain("DELETE FROM communities");
    expect(values).toEqual(["c1"]);
  });
});
