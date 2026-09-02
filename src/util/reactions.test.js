import { describe, expect, it } from "vitest";
import {
  OVERFLOW_REACTIONS,
  PINNED_REACTIONS,
  REACTION_EMOJI,
  REACTION_EVENTS,
  reactionEmojiFor,
} from "./reactions";

describe("pinned and overflow reactions", () => {
  it("covers every reaction exactly once", () => {
    expect([...PINNED_REACTIONS, ...OVERFLOW_REACTIONS].sort()).toEqual(
      [...REACTION_EVENTS].sort()
    );
  });

  it("pins only reactions that have an emoji", () => {
    PINNED_REACTIONS.forEach((event) => {
      expect(REACTION_EMOJI[event]).toBeDefined();
    });
  });

  it("keeps the pinned set small enough to sit inline", () => {
    expect(PINNED_REACTIONS.length).toBeLessThanOrEqual(4);
  });
});

describe("reactionEmojiFor", () => {
  it("resolves a known reaction", () => {
    expect(reactionEmojiFor("party")).toBe("🎉");
  });

  it("falls back for an unknown reaction", () => {
    expect(reactionEmojiFor("nope")).toBe("🤷");
  });
});
