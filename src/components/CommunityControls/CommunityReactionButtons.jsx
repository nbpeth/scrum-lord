import { Box, Button, alpha, useTheme } from "@mui/material";

const reactionEmoji = {
  lightning: "⚡",
  hotdog: "🌭",
  party: "🎉",
  thinking: "🤔",
  upvote: "👍",
  downvote: "👎",
  love: "❤️‍🔥",
  heartbreak: "💔",
  shrug: "🤷",
};

const reactionOrder = [
  "lightning",
  "hotdog",
  "party",
  "thinking",
  "upvote",
  "downvote",
  "love",
  "heartbreak",
  "shrug",
];

const reactionBtnSx = (theme) => ({
  minWidth: 30,
  width: 30,
  height: 30,
  minHeight: 30,
  p: 0,
  fontSize: "0.95rem",
  lineHeight: 1,
  borderRadius: 1,
  borderColor: alpha(theme.palette.divider, 0.85),
  "&:hover": {
    borderColor: "primary.main",
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
});

export const CommunityReactionButtons = ({ onReaction }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        alignSelf: { xs: "flex-start", sm: "center" },
        gap: 0.5,
        flexShrink: 0,
        pb: { xs: 1, sm: 0 },
        mb: { xs: 0.25, sm: 0 },
        pr: { sm: 1.5 },
        mr: { sm: 0.5 },
        borderBottom: {
          xs: (t) => `1px solid ${alpha(t.palette.divider, 0.45)}`,
          sm: "none",
        },
        borderRight: {
          sm: (t) => `1px solid ${alpha(t.palette.divider, 0.45)}`,
        },
      }}
    >
      {reactionOrder.map((key) => (
        <Button
          key={key}
          size="small"
          variant="outlined"
          onClick={() => onReaction({ event: key })}
          title={key}
          sx={reactionBtnSx(theme)}
        >
          {reactionEmoji[key]}
        </Button>
      ))}
    </Box>
  );
};
