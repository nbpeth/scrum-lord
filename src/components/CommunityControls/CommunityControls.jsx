import {
  Button,
  Divider,
  Grid,
  List,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import * as React from "react";
import { VoteOptions } from "../EditPointSchemeModal/EditPointSchemeModal";
import { TimerDisplay } from "../TimerDisplay/TimerDisplay";

export const CommunityControls = ({
  handleReveal,
  handleReset,
  handleTimerClicked,
  iAmCitizen,
  communityId,
  submitVote,
  community,
  communityReaction,
}) => {
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
        VoteOptions[community?.pointScheme] ?? VoteOptions["fibonacci"]
      );
    }
  }, [community]);

  return (
    <>
      {iAmCitizen && (
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          xs={12}
          spacing={3}
          sx={{ padding: "15px" }}
        >
          <Grid
            container
            item
            spacing={1}
            xs={6}
            justifyContent="space-between"
          >
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => onReaction({ event: "lightning" })}
              >
                ⚡
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => onReaction({ event: "party" })}
              >
                🎉
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => onReaction({ event: "thinking" })}
              >
                🤔
              </Button>
              {/* nonplussed */}
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => onReaction({ event: "upvote" })}
              >
                👍
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => onReaction({ event: "downvote" })}
              >
                👎
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <List>
              <Divider />
            </List>
          </Grid>
          {iAmCitizen && iAmCitizen.votingMember && (
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" onClick={onVoteSubmit}>
                  Vote
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  labelId="vote-selector-label"
                  id="vote-selector"
                  value={selectedVote}
                  label="Vote"
                  onChange={handleVoteChange}
                  MenuProps={{ style: { maxHeight: "400px" } }}
                >
                  {selectOptions?.map((option) => {
                    return (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <List>
                  <Divider />
                </List>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            {community && community.revealed ? (
              <Button
                fullWidth
                variant="outlined"
                color="warning"
                onClick={() => handleReset({ ...iAmCitizen, communityId })}
              >
                Reset
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                color="success"
                onClick={() => handleReveal({ ...iAmCitizen, communityId })}
              >
                Reveal
              </Button>
            )}
          </Grid>

          <Grid item xs={12}>
            <TimerControl {...{ community, handleTimerClicked }} />
          </Grid>
          <Grid item xs={12}>
            <List>
              <Divider />
            </List>
          </Grid>
        </Grid>
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
      // setTimerValue(0);
      setError("Max timer value is 600 seconds");

      // return;
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
    <Grid
      container
      xs={12}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={8}>
        <Button
          disabled={timerValue > 600}
          fullWidth
          variant="contained"
          color="secondary"
          onClick={onTimerClicked}
        >
          {community?.timer?.running ? "Cancel Timer " : "Start Timer"}
        </Button>
      </Grid>
      <Grid item xs={3}>
        <TextField
          type="number"
          error={error}
          inputProps={{ style: { textAlign: "center" } }}
          disabled={community?.timer?.running}
          variant="standard"
          value={timerValue}
          onChange={onTimerValueChanged}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onTimerClicked();
            }
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <TimerDisplay community={community} />
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
