import { alpha } from "@mui/material";

const REVEAL_KEYFRAMES = [
  {
    "0%": { transform: "perspective(300px) rotateY(0deg)" },
    "100%": { transform: "perspective(300px) rotateY(180deg)" },
  },
  {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  {
    "0%": { opacity: 0, transform: "translateY(50px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.5)" },
    "100%": { transform: "scale(1)" },
  },
  {
    "0%, 100%": { filter: "blur(0px)" },
    "50%": { filter: "blur(1000px)" },
  },
];

export const REVEAL_VARIANT_COUNT = REVEAL_KEYFRAMES.length;

export const citizenVoteBackground = ({ theme, hasVoted, doubleVote }) => {
  if (!hasVoted) {
    return "none";
  }
  return alpha(
    doubleVote ? theme.palette.warning.dark : theme.palette.primary.dark,
    0.8
  );
};

export const citizenCardSx =
  ({
    isMyCard,
    backgroundColor,
    userColor,
    cardAnimating,
    animationClassPosition,
  }) =>
  (theme) => ({
    padding: { xs: "5px 3px 4px", sm: "9px 10px 10px" },
    minWidth: 0,
    border: `1px solid ${
      isMyCard ? theme.palette.primary.dark : theme.palette.grey[800]
    }`,
    borderTop: `4px solid ${userColor ?? theme.palette.grey[700]}`,
    backgroundColor,
    cursor: "pointer",
    transition: "background .5s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.grey[800],
    },
    ...(cardAnimating && {
      animation: `citizen-card-reveal-${animationClassPosition} 2s ease-in-out`,
      [`@keyframes citizen-card-reveal-${animationClassPosition}`]:
        REVEAL_KEYFRAMES[animationClassPosition] ?? REVEAL_KEYFRAMES[0],
    }),
  });

export const cardContentVisibilitySx = (contentHidden) => ({
  display: "block",
  opacity: contentHidden ? 0 : 1,
  visibility: contentHidden ? "hidden" : "visible",
  transition: "opacity 500ms ease-in",
});

export const cardContentSx = {
  padding: { xs: "2px", sm: "5px" },
  "&:last-child": { paddingBottom: { xs: "2px", sm: "5px" } },
  textAlign: "center",
  minWidth: 0,
};

export const citizenNameSx = (userColor) => (theme) => ({
  display: { xs: "none", sm: "block" },
  fontWeight: "bold",
  color: userColor ?? theme.palette.grey[100],
  fontSize: { xs: "0.75rem", sm: "1rem" },
  lineHeight: 1.4,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const cardActionsRowSx = {
  display: "flex",
  justifyContent: "center",
  pt: { xs: 0, sm: 0.25 },
};

export const deleteIconSx = (isMyCard) => ({
  fontSize: { xs: 15, sm: 20 },
  ...(isMyCard
    ? { cursor: "default", opacity: 0, pointerEvents: "none" }
    : { cursor: "pointer" }),
});

export const voteValueSx = {
  fontWeight: "bold",
  lineHeight: 1.1,
  fontSize: { xs: "1.5rem", sm: "3rem" },
};
