import { alpha } from "@mui/material";

export const countdownWrapSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 0.5,
  minWidth: 84,
  flexShrink: 0,
};

export const countdownButtonSx = (tone, urgent) => (theme) => ({
  textTransform: "none",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  fontSize: "0.95rem",
  px: 1.25,
  py: 0.3,
  minWidth: 0,
  borderRadius: 1.5,
  lineHeight: 1.5,
  color: theme.palette[tone].main,
  borderColor: alpha(theme.palette[tone].main, 0.6),
  "&:hover": {
    borderColor: theme.palette[tone].main,
    backgroundColor: alpha(theme.palette[tone].main, 0.1),
  },
  ...(urgent && {
    animation: "countdown-pulse 1s ease-in-out infinite",
    "@keyframes countdown-pulse": {
      "0%, 100%": { opacity: 1 },
      "50%": { opacity: 0.55 },
    },
  }),
});

export const countdownIconSx = { fontSize: 16 };

export const countdownProgressSx = (theme) => ({
  height: 3,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
});
