import { alpha } from "@mui/material";

export const lurkerPanelSx = (theme) => ({
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  ml: { md: 1.5 },
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
  maxHeight: { md: "100%" },
});

export const lurkerHeaderSx = (theme) => ({
  px: 1.25,
  py: 0.75,
  cursor: "default",
  borderBottom: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.7),
  background: alpha(theme.palette.background.default, 0.35),
});

export const lurkerHeaderIconSx = {
  fontSize: 16,
  flexShrink: 0,
  color: "warning.main",
};

export const lurkerTitleSx = {
  flex: 1,
  minWidth: 0,
  fontWeight: 700,
  lineHeight: 1.6,
  letterSpacing: "0.08em",
  color: "text.secondary",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const lurkerCountSx = (theme) => ({
  flexShrink: 0,
  minWidth: 20,
  px: 0.625,
  borderRadius: 10,
  textAlign: "center",
  fontSize: 11,
  fontWeight: 700,
  lineHeight: "18px",
  color: theme.palette.warning.main,
  backgroundColor: alpha(theme.palette.warning.main, 0.16),
});

export const lurkerListSx = {
  flex: 1,
  minHeight: 0,
  py: 0.5,
  overflowX: "hidden",
  overflowY: "auto",
  maxHeight: { xs: 220, md: "none" },
};

export const lurkerRowSx = (theme) => ({
  px: 1.25,
  py: 0.5,
  minWidth: 0,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
  },
  "&:hover .lurker-remove, &:focus-within .lurker-remove": { opacity: 1 },
});

export const lurkerColorDotSx = (userColor) => (theme) => {
  const dotColor = userColor ?? theme.palette.grey[600];

  return {
    width: 8,
    height: 8,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: dotColor,
    boxShadow: `0 0 6px ${alpha(dotColor, 0.75)}`,
  };
};

export const lurkerNameSx = (theme) => ({
  flex: 1,
  minWidth: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: theme.palette.grey[300],
});

export const deleteLurkerIconSx = (theme) => ({
  flexShrink: 0,
  p: 0.25,
  fontSize: 16,
  color: theme.palette.grey[600],
  opacity: { xs: 1, md: 0 },
  transition: "opacity 150ms ease-in-out, color 150ms ease-in-out",
  "&:hover": { color: theme.palette.error.main },
});

export const lurkerEmptySx = {
  display: "block",
  px: 1.25,
  py: 0.75,
  color: "text.disabled",
};
