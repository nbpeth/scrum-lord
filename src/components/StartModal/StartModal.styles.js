import { alpha } from "@mui/material";

export const startModalPaperSx = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "min(78vh, 720px)",
  width: "min(92vw, 520px)",
  maxWidth: "100%",
  borderRadius: 3,
  overflow: "hidden",
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.9),
  background: alpha(theme.palette.background.paper, 0.92),
  backdropFilter: "blur(12px)",
  boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.45)}`,
});

export const headerStackSx = { p: 2.5, pb: 2 };

export const titleRowSx = { mb: 2 };

export const subtitleSx = { mt: 0.5 };

export const closeButtonSx = { color: "text.secondary", mt: -0.5 };

export const searchRowSx = { mb: 2 };

export const newRoomButtonSx = { height: "100%", py: 1.25, fontWeight: 600 };

export const roomListSx = {
  px: 2.5,
  pb: 2.5,
  overflow: "auto",
  maxHeight: "min(52vh, 440px)",
};
