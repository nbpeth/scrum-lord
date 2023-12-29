import {
  Button,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { useState } from "react";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import * as React from "react";
import ModeNightIcon from "@mui/icons-material/ModeNight";
export const CommunityControls = ({
  handleJoin,
  handleLeave,
  handleReveal,
  handleReset,
  iAmCitizen,
  communityId,
  submitVote,
  community,
  controlsList,
  setControlsList,
  handleDeleteCommunity,
}) => {
  const [selectOptions, setSelectOptions] = useState([
    0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
  ]);
  const [selectedVote, setSelectedVote] = useState(0);
  const handleVoteChange = (event) => {
    setSelectedVote(event.target.value);
  };

  const onVoteSubmit = () => {
    submitVote({ communityId, userId: iAmCitizen.userId, vote: selectedVote });
  };

  const onDeleteCommunity = () => {
    handleDeleteCommunity({ communityId });
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      xs={12}
      sx={{ padding: "15px" }}
    >
      <Grid container item spacing={2}>
        <Grid item xs={12}>
          {!iAmCitizen ? (
            <Button
              fullWidth
              variant="outlined"
              color="success"
              onClick={handleJoin}
            >
              Join
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleLeave}
            >
              Leave
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <List>
            <Divider />
          </List>
        </Grid>
      </Grid>
      {iAmCitizen ? (
        <Grid container item spacing={2}>
          <Grid item xs={12}>
            <List>
              <Divider />
            </List>
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
            <Button fullWidth variant="contained" onClick={onVoteSubmit}>
              Vote
            </Button>
          </Grid>

          <Grid item xs={12}>
            {community && community.revealed ? (
              <Button
                fullWidth
                variant="outlined"
                color="success"
                onClick={handleReset}
              >
                Reset
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                color="success"
                onClick={handleReveal}
              >
                Reveal
              </Button>
            )}
          </Grid>

          <Grid item xs={12}>
            <List>
              <Divider />
            </List>
          </Grid>
        </Grid>
      ) : null}

      <Grid container item alignItems="center" justify="flex-start">
        <ModeNightIcon />
        <Switch
          checked={!!controlsList?.partyModeEngaged}
          onChange={() => {
            setControlsList({
              ...controlsList,
              partyModeEngaged: !controlsList.partyModeEngaged,
            });
          }}
        />
      </Grid>

      <Grid item>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={onDeleteCommunity}
        >
          Delete Room
        </Button>
      </Grid>
    </Grid>
  );
};
