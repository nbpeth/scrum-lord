import {
  Box,
  Button,
  Grid,
  Modal,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";
import * as uuidv4 from "uuid";

import * as React from "react";
export const JoinCommunityModal = ({ open, handleClose }) => {
  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const theme = useTheme();

  // todo: show random name as default
  const [newUser, setNewUser] = useState({
    username: generate({
      exactly: 2,
      minLength: 5,
      join: " ",
      camelCase: true,
    }),
  });

  const [votingMemberChecked, setVotingMemberChecked] = useState(true);

  const getUserName = () => {
    return {
      ...newUser,
      userId: uuidv4.v4(),
      votingMember: votingMemberChecked,
    };
  };

  const onClose = (c, x) => {
    // debugger;
    setNewUser({ username: "" });
    handleClose(c);
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
    >
      <Box sx={style}>
        <Grid container justifyContent="left">
          {votingMemberChecked && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={newUser?.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                label="User Name"
                id="username"
              />
            </Grid>
          )}
          <Grid container item alignItems="center">
            <Grid item>
              <Switch
                checked={votingMemberChecked}
                onChange={(c) => {
                  setVotingMemberChecked(c.target.checked);
                }}
              />
            </Grid>
            <Grid>
              <Typography variant="body2" color={theme.palette.grey[400]}>
                Voting Member
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item>
              <Button onClick={() => onClose(getUserName())}>Join</Button>
            </Grid>
            <Grid item>
              <Button color="error" onClick={() => onClose()}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
