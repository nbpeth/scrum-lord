import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
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
  voteCardSx,
  voteDeckGridSx,
  voteDeckSx,
  voteGroupSx,
  voteTriggerIconSx,
  voteTriggerSx,
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
  if (!iAmCitizen) {
    return null;
  }

  const voteOptions =
    VoteOptions[community?.pointScheme]?.values ?? VoteOptions.fibonacci.values;

  const myVote = community?.citizens?.find(
    (citizen) => citizen.userId === iAmCitizen.userId
  )?.vote;

  const onVoteSubmit = (vote) => {
    submitVote({ communityId, ...iAmCitizen, vote });
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
            <VoteDeck
              options={voteOptions}
              currentVote={myVote}
              onVote={onVoteSubmit}
            />
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

export const VoteDeck = ({ options, currentVote, onVote }) => {
  const [deckAnchor, setDeckAnchor] = useState(null);
  const hasVoted = currentVote !== undefined && currentVote !== null;

  const pick = (vote) => {
    onVote(vote);
    setDeckAnchor(null);
  };

  return (
    <Box sx={voteGroupSx}>
      <Button
        id="vote-button"
        size="small"
        color="primary"
        variant={hasVoted ? "outlined" : "contained"}
        onClick={(event) => setDeckAnchor(event.currentTarget)}
        endIcon={<ExpandMore sx={voteTriggerIconSx} />}
        sx={voteTriggerSx}
      >
        {hasVoted ? currentVote : "Vote"}
      </Button>

      <Popover
        open={Boolean(deckAnchor)}
        anchorEl={deckAnchor}
        onClose={() => setDeckAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: voteDeckSx } }}
      >
        <Box id="vote-deck" sx={voteDeckGridSx}>
          {options.map((option) => (
            <ButtonBase
              key={option}
              onClick={() => pick(option)}
              aria-pressed={option === currentVote}
              sx={voteCardSx(option === currentVote)}
            >
              {option}
            </ButtonBase>
          ))}
        </Box>
      </Popover>
    </Box>
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
