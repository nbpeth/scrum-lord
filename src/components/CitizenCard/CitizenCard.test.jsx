import { ThemeProvider } from "@mui/material";
import { renderToString } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { darkTheme } from "../../theme";
import { CitizenCard } from "./CitizenCard";
import { citizenCardSx } from "./CitizenCard.styles";

const SSR_LAYOUT_EFFECT_WARNING = "useLayoutEffect does nothing on the server";

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(SSR_LAYOUT_EFFECT_WARNING)
    ) {
      return;
    }
    console.info(...args);
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

const citizen = {
  userId: "u1",
  username: "cheerfulOtter",
  userColor: "#4F90DA",
  vote: 8,
  hasVoted: true,
};

const render = (props) =>
  renderToString(
    <ThemeProvider theme={darkTheme}>
      <CitizenCard
        citizen={citizen}
        currentCommunity={{ revealed: false }}
        handleDeleteUser={() => {}}
        iAmCitizen={{ userId: "someone-else" }}
        position={0}
        animationClassPosition={0}
        {...props}
      />
    </ThemeProvider>
  );

describe("CitizenCard", () => {
  it("hides other people's votes before the reveal", () => {
    const html = render({});

    expect(html).toContain("cheerfulOtter");
    expect(html).toContain(">?<");
    expect(html).not.toContain(">8<");
  });

  it("shows your own vote before the reveal", () => {
    const html = render({ iAmCitizen: { userId: "u1" } });

    expect(html).toContain(">8<");
  });

  it("shows every vote once revealed", () => {
    const html = render({ currentCommunity: { revealed: true } });

    expect(html).toContain(">8<");
  });

  it("offers a remove control for other people but not yourself", () => {
    expect(render({})).toContain('aria-label="Remove cheerfulOtter"');
    expect(render({ iAmCitizen: { userId: "u1" } })).not.toContain(
      'aria-label="Remove cheerfulOtter"'
    );
  });

  it("renders a dash when someone has not voted", () => {
    const html = render({
      citizen: { ...citizen, vote: null, hasVoted: false },
      iAmCitizen: { userId: "u1" },
    });

    expect(html).toContain(">-<");
  });

  it("paints the identity stripe with the citizen colour", () => {
    const style = citizenCardSx({
      isMyCard: false,
      backgroundColor: "none",
      userColor: "#4F90DA",
    })(darkTheme);

    expect(style["&::before"].backgroundColor).toBe("#4F90DA");
  });

  it("falls back to a neutral stripe when a citizen has no colour", () => {
    const style = citizenCardSx({ isMyCard: false, backgroundColor: "none" })(
      darkTheme
    );

    expect(style["&::before"].backgroundColor).toBe(darkTheme.palette.grey[700]);
  });

  it("still marks your own card through the border", () => {
    const mine = citizenCardSx({ isMyCard: true, userColor: "#4F90DA" })(
      darkTheme
    );
    const theirs = citizenCardSx({ isMyCard: false, userColor: "#4F90DA" })(
      darkTheme
    );

    expect(mine.border).toContain(darkTheme.palette.primary.dark);
    expect(theirs.border).not.toContain(darkTheme.palette.primary.dark);
  });

  it("keeps the name in the markup for the tooltip when it is visually hidden", () => {
    const html = render({});

    expect(html).toContain("cheerfulOtter");
  });
});