import { alpha } from "@mui/material";

export const EXPANDED_WIDTH = 196;
export const COLLAPSED_WIDTH = 52;

export const sidePanelSx = (collapsed) => (theme) => ({
  flexShrink: 0,
  width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
  transition: theme.transitions.create("width", {
    duration: theme.transitions.duration.shorter,
  }),
  alignSelf: "stretch",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRight: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
});

export const sidePanelHeaderSx = (theme) => ({
  px: 1,
  py: 0.75,
  minHeight: 40,
  borderBottom: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.7),
  background: alpha(theme.palette.background.default, 0.35),
});

export const sidePanelTitleSx = {
  flex: 1,
  minWidth: 0,
  fontWeight: 700,
  lineHeight: 1.6,
  letterSpacing: "0.08em",
  color: "text.secondary",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

export const collapseButtonSx = {
  flexShrink: 0,
  color: "text.secondary",
  "&:hover": { color: "text.primary" },
};

export const sidePanelBodySx = (collapsed) => ({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  px: collapsed ? 0.5 : 1.25,
  py: 1.25,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
});
