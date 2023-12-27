import { Button, Grid, Modal, TextField } from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";

export const CreateRoomModal = ({ open, handleClose }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const [newCommunity, setNewCommunity] = useState({ name: "" });

  const getCommunityName = () => {
    if (!newCommunity.name) {
      return {
        ...newCommunity,
        name: generate({ exactly: 3, minLength: 5, join: "-" }),
      };
    }
    return newCommunity;
  };

  const close = (c) => {
    setNewCommunity({ name: "" });
    handleClose(c);
  };

  return (
    <Modal
      sx={style}
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          close();
        }
      }}
    >
      <Grid container justifyContent="center" alignItems="space-between">
        <form onSubmit={handleClose}>
          <Grid item>
            <TextField
              onChange={(e) =>
                setNewCommunity({ ...newCommunity, name: e.target.value })
              }
              label="Community Name"
              id="name"
            />
          </Grid>
          <Grid container item xs={12}>
            <Grid item>
              <Button onClick={() => close(getCommunityName())}>
                Create
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => close()}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Modal>
  );
};
