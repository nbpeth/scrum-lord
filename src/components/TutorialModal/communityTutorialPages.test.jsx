import { ThemeProvider } from "@mui/material";
import { renderToString } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { darkTheme } from "../../theme";
import { communityTutorialPages } from "./communityTutorialPages";

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

const renderArt = (art) =>
  renderToString(<ThemeProvider theme={darkTheme}>{art}</ThemeProvider>);

describe("communityTutorialPages", () => {
  it("gives every page a title, a body and art", () => {
    communityTutorialPages.forEach((page) => {
      expect(page.title).toBeTruthy();
      expect(page.body).toBeTruthy();
      expect(page.art).toBeTruthy();
    });
  });

  it.each(communityTutorialPages.map((page) => [page.title, page]))(
    "renders the art for %s",
    (_title, page) => {
      expect(renderArt(page.art)).not.toBe("");
    }
  );

  it("describes voting as picking from the deck", () => {
    const page = communityTutorialPages.find(
      ({ title }) => title === "Cast your vote"
    );

    expect(page.body).toContain("deck");
    expect(page.body).not.toContain("dropdown");
    expect(renderArt(page.art)).toContain("13");
  });

  it("describes the timer as a countdown you can cancel", () => {
    const page = communityTutorialPages.find(
      ({ title }) => title === "Put a clock on it"
    );

    expect(page.body).toContain("countdown");
    expect(renderArt(page.art)).toContain("0:42");
  });
});
