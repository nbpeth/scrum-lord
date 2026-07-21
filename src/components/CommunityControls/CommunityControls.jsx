import {
  Box,
  Button,
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
import { useEffect, useState } from "react";
import { controlButtonSx } from "../../theme";
import { VoteOptions } from "../../util/voteOptions";
import { TimerDisplay } from "../TimerDisplay/TimerDisplay";
import { CommunityReactionButtons } from "./CommunityReactionButtons";

const MAX_TIMER_SECONDS = 600;
const DEFAULT_TIMER_SECONDS = 60;

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

  useEffect(() => {
    if (community) {
      setSelectOptions(
        VoteOptions[community?.pointScheme]?.values ??
          VoteOptions.fibonacci.values
      );
    }
  }, [community]);

  if (!iAmCitizen) {
    return null;
  }

  const onVoteSubmit = () => {
    submitVote({ communityId, ...iAmCitizen, vote: selectedVote });
  };

  const onReaction = ({ event }) => {
    communityReaction({ event, ...iAmCitizen });
  };

  const showReactions = settings?.reactionsVisible;
  const showVote = iAmCitizen.votingMember;
  const showTimer = settings?.timerVisible;

  return (
    <Paper
      elevation={0}
      sx={{
        py: 0.75,
        px: { xs: 1, sm: 1.25 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        background: alpha(theme.palette.background.paper, 0.5),
        backdropFilter: "blur(10px)",
        boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.08)}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: showReactions
            ? { xs: "flex-start", sm: "space-between" }
            : { xs: "flex-start", sm: "flex-end" },
          gap: { xs: 1.25, sm: 2 },
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {showReactions && <CommunityReactionButtons onReaction={onReaction} />}

        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          spacing={1}
          sx={{
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            flex: { sm: showReactions ? "1 1 auto" : "0 1 auto" },
            minWidth: 0,
            columnGap: 1,
            rowGap: 1,
          }}
        >
          {showVote && (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              <FormControl size="small" sx={{ minWidth: 76, maxWidth: 110 }}>
                <InputLabel id="vote-selector-label">Pts</InputLabel>
                <Select
                  labelId="vote-selector-label"
                  id="vote-selector"
                  value={selectedVote}
                  label="Pts"
                  onChange={(event) => setSelectedVote(event.target.value)}
                  MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                  sx={{
                    borderRadius: 1,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha(theme.palette.divider, 0.85),
                    },
                    "& .MuiSelect-select": { py: 0.45 },
                  }}
                >
                  {selectOptions?.map((option) => (
                    <MenuItem key={option} value={option} dense>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onVoteSubmit}
                sx={{ ...controlButtonSx, px: 1.5 }}
              >
                Vote
              </Button>
            </Stack>
          )}

          {showTimer && (
            <TimerControl
              community={community}
              handleTimerClicked={handleTimerClicked}
            />
          )}

          <Stack direction="row" spacing={0.75} flexShrink={0}>
            <Button
              disabled={community && !community.revealed}
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => handleReset({ ...iAmCitizen, communityId })}
              sx={{
                ...controlButtonSx,
                borderColor: alpha(theme.palette.warning.main, 0.55),
                "&:hover": {
                  borderColor: "warning.main",
                  backgroundColor: alpha(theme.palette.warning.main, 0.08),
                },
              }}
            >
              Reset
            </Button>
            <Button
              disabled={community && community.revealed}
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleReveal({ ...iAmCitizen, communityId })}
              sx={{
                ...controlButtonSx,
                "&:hover": {
                  boxShadow: `0 2px 10px ${alpha(
                    theme.palette.success.main,
                    0.35
                  )}`,
                },
              }}
            >
              Reveal
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export const TimerControl = ({ community, handleTimerClicked }) => {
  const theme = useTheme();
  const [timerValue, setTimerValue] = useState(DEFAULT_TIMER_SECONDS);
  const [error, setError] = useState(undefined);

  const onTimerValueChanged = (event) => {
    event.preventDefault();
    const cleansedValue = event.target.value.replace(/\D/g, "");

    if (cleansedValue > MAX_TIMER_SECONDS) {
      setError(`Max timer value is ${MAX_TIMER_SECONDS} seconds`);
    } else if (error) {
      setError(undefined);
    }

    setTimerValue(cleansedValue);
  };

  const onTimerClicked = () => {
    handleTimerClicked({
      timerValue: timerValue || DEFAULT_TIMER_SECONDS,
      communityId: community.id,
    });
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.75}
      flexWrap="wrap"
      sx={{ flexShrink: 0 }}
    >
      <Button
        disabled={timerValue > MAX_TIMER_SECONDS}
        size="small"
        variant="contained"
        color="secondary"
        onClick={onTimerClicked}
        sx={{
          ...controlButtonSx,
          "&:hover": {
            boxShadow: `0 2px 10px ${alpha(theme.palette.secondary.main, 0.3)}`,
          },
        }}
      >
        {community?.timer?.running ? "Cancel" : "Timer"}
      </Button>
      <TextField
        type="number"
        size="small"
        error={Boolean(error)}
        placeholder="Sec"
        inputProps={{
          style: { textAlign: "center" },
          min: 1,
          max: MAX_TIMER_SECONDS,
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
          width: 64,
          flexShrink: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            "& input": { py: 0.65 },
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 40,
        }}
      >
        <TimerDisplay community={community} />
      </Box>
      {error && (
        <Typography variant="caption" color="error" sx={{ width: "100%" }}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};
