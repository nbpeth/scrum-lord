import { alpha } from "@mui/material";

export const roomListStackSx = { width: "100%" };

export const roomCardSx = (theme) => ({
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.paper, 0.55),
  backdropFilter: "blur(8px)",
  transition:
    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.35)}`,
    borderColor: alpha(theme.palette.primary.main, 0.45),
  },
});

export const roomCardActionSx = (theme) => ({
  textAlign: "left",
  px: 2,
  py: 1.75,
  "&.Mui-focusVisible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
});

export const roomNameBoxSx = { minWidth: 0, flex: 1 };

export const roomNameSx = (fullsizeScreen) => ({
  fontWeight: 600,
  fontSize: fullsizeScreen ? "1.1rem" : "1rem",
  color: "text.primary",
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: { xs: "normal", sm: "nowrap" },
});

export const lastActivitySx = { color: "text.secondary", mt: 0.5 };

export const idleChipSx = (theme) => ({
  flexShrink: 0,
  borderColor: alpha(theme.palette.warning.main, 0.5),
  color: "warning.light",
  bgcolor: alpha(theme.palette.warning.dark, 0.2),
});

export const idleChipIconSx = { fontSize: "1rem !important", opacity: 0.9 };

export const emptyDashSx = { py: 4, px: 2, textAlign: "center" };

export const emptyDashImageSx = {
  height: { xs: 100, sm: 120 },
  width: { xs: 100, sm: 120 },
  borderRadius: "50%",
  objectFit: "contain",
  opacity: 0.85,
};

export const emptyDashTitleSx = { color: "text.secondary", fontWeight: 500 };

export const emptyDashHintSx = { color: "text.disabled", maxWidth: 280 };
