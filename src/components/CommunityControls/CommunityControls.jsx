import {
  ExpandMore,
  RestartAlt,
  TimerOutlined,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  ButtonGroup,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import {
  DEFAULT_TIMER_SECONDS,
  TIMER_PRESETS,
  clampTimerSeconds,
  formatCountdown,
} from "../../util/timer";
import { VoteOptions } from "../../util/voteOptions";
import { TimerDisplay } from "../TimerDisplay/TimerDisplay";
import { CommunityReactionButtons } from "./CommunityReactionButtons";
import {
  controlIconButtonSx,
  controlIconSx,
  controlsLayoutSx,
  controlsPanelSx,
  mainControlsSx,
  resetButtonSx,
  revealButtonSx,
  timerCompactButtonSx,
  timerCustomRowSx,
  timerGroupSx,
  timerIconSx,
  timerInputProps,
  timerInputSx,
  timerPresetRowSx,
  timerPresetSx,
  timerPresetsPaperSx,
  timerPresetsToggleSx,
  timerStartButtonSx,
  voteCardSx,
  voteDeckGridSx,
  voteDeckSx,
  voteGroupSx,
  voteTriggerIconSx,
  voteTriggerSx,
} from "./CommunityControls.styles";

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
  const compact = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

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
      <Box sx={controlsLayoutSx(showReactions, compact)}>
        {showReactions && (
          <CommunityReactionButtons onReaction={onReaction} compact={compact} />
        )}

        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          spacing={1}
          sx={mainControlsSx(showReactions, compact)}
        >
          {showVote && (
            <VoteDeck
              options={voteOptions}
              currentVote={myVote}
              onVote={onVoteSubmit}
              compact={compact}
            />
          )}

          {showTimer && (
            <TimerControl
              community={community}
              handleTimerClicked={handleTimerClicked}
              compact={compact}
            />
          )}

          <Stack direction="row" spacing={0.75} flexShrink={0}>
            <RoundAction
              id="reset-button"
              label="Reset"
              icon={RestartAlt}
              tone="warning"
              compact={compact}
              disabled={community && !community.revealed}
              onClick={() => handleReset({ ...iAmCitizen, communityId })}
              sx={resetButtonSx}
            />
            <RoundAction
              id="reveal-button"
              label="Reveal"
              icon={Visibility}
              tone="success"
              variant="contained"
              compact={compact}
              disabled={community && community.revealed}
              onClick={() => handleReveal({ ...iAmCitizen, communityId })}
              sx={revealButtonSx}
            />
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

const RoundAction = ({
  id,
  label,
  icon: Icon,
  tone,
  variant = "outlined",
  compact,
  disabled,
  onClick,
  sx,
}) =>
  compact ? (
    <Tooltip title={label} placement="top" arrow>
      <Box component="span">
        <IconButton
          id={id}
          size="small"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          sx={controlIconButtonSx(tone)}
        >
          <Icon sx={controlIconSx} />
        </IconButton>
      </Box>
    </Tooltip>
  ) : (
    <Button
      id={id}
      size="small"
      variant={variant}
      color={tone}
      disabled={disabled}
      onClick={onClick}
      sx={sx}
    >
      {label}
    </Button>
  );

export const VoteDeck = ({ options, currentVote, onVote, compact = false }) => {
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
        endIcon={compact ? undefined : <ExpandMore sx={voteTriggerIconSx} />}
        sx={voteTriggerSx(compact)}
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

export const TimerControl = ({ community, handleTimerClicked, compact = false }) => {
  const [duration, setDuration] = useState(DEFAULT_TIMER_SECONDS);
  const [presetsAnchor, setPresetsAnchor] = useState(null);
  const [customValue, setCustomValue] = useState("");

  const running = Boolean(community?.timer?.running);

  const toggleTimer = (timerValue) =>
    handleTimerClicked({ timerValue, communityId: community?.id });

  const startWith = (seconds) => {
    setDuration(seconds);
    setPresetsAnchor(null);
    setCustomValue("");
    toggleTimer(seconds);
  };

  const startCustom = () => {
    const seconds = clampTimerSeconds(customValue);
    if (seconds) {
      startWith(seconds);
    }
  };

  if (running) {
    return (
      <Box sx={timerGroupSx}>
        <TimerDisplay community={community} onCancel={() => toggleTimer()} />
      </Box>
    );
  }

  return (
    <Box sx={timerGroupSx}>
      {compact ? (
        <Tooltip title="Start a timer" placement="top" arrow>
          <IconButton
            id="timer-presets-button"
            size="small"
            aria-label="Start a timer"
            onClick={(event) => setPresetsAnchor(event.currentTarget)}
            sx={timerCompactButtonSx}
          >
            <TimerOutlined sx={controlIconSx} />
          </IconButton>
        </Tooltip>
      ) : (
        <ButtonGroup size="small" variant="contained" color="secondary">
          <Button
            id="timer-button"
            onClick={() => startWith(duration)}
            startIcon={<TimerOutlined sx={timerIconSx} />}
            sx={timerStartButtonSx}
          >
            {formatCountdown(duration)}
          </Button>
          <Button
            id="timer-presets-button"
            aria-label="Choose timer length"
            onClick={(event) => setPresetsAnchor(event.currentTarget)}
            sx={timerPresetsToggleSx}
          >
            <ExpandMore sx={timerIconSx} />
          </Button>
        </ButtonGroup>
      )}

      <Popover
        open={Boolean(presetsAnchor)}
        anchorEl={presetsAnchor}
        onClose={() => setPresetsAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: timerPresetsPaperSx } }}
      >
        <Box id="timer-presets" sx={timerPresetRowSx}>
          {TIMER_PRESETS.map((seconds) => (
            <ButtonBase
              key={seconds}
              onClick={() => startWith(seconds)}
              sx={timerPresetSx}
            >
              {formatCountdown(seconds)}
            </ButtonBase>
          ))}
        </Box>

        <Box sx={timerCustomRowSx}>
          <TextField
            type="number"
            size="small"
            id="timer-custom-input"
            placeholder="Sec"
            inputProps={timerInputProps}
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                startCustom();
              }
            }}
            sx={timerInputSx}
          />
          <Button
            id="timer-custom-start"
            size="small"
            variant="outlined"
            color="secondary"
            disabled={!clampTimerSeconds(customValue)}
            onClick={startCustom}
          >
            Start
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};
