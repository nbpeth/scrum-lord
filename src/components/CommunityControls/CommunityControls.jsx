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
} from "@mui/material";
import { useEffect, useState } from "react";
import { VoteOptions } from "../../util/voteOptions";
import { TimerDisplay } from "../TimerDisplay/TimerDisplay";
import { CommunityReactionButtons } from "./CommunityReactionButtons";
import {
  controlsLayoutSx,
  controlsPanelSx,
  mainControlsSx,
  resetButtonSx,
  revealButtonSx,
  timerButtonSx,
  timerDisplayBoxSx,
  timerErrorSx,
  timerGroupSx,
  timerInputProps,
  timerInputSx,
  voteButtonSx,
  voteGroupSx,
  voteMenuProps,
  voteSelectFormControlSx,
  voteSelectSx,
} from "./CommunityControls.styles";

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
    <Paper elevation={0} sx={controlsPanelSx}>
      <Box sx={controlsLayoutSx(showReactions)}>
        {showReactions && <CommunityReactionButtons onReaction={onReaction} />}

        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          spacing={1}
          sx={mainControlsSx(showReactions)}
        >
          {showVote && (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={voteGroupSx}
            >
              <FormControl size="small" sx={voteSelectFormControlSx}>
                <InputLabel id="vote-selector-label">Pts</InputLabel>
                <Select
                  labelId="vote-selector-label"
                  id="vote-selector"
                  value={selectedVote}
                  label="Pts"
                  onChange={(event) => setSelectedVote(event.target.value)}
                  MenuProps={voteMenuProps}
                  sx={voteSelectSx}
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
                sx={voteButtonSx}
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
              sx={resetButtonSx}
            >
              Reset
            </Button>
            <Button
              disabled={community && community.revealed}
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleReveal({ ...iAmCitizen, communityId })}
              sx={revealButtonSx}
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
      sx={timerGroupSx}
    >
      <Button
        disabled={timerValue > MAX_TIMER_SECONDS}
        size="small"
        variant="contained"
        color="secondary"
        onClick={onTimerClicked}
        sx={timerButtonSx}
      >
        {community?.timer?.running ? "Cancel" : "Timer"}
      </Button>
      <TextField
        type="number"
        size="small"
        error={Boolean(error)}
        placeholder="Sec"
        inputProps={timerInputProps}
        disabled={community?.timer?.running}
        variant="outlined"
        value={timerValue}
        onChange={onTimerValueChanged}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onTimerClicked();
          }
        }}
        sx={timerInputSx}
      />
      <Box sx={timerDisplayBoxSx}>
        <TimerDisplay community={community} />
      </Box>
      {error && (
        <Typography variant="caption" color="error" sx={timerErrorSx}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};
