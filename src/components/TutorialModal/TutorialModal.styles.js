import { alpha } from "@mui/material";

export const tutorialPaperSx = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  maxHeight: "min(85vh, 720px)",
  width: "min(92vw, 520px)",
  maxWidth: "100%",
  borderRadius: 3,
  overflow: "hidden",
  outline: "none",
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.9),
  background: alpha(theme.palette.background.paper, 0.92),
  backdropFilter: "blur(12px)",
  boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.45)}`,
});

export const headerStackSx = { p: 2.5, pb: 1.5 };

export const stepCountSx = {
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  mb: 0.5,
};

export const closeButtonSx = { color: "text.secondary", mt: -0.5 };

export const bodySx = { px: 2.5, pb: 1, overflow: "auto" };

export const bodyTextSx = { minHeight: 78 };

export const illustrationSx = (theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 200,
  mb: 2,
  p: 2,
  borderRadius: 2,
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.6),
  background: alpha(theme.palette.common.black, 0.25),
  pointerEvents: "none",
  userSelect: "none",
});

export const startButtonPreviewSx = (theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 128,
  height: 128,
  borderRadius: "50%",
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: alpha(theme.palette.background.default, 0.96),
  boxShadow: `0px 5px 60px 20px ${alpha("rgb(65, 105, 225)", 0.45)}`,
});

export const previewLogoStyle = { height: 76, width: 76 };

export const mockPanelSx = { width: "100%", maxWidth: 320 };

export const mockFieldSx = (theme) => ({
  flexGrow: 1,
  px: 1.5,
  py: 1,
  borderRadius: 1,
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.9),
  background: alpha(theme.palette.background.paper, 0.7),
});

export const mockFilledButtonSx = (color) => (theme) => ({
  px: 1.5,
  py: 1,
  borderRadius: 1,
  textAlign: "center",
  bgcolor: theme.palette[color].main,
  color: theme.palette[color].contrastText,
  fontWeight: 600,
  whiteSpace: "nowrap",
});

export const mockOutlineButtonSx = (color) => (theme) => ({
  px: 1.5,
  py: 1,
  borderRadius: 1,
  textAlign: "center",
  border: "1px solid",
  borderColor: theme.palette[color].main,
  color: theme.palette[color].main,
  fontWeight: 600,
  whiteSpace: "nowrap",
});

export const mockRoomRowSx = (theme) => ({
  px: 1.5,
  py: 1,
  borderRadius: 1,
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.6),
  background: alpha(theme.palette.background.paper, 0.45),
});

export const mockFieldLabelSx = { display: "block", mb: 0.5 };

export const mockUrlBarSx = (theme) => ({
  px: 1.5,
  py: 1,
  borderRadius: 1,
  border: "1px solid",
  borderColor: alpha(theme.palette.warning.main, 0.7),
  background: alpha(theme.palette.background.paper, 0.7),
});

export const mockUrlTextSx = {
  fontFamily: "monospace",
  overflowWrap: "anywhere",
};

export const warningCalloutSx = (theme) => ({
  px: 1.5,
  py: 1,
  borderRadius: 1,
  border: "1px solid",
  borderColor: alpha(theme.palette.warning.main, 0.7),
  background: alpha(theme.palette.warning.main, 0.12),
  color: theme.palette.warning.main,
});

export const warningCalloutIconSx = { fontSize: 18, flexShrink: 0 };

export const connectionRowSx = { py: 0.75 };

export const mockMenuSx = (theme) => ({
  width: "100%",
  maxWidth: 300,
  py: 0.75,
  borderRadius: 1,
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.9),
  background: alpha(theme.palette.background.paper, 0.95),
});

export const mockMenuRowSx = { px: 1.5, py: 0.4 };

export const mockMenuLabelSx = { flexGrow: 1 };

export const mockMenuSectionLabelSx = {
  px: 1.5,
  color: "text.secondary",
  lineHeight: 2,
};

export const mockMenuDividerSx = { my: 0.75 };

export const mockMenuActionRowSx = { px: 1.5, py: 0.5 };

export const toggleIconSx = (on) => ({
  color: on ? "primary.main" : "text.disabled",
});

export const citizenTilesRowSx = { justifyContent: "center", width: "100%" };

export const citizenTileSx =
  ({ voted, doubleVote }) =>
  (theme) => ({
    width: 78,
    py: 1,
    borderRadius: 1,
    textAlign: "center",
    border: "1px solid",
    borderColor: voted ? theme.palette.primary.dark : theme.palette.grey[800],
    bgcolor: voted
      ? alpha(
          doubleVote ? theme.palette.warning.dark : theme.palette.primary.dark,
          0.8
        )
      : "transparent",
  });

export const citizenTileVoteSx = { fontWeight: 700, lineHeight: 1.2 };

export const mockChipSx = (theme) => ({
  px: 1,
  py: 0.25,
  borderRadius: 4,
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.9),
  color: "text.secondary",
});

export const mockChipRowSx = { flexWrap: "wrap", gap: 0.75 };

export const mockChipSelectedSx = (theme) => ({
  ...mockChipSx(theme),
  borderColor: alpha(theme.palette.primary.main, 0.7),
  backgroundColor: alpha(theme.palette.primary.main, 0.14),
  color: "text.primary",
});

export const colorSwatchPreviewSx = (color) => ({
  width: 16,
  height: 16,
  borderRadius: "50%",
  bgcolor: color,
});

export const timerReadoutSx = (theme) => ({
  px: 1.5,
  py: 1,
  borderRadius: 1,
  fontFamily: "monospace",
  fontWeight: 700,
  color: theme.palette.warning.main,
});

export const footerStackSx = { p: 2.5, pt: 1.5 };

export const dotsRowSx = { flexGrow: 1, justifyContent: "center" };

export const dotSx = (active) => (theme) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  transition: "background-color 0.2s ease, transform 0.2s ease",
  bgcolor: active ? "primary.main" : alpha(theme.palette.text.primary, 0.25),
  transform: active ? "scale(1.25)" : "none",
});
