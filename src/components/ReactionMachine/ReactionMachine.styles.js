export const TRAJECTORIES = [
  { left: "40%", scale: 7 },
  { left: "30%", scale: 6 },
  { left: "50%", scale: 5 },
  { left: "60%", scale: 4 },
  { left: "70%", scale: 5 },
  { left: "20%", scale: 6 },
];

export const reactionOverlaySx = {
  position: "fixed",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 8,
};

export const floatingReactionSx = (variant) => {
  const { left, scale } = TRAJECTORIES[variant];

  return {
    position: "absolute",
    left: "50%",
    top: "90%",
    fontSize: "3rem",
    animation: `reaction-float-${variant} 3s ease-in-out`,
    [`@keyframes reaction-float-${variant}`]: {
      "0%": {
        top: "90%",
        opacity: 1,
        left: "50%",
        transform: "translate(-50%, -50%) scale(1)",
      },
      "100%": {
        top: "0%",
        opacity: 0,
        left,
        transform: `translate(-50%, -50%) scale(${scale})`,
      },
    },
  };
};
