import { alpha } from "@mui/material";

export const communityPageSx = {
  minHeight: "100dvh",
  height: "100%",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateRows: "auto 1fr",
  overflowX: "hidden",
  textAlign: "initial",
};

export const stickyHeaderSx = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  width: "100%",
};

export const controlsBarSx = (theme) => ({
  px: { xs: 1.5, sm: 2 },
  py: 1.5,
  borderBottom: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.default, 0.72),
  backdropFilter: "blur(12px)",
});

export const controlsBarInnerSx = { maxWidth: 1200, mx: "auto", width: "100%" };

export const mainGridSx = {
  minHeight: 0,
  height: "100%",
  pt: 2,
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  flexWrap: "wrap",
  alignItems: "stretch",
  alignContent: "stretch",
};

export const lurkerColumnSx = (showActivity) => ({
  paddingTop: { md: "10px" },
  pr: { md: showActivity ? 2 : undefined },
  minWidth: 0,
  maxWidth: "100%",
  height: { md: "100%" },
});

export const citizensColumnSx = (showActivity) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  height: { md: "100%" },
  pr: { md: showActivity ? 2 : undefined },
});

export const activityPanelSx =
  (communityAnimationEnabled) =>
  (theme) => ({
    background: alpha(
      theme.palette.background.default,
      communityAnimationEnabled ? 0.38 : 0.52
    ),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "divider",
    borderRadius: {
      xs: 2,
      md: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
    },
    borderRight: { md: "none" },
    borderBottom: { md: "none" },
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignSelf: { md: "stretch" },
    minHeight: { xs: 280, md: 0 },
    height: { xs: "auto", md: "100%" },
    maxHeight: { xs: "none", md: "100%" },
    pr: { md: 0 },
    mr: { md: 0 },
  });
