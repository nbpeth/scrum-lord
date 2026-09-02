import { ThemeProvider } from "@mui/material";
import { renderToString } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { darkTheme } from "../../theme";
import { CommunityControls } from "./CommunityControls";

const noop = () => {};

// MUI's ThemeProvider and ButtonBase use useLayoutEffect, which React always
// warns about under renderToString. Keep that noise out without hiding real errors.
const SSR_LAYOUT_EFFECT_WARNING = "useLayoutEffect does nothing on the server";

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((...args) => {
    if (typeof args[0] === "string" && args[0].includes(SSR_LAYOUT_EFFECT_WARNING)) {
      return;
    }
    console.info(...args);
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

const render = (props) =>
  renderToString(
    <ThemeProvider theme={darkTheme}>
      <CommunityControls
        handleReveal={noop}
        handleReset={noop}
        handleTimerClicked={noop}
        communityId="c1"
        submitVote={noop}
        communityReaction={noop}
        settings={{ reactionsVisible: true, timerVisible: true }}
        {...props}
      />
    </ThemeProvider>
  );

const voter = {
  userId: "u1",
  username: "sam",
  userColor: "#fff",
  userType: "voter",
  votingMember: true,
};

const idleCommunity = {
  id: "c1",
  pointScheme: "fibonacci",
  revealed: false,
  citizens: [voter],
  timer: { running: false },
};

describe("CommunityControls", () => {
  it("renders nothing until you have joined", () => {
    expect(render({ iAmCitizen: null, community: idleCommunity })).toBe("");
  });

  it("shows the vote trigger and an idle timer", () => {
    const html = render({ iAmCitizen: voter, community: idleCommunity });

    expect(html).toContain('id="vote-button"');
    expect(html).toContain("Vote");
    expect(html).toContain('id="timer-button"');
    expect(html).toContain("1:00");
  });

  it("shows the cast vote on the trigger instead of the Vote label", () => {
    const html = render({
      iAmCitizen: voter,
      community: {
        ...idleCommunity,
        citizens: [{ ...voter, vote: 8, hasVoted: true }],
      },
    });

    expect(html).toContain('id="vote-button"');
    expect(html).toContain(">8<");
  });

  it("swaps the timer for a live countdown while running", () => {
    const html = render({
      iAmCitizen: voter,
      community: {
        ...idleCommunity,
        timer: {
          running: true,
          value: 60,
          timerEnd: new Date(Date.now() + 42000).toISOString(),
        },
      },
    });

    expect(html).toContain('id="timer-countdown"');
    expect(html).not.toContain('id="timer-button"');
  });

  it("hides the vote trigger from non-voting members", () => {
    const html = render({
      iAmCitizen: { ...voter, votingMember: false, userType: "scrumlord" },
      community: idleCommunity,
    });

    expect(html).not.toContain('id="vote-button"');
  });
});
