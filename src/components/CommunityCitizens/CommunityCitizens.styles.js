import { alpha } from "@mui/material";

export const citizensContainerSx = {
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  flex: 1,
  minHeight: 0,
  flexWrap: "nowrap",
  alignItems: "stretch",
  justifyContent: "flex-start",
};

export const voteCardContainerSx = {
  mt: 1.25,
  mx: 0,
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
};

export const emptyRoomSx = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 2,
  minHeight: { xs: 260, md: 0 },
};

export const emptyRoomCardSx = (theme) => ({
  width: "100%",
  maxWidth: 340,
  px: 3,
  py: 3.5,
  textAlign: "center",
  borderRadius: 2,
  background: alpha(theme.palette.background.paper, 0.35),
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
});

export const emptyRoomIconWrapSx = (theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 56,
  height: 56,
  borderRadius: "50%",
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  boxShadow: `0 0 24px ${alpha(theme.palette.primary.main, 0.22)}`,
});

export const emptyRoomIconSx = { fontSize: 28 };

export const emptyRoomTitleSx = {
  fontWeight: 600,
  letterSpacing: "0.01em",
  color: "text.secondary",
};

export const emptyRoomHintSx = {
  color: "text.disabled",
  lineHeight: 1.5,
};
