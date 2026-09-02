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

export const userTypeRowSx = { width: "100%", flexWrap: "wrap" };

export const userTypeHelpSx = {
  display: "inline-flex",
  alignItems: "center",
  color: "text.secondary",
  cursor: "default",
  ml: 0.25,
};

export const userTypeHelpIconSx = { fontSize: 16 };

export const userTypeGroupSx = {
  width: "100%",
  gap: 1,
  "& .MuiToggleButtonGroup-grouped": {
    flex: 1,
    minWidth: 0,
    margin: 0,
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 1.5,
    "&:not(:first-of-type)": {
      borderLeft: "1px solid",
      borderColor: "divider",
    },
  },
};

export const userTypeButtonSx = (theme) => ({
  textTransform: "none",
  display: "block",
  textAlign: "left",
  px: 1.5,
  py: 1.125,
  color: "text.secondary",
  "&.Mui-selected": {
    color: "text.primary",
    borderColor: alpha(theme.palette.primary.main, 0.7),
    backgroundColor: alpha(theme.palette.primary.main, 0.14),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  },
});

export const userTypeIconSx = { fontSize: 18 };

export const userTypeDescriptionSx = { display: "block", lineHeight: 1.35 };

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

export const colorFieldSx = { width: "100%" };

export const colorValueSx = {
  ml: "auto",
  fontFamily: "monospace",
  color: "text.disabled",
};

export const colorGridSx = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(26px, 1fr))",
  gap: 1,
};

export const colorSwatchSx = (color, selected) => (theme) => {
  const ring = `0 0 0 2px ${theme.palette.background.default}, 0 0 0 4px ${color}`;

  return {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    backgroundColor: color,
    transition: theme.transitions.create(["transform", "box-shadow"], {
      duration: theme.transitions.duration.shortest,
    }),
    boxShadow: selected
      ? ring
      : `0 0 0 1px ${alpha(theme.palette.common.black, 0.35)}`,
    ...(selected && { transform: "scale(1.08)" }),
    "&:hover": { transform: "scale(1.18)" },
    "&.Mui-focusVisible": { boxShadow: ring, transform: "scale(1.08)" },
  };
};
