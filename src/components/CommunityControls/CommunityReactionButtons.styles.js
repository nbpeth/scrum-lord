import { alpha } from "@mui/material";

export const reactionRowSx = (theme) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  alignSelf: { xs: "flex-start", sm: "center" },
  gap: 0.5,
  flexShrink: 0,
  pb: { xs: 1, sm: 0 },
  mb: { xs: 0.25, sm: 0 },
  pr: { sm: 1.5 },
  mr: { sm: 0.5 },
  borderBottom: {
    xs: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
    sm: "none",
  },
  borderRight: {
    sm: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
  },
});

export const reactionButtonSx = (theme) => ({
  minWidth: 30,
  width: 30,
  height: 30,
  minHeight: 30,
  p: 0,
  fontSize: "0.95rem",
  lineHeight: 1,
  borderRadius: 1,
  borderColor: alpha(theme.palette.divider, 0.85),
  "&:hover": {
    borderColor: "primary.main",
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
});
