import { alpha } from "@mui/material";

export const reactionRowSx = (theme) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 0.25,
  flexShrink: 0,
  pr: 1,
  mr: 0.25,
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.45)}`,
});

export const reactionButtonSx = (theme) => ({
  width: 28,
  height: 28,
  minWidth: 28,
  flexShrink: 0,
  p: 0,
  fontSize: "1rem",
  lineHeight: 1,
  borderRadius: "50%",
  transition: theme.transitions.create(["transform", "background-color"], {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": {
    transform: "scale(1.25)",
    backgroundColor: alpha(theme.palette.common.white, 0.08),
  },
  "&.Mui-focusVisible": {
    backgroundColor: alpha(theme.palette.common.white, 0.14),
  },
});

export const moreReactionsSx = (theme) => ({
  width: 28,
  height: 28,
  p: 0,
  ml: 0.25,
  flexShrink: 0,
  color: "text.disabled",
  transition: theme.transitions.create(["color", "background-color"], {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": {
    color: "primary.main",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
});

export const moreReactionsIconSx = { fontSize: 18 };

export const reactionTraySx = (theme) => ({
  mt: 0.75,
  p: 0.75,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  backgroundImage: "none",
});

export const reactionTrayGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 28px)",
  gap: 0.5,
};
