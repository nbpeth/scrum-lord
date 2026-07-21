import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { AppModal, AppModalActions } from "../AppModal/AppModal";

export const DeleteCommunityModal = ({
  open,
  handleClose,
  currentCommunity,
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  const close = (communityId) => {
    setConfirmationText("");
    handleClose(communityId);
  };

  return (
    <AppModal open={open} onClose={() => close()}>
      <div>
        <Typography variant="h5">Are you sure?</Typography>
        <Typography variant="body2" fontStyle="italic" color="gray">
          what is done cannot be undone
        </Typography>
      </div>
      <Typography variant="body2" fontStyle="italic">
        Type the community name "{currentCommunity?.name}" to confirm
      </Typography>
      <TextField
        fullWidth
        id="name"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
      />
      <AppModalActions>
        <Button onClick={() => close()}>Cancel</Button>
        <Button
          color="error"
          variant="contained"
          disabled={confirmationText !== currentCommunity?.name}
          onClick={() => close(currentCommunity?.id)}
        >
          Delete
        </Button>
      </AppModalActions>
    </AppModal>
  );
};
