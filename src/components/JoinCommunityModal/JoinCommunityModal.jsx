import { Box, Button, Grid, Modal, TextField } from "@mui/material";
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

  // todo: show random name as default
  const [newUser, setNewUser] = useState({ username: "", userId: uuidv4.v4() });

  const getUserName = () => {
    const userId = uuidv4.v4();
    if (!newUser.username) {
      return {
        ...newUser,
        userId,
        username: generate({
          exactly: 2,
          minLength: 5,
          join: " ",
          camelCase: true,
        }),
      };
    }
    return { newUser, ...userId };
  };

  const onClose = (c) => {
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
        <Grid container justifyContent="center">
          <form onSubmit={handleClose}>
            <Grid item>
              <TextField
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                label="User Name"
                id="username"
              />
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
          </form>
        </Grid>
      </Box>
    </Modal>
  );
};
