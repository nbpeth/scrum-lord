export const statusContainerSx = (size) => ({
  position: "relative",
  width: size,
  height: size,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const statusRippleSx = ({ ringSize, color }) => ({
  position: "absolute",
  width: ringSize,
  height: ringSize,
  borderRadius: "50%",
  border: "2px solid",
  borderColor: color,
  animation: "status-ring 0.6s ease-out forwards",
  "@keyframes status-ring": {
    "0%": { transform: "scale(0.3)", opacity: 0.9 },
    "100%": { transform: "scale(1)", opacity: 0 },
  },
});

export const statusDotSx = ({ size, color, pulse }) => (theme) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  bgcolor: color,
  transition: "background-color 0.3s ease",
  boxShadow: `0 0 6px 2px ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.15)"
      : "rgba(0,0,0,0.1)"
  }`,
  ...(pulse && {
    animation: "status-pulse 2s ease-in-out infinite",
  }),
  "@keyframes status-pulse": {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.35 },
  },
});
