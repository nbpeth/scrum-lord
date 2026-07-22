import { alpha } from "@mui/material";

export const backdropSx = (theme) => ({
  backgroundColor: alpha(theme.palette.common.black, 0.48),
});

export const modalViewportSx = {
  position: "fixed",
  inset: 0,
  outline: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  p: { xs: 1.5, sm: 2 },
};

export const dialogPaperSx = (theme) => ({
  position: "relative",
  zIndex: 1,
  pointerEvents: "auto",
  width: { xs: "calc(100% - 32px)", sm: 420 },
  maxWidth: "100%",
  maxHeight: "90vh",
  overflow: "auto",
  p: 3,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.default, 0.92),
  boxShadow: `0 16px 48px ${alpha(theme.palette.common.black, 0.45)}`,
  outline: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
});

export const dialogBodySx = { width: "100%", boxSizing: "border-box" };

export const dialogTitleSx = { width: "100%", textAlign: "left" };

export const fieldStackSx = { width: "100%" };

export const usernameRowSx = { width: "100%" };

export const usernameFieldSx = { flex: 1, minWidth: 0 };

export const refreshNameIconSx = {
  flexShrink: 0,
  cursor: "pointer",
  color: "text.secondary",
  "&:hover": { color: "primary.main" },
};

export const votingMemberRowSx = { width: "100%", flexWrap: "wrap" };

export const votingMemberHelpSx = {
  display: "inline-flex",
  alignItems: "center",
  color: "text.secondary",
  cursor: "default",
  ml: 0.25,
};

export const votingMemberHelpIconSx = { fontSize: 16 };

export const actionRowSx = {
  width: "100%",
  pt: 2.5,
  mt: 0.5,
  borderTop: "1px solid",
  borderColor: "divider",
  boxSizing: "border-box",
};

export const cancelButtonSx = (theme) => ({
  textTransform: "none",
  fontWeight: 600,
  px: 2,
  py: 0.875,
  borderRadius: 1.5,
  borderColor: alpha(theme.palette.error.main, 0.65),
  color: "error.main",
  "&:hover": {
    borderColor: "error.main",
    backgroundColor: alpha(theme.palette.error.main, 0.08),
  },
});

export const joinButtonSx = (theme) => ({
  textTransform: "none",
  fontWeight: 600,
  px: 2.25,
  py: 0.875,
  borderRadius: 1.5,
  boxShadow: "none",
  minWidth: 120,
  "&:hover": {
    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.42)}`,
  },
  "&.Mui-disabled": {
    boxShadow: "none",
  },
});

export const joinButtonIconSx = { fontSize: 18 };

export const colorMenuSx = (theme) => ({
  maxHeight: 360,
  background: alpha(theme.palette.background.default, 0.95),
  backdropFilter: "blur(12px)",
  border: "1px solid",
  borderColor: "divider",
});

export const colorSwatchSx = (color) => ({
  height: 12,
  width: 12,
  borderRadius: 0.5,
  backgroundColor: color,
  border: "1px solid",
  borderColor: "divider",
});
