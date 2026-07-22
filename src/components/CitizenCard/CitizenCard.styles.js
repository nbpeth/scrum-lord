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
  ({ isMyCard, backgroundColor, cardAnimating, animationClassPosition }) =>
  (theme) => ({
    padding: "10px",
    minWidth: "100px",
    border: `1px solid ${
      isMyCard ? theme.palette.primary.dark : theme.palette.grey[800]
    }`,
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

export const cardContentVisibilitySx = (contentHidden) =>
  contentHidden
    ? { visibility: "hidden" }
    : {
        animation: "citizen-card-content-show 500ms ease-in forwards",
        "@keyframes citizen-card-content-show": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      };

export const desktopCardContentSx = { padding: "5px", textAlign: "center" };

export const deleteIconSx = (isMyCard) =>
  isMyCard ? { cursor: "none", opacity: 0 } : { cursor: "pointer" };

export const voteValueSx = { fontWeight: "bold" };
