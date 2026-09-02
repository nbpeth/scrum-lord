import { ThemeProvider, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { darkTheme } from "../../theme";

const stubMatchMedia = (width) => {
  window.matchMedia = vi.fn().mockImplementation((query) => {
    const max = /max-width:\s*([\d.]+)px/.exec(query);
    const min = /min-width:\s*([\d.]+)px/.exec(query);
    const matches =
      (max ? width <= Number(max[1]) : true) &&
      (min ? width >= Number(min[1]) : true);

    return {
      matches,
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  });
};

// Mirrors how Community.jsx decides the panel's collapsed state.
const Probe = ({ onRender }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const isNarrow = useMediaQuery(theme.breakpoints.down("lg"), { noSsr: true });
  const [collapsedOverride] = useState(null);
  const collapsed = collapsedOverride ?? isNarrow;

  onRender({ isMobile, collapsed });
  return null;
};

const renderProbe = () => {
  const renders = [];
  const container = document.createElement("div");
  document.body.appendChild(container);

  act(() => {
    createRoot(container).render(
      <ThemeProvider theme={darkTheme}>
        <Probe onRender={(state) => renders.push(state)} />
      </ThemeProvider>
    );
  });

  return renders;
};

afterEach(() => {
  delete window.matchMedia;
});

describe("mobile side panel default", () => {
  it("asks for the breakpoint we think it does", () => {
    expect(darkTheme.breakpoints.down("md")).toBe("@media (max-width:899.95px)");
  });

  it("collapses on the very first render at phone width", () => {
    stubMatchMedia(390);
    const renders = renderProbe();

    expect(renders[0]).toEqual({ isMobile: true, collapsed: true });
  });

  it("collapses at tablet width, where the columns have not stacked yet", () => {
    stubMatchMedia(1024);
    const renders = renderProbe();

    expect(renders[0]).toEqual({ isMobile: false, collapsed: true });
  });

  it("stays expanded on the first render at desktop width", () => {
    stubMatchMedia(1440);
    const renders = renderProbe();

    expect(renders[0]).toEqual({ isMobile: false, collapsed: false });
  });
});
