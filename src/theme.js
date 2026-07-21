import { alpha, createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const glassSx =
  (opacity = 0.6) =>
  (theme) => ({
    background: alpha(theme.palette.background.default, opacity),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: theme.palette.divider,
  });

export const modalCardSx = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const controlButtonSx = {
  textTransform: "none",
  fontWeight: 600,
  px: 1.25,
  py: 0.35,
  boxShadow: "none",
  whiteSpace: "nowrap",
};
