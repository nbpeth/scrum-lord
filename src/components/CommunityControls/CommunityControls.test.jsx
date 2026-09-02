import { ThemeProvider } from "@mui/material";
import { renderToString } from "react-dom/server";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { darkTheme } from "../../theme";
import { CommunityControls } from "./CommunityControls";

const noop = () => {};

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

const stubWidth = (width) => {
  window.matchMedia = vi.fn().mockImplementation((query) => {
    const max = /max-width:\s*([\d.]+)px/.exec(query);
    return {
      matches: max ? width <= Number(max[1]) : true,
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  });
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

  describe("when the viewport is narrow", () => {
    afterEach(() => {
      delete window.matchMedia;
    });

    it("drops the labels on reset and reveal", () => {
      stubWidth(390);
      const html = render({ iAmCitizen: voter, community: idleCommunity });

      expect(html).toContain('aria-label="Reset"');
      expect(html).toContain('aria-label="Reveal"');
      expect(html).not.toContain(">Reset<");
      expect(html).not.toContain(">Reveal<");
    });

    it("folds every reaction into the tray", () => {
      stubWidth(390);
      const html = render({ iAmCitizen: voter, community: idleCommunity });

      expect(html).toContain('id="more-reactions-button"');
      expect(html).not.toContain('title="hotdog"');
    });

    it("shrinks the timer to a single icon", () => {
      stubWidth(390);
      const html = render({ iAmCitizen: voter, community: idleCommunity });

      expect(html).toContain('id="timer-presets-button"');
      expect(html).not.toContain('id="timer-button"');
    });

    it("keeps the labels at desktop width", () => {
      stubWidth(1440);
      const html = render({ iAmCitizen: voter, community: idleCommunity });

      expect(html).toContain(">Reset<");
      expect(html).toContain('id="timer-button"');
      expect(html).toContain('title="hotdog"');
    });
  });
});