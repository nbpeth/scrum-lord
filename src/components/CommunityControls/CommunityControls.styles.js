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

export const voteSelectFormControlSx = { minWidth: 76, maxWidth: 110 };

export const voteSelectSx = (theme) => ({
  borderRadius: 1,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.divider, 0.85),
  },
  "& .MuiSelect-select": { py: 0.45 },
});

export const voteMenuProps = { PaperProps: { style: { maxHeight: 320 } } };

export const voteButtonSx = { ...controlButtonSx, px: 1.5 };

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

export const timerButtonSx = (theme) => ({
  ...controlButtonSx,
  "&:hover": {
    boxShadow: `0 2px 10px ${alpha(theme.palette.secondary.main, 0.3)}`,
  },
});

export const timerInputSx = {
  width: 64,
  flexShrink: 0,
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
    "& input": { py: 0.65 },
  },
};

export const timerInputProps = {
  style: { textAlign: "center" },
  min: 1,
  max: 600,
};

export const timerDisplayBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 40,
};

export const timerErrorSx = { width: "100%" };
