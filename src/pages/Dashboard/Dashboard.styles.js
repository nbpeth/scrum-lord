import { alpha } from "@mui/material";

export const dashboardPageSx = {
  position: "relative",
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
};

export const topBarSx = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  px: 2,
  py: 1.5,
  pointerEvents: "none",
  "& > *": { pointerEvents: "auto" },
};

export const tutorialButtonSx = {
  color: "text.secondary",
  "&:hover": { color: "text.primary" },
};

export const errorAlertSx = {
  position: "fixed",
  top: 56,
  left: 16,
  right: 16,
  zIndex: 10,
};

export const startButtonWrapperSx = {
  position: "relative",
  zIndex: 2,
  isolation: "isolate",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
};

export const startButtonSx = (theme) => ({
  fontFamily: "monospace",
  fontSize: ".8em",
  width: "35vh",
  height: "35vh",
  borderRadius: "50%",
  position: "relative",
  zIndex: 1,
  overflow: "visible",
  willChange: "transform",
  transition: "transform 1.5s ease-in-out",
  backgroundColor: alpha(theme.palette.background.default, 0.96),
  border: "1px solid",
  borderColor: "divider",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    pointerEvents: "none",
    transition: "opacity 1.5s ease-in-out",
  },
  "&::before": {
    boxShadow: `0px 5px 25vh 15vh ${alpha("rgb(65, 105, 225)", 0.5)}`,
    opacity: 1,
  },
  "&::after": {
    boxShadow: "0px 5px 50px 10px rgb(100, 200, 255)",
    opacity: 0,
  },
  "&:hover": {
    transform: "scale(1.3)",
    backgroundColor: alpha(theme.palette.background.default, 0.98),
    "&::before": { opacity: 0 },
    "&::after": { opacity: 1 },
  },
});

export const startButtonLogoStyle = { height: "20vh", width: "20vh" };
