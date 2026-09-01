import { alpha } from "@mui/material";

export const roomControlsSx = (compact) => ({
  width: "100%",
  minWidth: 0,
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: compact ? "center" : "stretch",
  gap: 1,
});

export const secondaryGroupSx = (compact) => ({
  width: "100%",
  pt: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: compact ? "center" : "stretch",
  gap: 1,
});

export const dangerSlotSx = (compact) => ({
  width: "100%",
  mt: "auto",
  pt: 1.5,
  borderTop: "1px solid",
  borderColor: "divider",
  display: "flex",
  flexDirection: "column",
  alignItems: compact ? "center" : "stretch",
});

export const identityRowSx = { minWidth: 0 };

export const identityDotSx = (userColor) => (theme) => {
  const dotColor = userColor ?? theme.palette.grey[600];

  return {
    width: 8,
    height: 8,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: dotColor,
    boxShadow: `0 0 6px ${alpha(dotColor, 0.75)}`,
  };
};

export const identityNameSx = {
  minWidth: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "text.secondary",
};

export const identityLabelSx = {
  display: "block",
  color: "text.disabled",
  lineHeight: 1.4,
};

export const roomActionButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  px: 1.5,
  py: 0.4,
  boxShadow: "none",
  whiteSpace: "nowrap",
};

export const roomIconButtonSx = {
  flexShrink: 0,
  color: "text.secondary",
  "&:hover": { color: "text.primary" },
};
