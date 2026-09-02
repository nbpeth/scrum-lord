import { alpha } from "@mui/material";

export const headerBarSx = (embedded) => (theme) => ({
  ...(embedded
    ? { position: "relative", zIndex: 1 }
    : { position: "sticky", top: 0, zIndex: 10 }),
  px: 2,
  py: 1,
  borderRadius: 0,
  background: alpha(theme.palette.background.default, 0.6),
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid",
  borderColor: "divider",
});

export const menuPaperSx = (theme) => ({
  width: 280,
  maxWidth: "100%",
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(10px)",
});

export const menuCaptionRowSx = { px: 2, py: 0.5, textAlign: "center" };

export const menuSectionLabelSx = {
  px: 2,
  color: "text.secondary",
  lineHeight: 2.5,
};

export const menuDividerSx = { my: 1 };

export const tutorialButtonSx = {
  color: "text.secondary",
  "&:hover": { color: "text.primary" },
};

export const roomTitleSx = (hotdogOverload) => (theme) => ({
  flex: 1,
  textAlign: "center",
  ...(hotdogOverload
    ? {
        fontSize: "clamp(1.45rem, 5vw, 2.5rem)",
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: "0.06em",
        color: theme.palette.warning.main,
        "@keyframes hotdog-overload-attn": {
          "0%, 100%": {
            textShadow: `0 0 16px ${alpha(
              theme.palette.warning.main,
              0.95
            )}, 0 0 36px ${alpha(theme.palette.warning.main, 0.45)}`,
          },
          "33%": {
            textShadow: `0 0 22px ${alpha(
              theme.palette.error.main,
              0.75
            )}, 0 0 52px ${alpha(theme.palette.warning.main, 0.55)}`,
          },
          "66%": {
            textShadow: `0 0 18px ${alpha(
              theme.palette.warning.light,
              1
            )}, 0 0 44px ${alpha(theme.palette.error.main, 0.35)}`,
          },
        },
        animation: "hotdog-overload-attn 1.05s ease-in-out infinite",
      }
    : {
        fontWeight: 600,
        color: "text.primary",
      }),
});
