import { describe, expect, it } from "vitest";
import {
  DEFAULT_USER_TYPE,
  UserTypes,
  isScrumLord,
  userTypeOptions,
  votingMemberFor,
} from "./userTypes";

describe("votingMemberFor", () => {
  it("makes voters voting members", () => {
    expect(votingMemberFor(UserTypes.voter)).toBe(true);
  });

  it("keeps scrum lords out of the vote", () => {
    expect(votingMemberFor(UserTypes.scrumLord)).toBe(false);
  });

  it("treats an unknown type as non-voting", () => {
    expect(votingMemberFor(undefined)).toBe(false);
  });
});

describe("isScrumLord", () => {
  it("identifies a scrum lord citizen", () => {
    expect(isScrumLord({ userType: UserTypes.scrumLord })).toBe(true);
  });

  it("does not claim legacy non-voting citizens as scrum lords", () => {
    expect(isScrumLord({ votingMember: false })).toBe(false);
    expect(isScrumLord(undefined)).toBe(false);
  });
});

describe("userTypeOptions", () => {
  it("offers both types with the voter as the default", () => {
    expect(userTypeOptions.map(({ value }) => value)).toEqual([
      UserTypes.voter,
      UserTypes.scrumLord,
    ]);
    expect(DEFAULT_USER_TYPE).toBe(UserTypes.voter);
  });
});
