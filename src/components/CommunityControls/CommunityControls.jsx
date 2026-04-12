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
import { useState } from "react";
import * as React from "react";
import { VoteOptions } from "../EditPointSchemeModal/EditPointSchemeModal";
import { TimerDisplay } from "../TimerDisplay/TimerDisplay";
import { CommunityReactionButtons } from "./CommunityReactionButtons";

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
    py: 0.75,
    px: { xs: 1, sm: 1.25 },
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    background: (t) => alpha(t.palette.background.paper, 0.5),
    backdropFilter: "blur(10px)",
    boxShadow: (t) => `0 2px 12px ${alpha(t.palette.common.black, 0.08)}`,
  };

  const showReactions = settings?.reactionsVisible;
  const showVote = iAmCitizen && iAmCitizen.votingMember;
  const showTimer = settings?.timerVisible;

  const roomButtons = (
    <Stack direction="row" spacing={0.75} flexShrink={0}>
      <Button
        disabled={community && !community.revealed}
        size="small"
        variant="outlined"
        color="warning"
        onClick={() => handleReset({ ...iAmCitizen, communityId })}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          px: 1.25,
          py: 0.35,
          borderColor: (t) => alpha(t.palette.warning.main, 0.55),
          "&:hover": {
            borderColor: "warning.main",
            backgroundColor: (t) => alpha(t.palette.warning.main, 0.08),
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
          textTransform: "none",
          fontWeight: 600,
          px: 1.25,
          py: 0.35,
          boxShadow: "none",
          "&:hover": {
            boxShadow: (t) =>
              `0 2px 10px ${alpha(t.palette.success.main, 0.35)}`,
          },
        }}
      >
        Reveal
      </Button>
    </Stack>
  );

  const mainControls = (
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
              onChange={handleVoteChange}
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
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 1.5,
              py: 0.35,
              boxShadow: "none",
              whiteSpace: "nowrap",
            }}
          >
            Vote
          </Button>
        </Stack>
      )}

      {showTimer && (
        <TimerControl
          community={community}
          handleTimerClicked={handleTimerClicked}
          dense
        />
      )}

      {roomButtons}
    </Stack>
  );

  return (
    <>
      {iAmCitizen && (
        <Paper elevation={0} sx={panelSx}>
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
            {showReactions && (
              <CommunityReactionButtons onReaction={onReaction} />
            )}

            {mainControls}
          </Box>
        </Paper>
      )}
    </>
  );
};

export const TimerControl = ({
  community,
  handleTimerClicked,
  dense = false,
}) => {
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

  const btnSize = dense ? "small" : "medium";
  const tfSize = dense ? "small" : "small";

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={dense ? 0.75 : 1.25}
      flexWrap="wrap"
      sx={{ flexShrink: 0 }}
    >
      <Button
        disabled={timerValue > 600}
        size={btnSize}
        variant="contained"
        color="secondary"
        onClick={onTimerClicked}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          px: dense ? 1.25 : 2,
          py: dense ? 0.35 : 0.75,
          boxShadow: "none",
          whiteSpace: "nowrap",
          "&:hover": {
            boxShadow: (t) =>
              `0 2px 10px ${alpha(t.palette.secondary.main, 0.3)}`,
          },
        }}
      >
        {community?.timer?.running ? "Cancel" : "Timer"}
      </Button>
      <TextField
        type="number"
        size={tfSize}
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
          width: dense ? 64 : 88,
          flexShrink: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            ...(dense && { "& input": { py: 0.65 } }),
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: dense ? 40 : 48,
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
