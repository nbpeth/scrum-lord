import { WarningAmber } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";
import { AppModal, AppModalActions } from "../AppModal/AppModal";

const randomRoomName = () =>
  generate({ exactly: 3, minLength: 5, join: "-", camelCase: true });

export const CreateRoomModal = ({ open, handleClose }) => {
  const [name, setName] = useState(randomRoomName);
  const [isPrivate, setIsPrivate] = useState(true);

  const close = (newCommunity) => {
    setName(randomRoomName());
    handleClose(newCommunity);
  };

  const onCreate = () => close({ name: name || randomRoomName(), isPrivate });

  return (
    <AppModal open={open} onClose={() => close()}>
      <Typography variant="body2">
        Create a new community! No name provided will result in an
        auto-generated name.
      </Typography>
      <TextField
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Room Name"
        id="new-room-name-text-input"
      />
      <Stack direction="row" alignItems="center" spacing={1}>
        <FormControlLabel
          control={
            <Checkbox
              id="new-room-private-checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          }
          label="Private"
        />
        {!isPrivate && (
          <Tooltip title="Public communities are visible to all users on the dashboard">
            <WarningAmber color="warning" />
          </Tooltip>
        )}
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
