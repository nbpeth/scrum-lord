import { Refresh } from "@mui/icons-material";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";
import { AppModal, AppModalActions } from "../AppModal/AppModal";
import {
  refreshNameIconSx,
  roomNameFieldSx,
  roomNameRowSx,
} from "./CreateRoomModal.styles";

const randomRoomName = () =>
  generate({ exactly: 3, minLength: 5, join: "-", camelCase: true });

export const CreateRoomModal = ({ open, handleClose }) => {
  const [name, setName] = useState(randomRoomName);

  const close = (newCommunity) => {
    setName(randomRoomName());
    handleClose(newCommunity);
  };

  const onCreate = () =>
    close({ name: name || randomRoomName(), isPrivate: true });

  return (
    <AppModal open={open} onClose={() => close()}>
      <Typography variant="body2">
        Create a new community! No name provided will result in an
        auto-generated name.
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={roomNameRowSx}
      >
        <TextField
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Room Name"
          id="new-room-name-text-input"
          sx={roomNameFieldSx}
        />
        <Refresh
          onClick={() => setName(randomRoomName())}
          sx={refreshNameIconSx}
          aria-label="Generate random room name"
          id="new-room-name-refresh-icon"
        />
      </Stack>
      <AppModalActions>
        <Button id="new-room-create-button" onClick={onCreate}>
          Create
        </Button>
        <Button color="error" onClick={() => close()}>
          Cancel
        </Button>
      </AppModalActions>
    </AppModal>
  );
};
