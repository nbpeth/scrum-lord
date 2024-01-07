import { Button, Divider, Grid, List, MenuItem, Select } from "@mui/material";
import { useState } from "react";

import * as React from "react";

export const VoteOptions = {
  fibonacci: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987],
  tshirt: ["XS", "S", "M", "L", "XL", "XXL"],
  yesNo: ["Yes", "No"],
  boolean: ["True", "False"],
  thumbs: ["👍", "👎", "🫰", "🤌"],
  naturalNumbers: Array.from(Array(50).keys()),
  deficientNumbers: [
    1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 21, 22, 23, 25, 26,
    27, 29, 31, 32, 33, 34, 35, 37, 38, 39, 41, 43, 44, 45, 46, 47, 49, 50,
  ],
  abundantNumbers: [
    12, 18, 20, 24, 30, 36, 40, 42, 48, 54, 56, 60, 66, 70, 72, 78, 80, 84, 88,
    90, 96, 100, 102, 104, 108,
  ],
  foodEmojis: [
    "🍕",
    "🍟",
    "🌭",
    "🍔",
    "🧀",
    "🥔",
    "🌮",
    "🥩",
    "🍖",
    "🍺",
    "🥪",
  ],
};

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
      vote: selectedVote,
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
                  // style={{maxHeight: "300px"}}
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
        </Grid>
      )}
    </>
  );
};
