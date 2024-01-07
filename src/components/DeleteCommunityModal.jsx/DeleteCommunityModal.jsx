import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const DeleteCommunityModal = ({
  open,
  handleClose,
  currentCommunity,
}) => {
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

  const [communityNameConfirmationText, setCommunityNameConfirmationText] =
    useState("");

  const close = (c) => {
    setCommunityNameConfirmationText("");
    handleClose(c);
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          close();
        }
      }}
    >
      <Box sx={style}>
        <Grid container justifyContent="center" direction="column" spacing={2}>
          <Grid container item>
            <Typography variant="h5">Are you sure?</Typography>
            <Typography variant="body2" fontStyle="italic" color="gray">what is done cannot be undone</Typography>
          </Grid>
          <Grid container item>
            <Typography variant="body2" fontStyle="italic">
              Type the community name "{currentCommunity?.name}" to confirm
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              onChange={(e) => setCommunityNameConfirmationText(e.target.value)}
              label=""
              id="name"
            />
          </Grid>
          <Grid container item xs={12} justifyContent="space-between">
            <Grid item>
              <Button onClick={() => close()}>Cancel</Button>
            </Grid>
            <Grid item>
              <Button
                color="error"
                disabled={
                  communityNameConfirmationText !== currentCommunity?.name
                }
                variant="contained"
                onClick={() => close(currentCommunity?.id)}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
