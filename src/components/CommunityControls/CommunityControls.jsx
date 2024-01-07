import { Button, Divider, Grid, List, MenuItem, Select } from "@mui/material";
import { useState } from "react";

import * as React from "react";
export const CommunityControls = ({
  handleReveal,
  handleReset,
  iAmCitizen,
  communityId,
  submitVote,
  community,
  communityReaction,
}) => {
  const [selectOptions, setSelectOptions] = useState([
    0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
  ]);
  const [selectedVote, setSelectedVote] = useState(0);
  const handleVoteChange = (event) => {
    setSelectedVote(event.target.value);
  };

  const onVoteSubmit = () => {
    submitVote({
      communityId,
      // userId: iAmCitizen.userId,
      // username: iAmCitizen.username,
      vote: selectedVote,
      // userColor: iAmCitizen.userColor,
      ...iAmCitizen,
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
                >
                  {selectOptions.map((option) => {
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
        </Grid>
      )}
    </>
  );
};
