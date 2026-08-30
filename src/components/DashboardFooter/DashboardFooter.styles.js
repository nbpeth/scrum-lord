export const footerBarSx = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  px: 2,
  py: 1.5,
  pointerEvents: "none",
  "& > *": { pointerEvents: "auto" },
};

export const versionSx = {
  fontFamily: "monospace",
  color: "text.disabled",
};

export const footerLinkSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  fontSize: "0.75rem",
  color: "text.secondary",
  transition: "color 0.2s ease",
  "&:hover": { color: "text.primary" },
};

export const coffeeLinkStyle = { display: "block", lineHeight: 0 };

export const coffeeImageStyle = { height: 32, display: "block" };
