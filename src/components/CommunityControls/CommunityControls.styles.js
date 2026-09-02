import { alpha } from "@mui/material";

export const controlButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  px: 1.25,
  py: 0.35,
  boxShadow: "none",
  whiteSpace: "nowrap",
};

export const controlsPanelSx = (theme) => ({
  py: 0.75,
  px: { xs: 1, sm: 1.25 },
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: "blur(10px)",
  boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
});

export const controlsLayoutSx = (showReactions) => ({
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  justifyContent: showReactions
    ? { xs: "flex-start", sm: "space-between" }
    : { xs: "flex-start", sm: "flex-end" },
  gap: { xs: 1.25, sm: 2 },
  width: "100%",
  flexWrap: "wrap",
});

export const mainControlsSx = (showReactions) => ({
  justifyContent: { xs: "flex-start", sm: "flex-end" },
  flex: { sm: showReactions ? "1 1 auto" : "0 1 auto" },
  minWidth: 0,
  columnGap: 1,
  rowGap: 1,
});

export const voteGroupSx = { flexShrink: 0 };

export const voteTriggerSx = {
  ...controlButtonSx,
  minWidth: 72,
  px: 1.5,
  fontSize: "0.95rem",
  fontWeight: 700,
};

export const voteTriggerIconSx = { fontSize: 16 };

export const voteDeckSx = (theme) => ({
  mt: 0.75,
  p: 1,
  maxHeight: 300,
  overflowY: "auto",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  backgroundImage: "none",
});

export const voteDeckGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 52px)",
  gap: 0.75,
};

export const voteCardSx = (selected) => (theme) => ({
  height: 44,
  borderRadius: 1.5,
  fontWeight: 700,
  fontSize: "0.95rem",
  lineHeight: 1,
  border: "1px solid",
  borderColor: selected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.85),
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.22)
    : alpha(theme.palette.background.default, 0.5),
  color: selected ? theme.palette.primary.light : theme.palette.text.primary,
  transition: theme.transitions.create(
    ["transform", "background-color", "border-color"],
    { duration: theme.transitions.duration.shortest }
  ),
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.14),
  },
  "&.Mui-focusVisible": {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.14),
  },
});

export const resetButtonSx = (theme) => ({
  ...controlButtonSx,
  borderColor: alpha(theme.palette.warning.main, 0.55),
  "&:hover": {
    borderColor: "warning.main",
    backgroundColor: alpha(theme.palette.warning.main, 0.08),
  },
});

export const revealButtonSx = (theme) => ({
  ...controlButtonSx,
  "&:hover": {
    boxShadow: `0 2px 10px ${alpha(theme.palette.success.main, 0.35)}`,
  },
});

export const timerGroupSx = { flexShrink: 0 };

export const timerStartButtonSx = (theme) => ({
  ...controlButtonSx,
  fontVariantNumeric: "tabular-nums",
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  "&:hover": {
    boxShadow: `0 2px 10px ${alpha(theme.palette.secondary.main, 0.3)}`,
  },
});

export const timerPresetsToggleSx = {
  ...controlButtonSx,
  px: 0.5,
  minWidth: 28,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
};

export const timerIconSx = { fontSize: 16 };

export const timerPresetsPaperSx = (theme) => ({
  mt: 0.75,
  p: 1,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  backgroundImage: "none",
});

export const timerPresetRowSx = { display: "flex", gap: 0.75 };

export const timerPresetSx = (theme) => ({
  minWidth: 46,
  px: 1,
  py: 0.5,
  borderRadius: 1.5,
  fontWeight: 700,
  fontSize: "0.8rem",
  fontVariantNumeric: "tabular-nums",
  border: "1px solid",
  borderColor: alpha(theme.palette.divider, 0.85),
  color: theme.palette.text.primary,
  transition: theme.transitions.create(
    ["transform", "background-color", "border-color"],
    { duration: theme.transitions.duration.shortest }
  ),
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: theme.palette.secondary.main,
    backgroundColor: alpha(theme.palette.secondary.main, 0.14),
  },
});

export const timerCustomRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  mt: 1,
  pt: 1,
  borderTop: "1px solid",
  borderColor: "divider",
};

export const timerInputSx = {
  width: 72,
  flexShrink: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    "& input": { py: 0.5 },
  },
};

export const timerInputProps = {
  style: { textAlign: "center" },
  min: 1,
  max: 600,
};
