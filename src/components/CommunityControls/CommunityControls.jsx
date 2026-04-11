import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import * as React from "react";
import { VoteOptions } from "../EditPointSchemeModal/EditPointSchemeModal";
import { TimerDisplay } from "../TimerDisplay/TimerDisplay";

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

export const CommunityControls = ({
  handleReveal,
  handleReset,
  handleTimerClicked,
  iAmCitizen,
  communityId,
  submitVote,
  community,
  communityReaction,
  settings,
}) => {
  const theme = useTheme();
  const [selectOptions, setSelectOptions] = useState(null);
  const [selectedVote, setSelectedVote] = useState(0);
  const handleVoteChange = (event) => {
    setSelectedVote(event.target.value);
  };

  const onVoteSubmit = () => {
    submitVote({
      communityId,
      ...iAmCitizen,
      vote: selectedVote,
    });
  };

  const onReaction = ({ event }) => {
    communityReaction({
      event,
      userId: iAmCitizen.userId,
      username: iAmCitizen.username,
      ...iAmCitizen,
    });
  };

  React.useEffect(() => {
    if (community) {
      setSelectOptions(
        VoteOptions[community?.pointScheme]?.values ??
          VoteOptions["fibonacci"].values
      );
    }
  }, [community]);

  const panelSx = {
    p: { xs: 2, sm: 2.25 },
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    background: (t) => alpha(t.palette.background.paper, 0.55),
    backdropFilter: "blur(12px)",
    boxShadow: (t) =>
      `0 4px 24px ${alpha(t.palette.common.black, 0.12)}`,
  };

  const subtleDivider = (
    <Divider
      sx={{
        borderColor: (t) => alpha(t.palette.divider, 0.6),
        my: 0.5,
      }}
    />
  );

  const showReactions = settings?.reactionsVisible;
  const showVote = iAmCitizen && iAmCitizen.votingMember;
  const showTimer = settings?.timerVisible;

  return (
    <>
      {iAmCitizen && (
        <Paper elevation={0} sx={panelSx}>
          <Stack spacing={2.25}>
            {showReactions && (
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    mb: 1,
                    color: "text.secondary",
                    letterSpacing: 0.08,
                    fontSize: "0.65rem",
                  }}
                >
                  Reactions
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {reactionOrder.map((key) => (
                    <Button
                      key={key}
                      size="small"
                      variant="outlined"
                      onClick={() => onReaction({ event: key })}
                      sx={{
                        minWidth: 44,
                        minHeight: 40,
                        px: 1,
                        py: 0.5,
                        borderRadius: 2,
                        borderColor: alpha(theme.palette.divider, 0.9),
                        color: "text.primary",
                        fontSize: "1.15rem",
                        lineHeight: 1,
                        transition: "background-color 0.2s, border-color 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: (t) =>
                            alpha(t.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {reactionEmoji[key]}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {showReactions && (showVote || showTimer) && subtleDivider}

            {showVote && (
              <Stack spacing={1.5}>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    letterSpacing: 0.08,
                    fontSize: "0.65rem",
                  }}
                >
                  Your vote
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel id="vote-selector-label">Points</InputLabel>
                  <Select
                    labelId="vote-selector-label"
                    id="vote-selector"
                    value={selectedVote}
                    label="Points"
                    onChange={handleVoteChange}
                    MenuProps={{ PaperProps: { style: { maxHeight: 360 } } }}
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: alpha(theme.palette.divider, 0.9),
                      },
                    }}
                  >
                    {selectOptions?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onVoteSubmit}
                  sx={{
                    borderRadius: 2,
                    py: 1.1,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { boxShadow: (t) => `0 4px 16px ${alpha(t.palette.primary.main, 0.35)}` },
                  }}
                >
                  Submit vote
                </Button>
              </Stack>
            )}

            {showVote && showTimer && subtleDivider}

            {showTimer && (
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    mb: 1,
                    color: "text.secondary",
                    letterSpacing: 0.08,
                    fontSize: "0.65rem",
                  }}
                >
                  Timer
                </Typography>
                <TimerControl {...{ community, handleTimerClicked }} />
              </Box>
            )}

            {(showReactions || showVote || showTimer) && subtleDivider}

            <Stack spacing={1.25}>
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  color: "text.secondary",
                  letterSpacing: 0.08,
                  fontSize: "0.65rem",
                }}
              >
                Room
              </Typography>
              <Button
                disabled={community && !community.revealed}
                fullWidth
                variant="outlined"
                color="warning"
                onClick={() => handleReset({ ...iAmCitizen, communityId })}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: (t) => alpha(t.palette.warning.main, 0.55),
                  "&:hover": {
                    borderColor: "warning.main",
                    backgroundColor: (t) =>
                      alpha(t.palette.warning.main, 0.08),
                  },
                }}
              >
                Reset round
              </Button>
              <Button
                disabled={community && community.revealed}
                fullWidth
                variant="contained"
                color="success"
                onClick={() => handleReveal({ ...iAmCitizen, communityId })}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: (t) =>
                      `0 4px 16px ${alpha(t.palette.success.main, 0.4)}`,
                  },
                }}
              >
                Reveal votes
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </>
  );
};

export const TimerControl = ({ community, handleTimerClicked }) => {
  const [timerValue, setTimerValue] = useState(60);
  const [error, setError] = useState(undefined);

  const onTimerValueChanged = (event) => {
    event.preventDefault();
    const cleanseValue = event.target.value.replace(/\D/g, "");

    if (cleanseValue > 600) {
      setError("Max timer value is 600 seconds");
    } else if (error) {
      setError(undefined);
    }

    setTimerValue(cleanseValue);
  };

  const onTimerClicked = () => {
    handleTimerClicked({
      timerValue: timerValue || 60,
      communityId: community.id,
    });
  };

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="stretch"
        spacing={1.25}
        sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <Button
          disabled={timerValue > 600}
          fullWidth
          variant="contained"
          color="secondary"
          onClick={onTimerClicked}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            flex: { xs: "1 1 100%", sm: "1 1 auto" },
            minWidth: 0,
            boxShadow: "none",
            "&:hover": {
              boxShadow: (t) =>
                `0 4px 16px ${alpha(t.palette.secondary.main, 0.35)}`,
            },
          }}
        >
          {community?.timer?.running ? "Cancel timer" : "Start timer"}
        </Button>
        <TextField
          type="number"
          size="small"
          error={Boolean(error)}
          placeholder="Sec"
          inputProps={{
            style: { textAlign: "center" },
            min: 1,
            max: 600,
          }}
          disabled={community?.timer?.running}
          variant="outlined"
          value={timerValue}
          onChange={onTimerValueChanged}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onTimerClicked();
            }
          }}
          sx={{
            width: { xs: "100%", sm: 88 },
            flexShrink: 0,
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 48,
            px: 0.5,
          }}
        >
          <TimerDisplay community={community} />
        </Box>
      </Stack>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Stack>
  );
};
