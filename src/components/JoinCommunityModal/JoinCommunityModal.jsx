import { GroupAdd, HelpOutline, Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";
import * as uuid from "uuid";
import {
  actionRowSx,
  backdropSx,
  cancelButtonSx,
  colorMenuSx,
  colorSwatchSx,
  dialogBodySx,
  dialogPaperSx,
  dialogTitleSx,
  fieldStackSx,
  joinButtonIconSx,
  joinButtonSx,
  modalViewportSx,
  refreshNameIconSx,
  usernameFieldSx,
  usernameRowSx,
  votingMemberHelpIconSx,
  votingMemberHelpSx,
  votingMemberRowSx,
} from "./JoinCommunityModal.styles";

const USER_COLORS = [
  "#AD28FC",
  "#D160BD",
  "#4F90DA",
  "#DFB48D",
  "#3E07AA",
  "#19314E",
  "#EA0208",
  "#71EB28",
  "#6FE7BD",
  "#F448DB",
  "#D857B6",
  "#133652",
  "#161AC9",
  "#D49B17",
  "#5E5112",
  "#578A60",
  "#640EB3",
  "#2E43CC",
  "#5B7AD0",
  "#2530D5",
  "#D4F9DE",
  "#E6B27C",
  "#D3C2D5",
  "#6FBEAF",
  "#CC5B6A",
];

const randomUserName = () =>
  generate({ exactly: 2, minLength: 5, join: " ", camelCase: true });

const randomUserColor = () =>
  USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

export const JoinCommunityModal = ({ open, handleClose }) => {
  const newRandomUser = () => ({
    username: randomUserName(),
    userColor: randomUserColor(),
  });

  const [newUser, setNewUser] = useState(newRandomUser);
  const [votingMemberChecked, setVotingMemberChecked] = useState(true);

  const onClose = (user) => {
    setNewUser(newRandomUser());
    handleClose(user);
  };

  const onJoin = () =>
    onClose({
      ...newUser,
      userId: uuid.v4(),
      votingMember: votingMemberChecked,
    });

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      BackdropProps={{ sx: backdropSx }}
    >
      <Box sx={modalViewportSx}>
        <Box sx={dialogPaperSx}>
          <Stack spacing={2.5} sx={dialogBodySx}>
            <Typography
              variant="subtitle1"
              component="h2"
              fontWeight={600}
              sx={dialogTitleSx}
            >
              Join room
            </Typography>

            <Stack spacing={2} sx={fieldStackSx}>
              {votingMemberChecked && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={usernameRowSx}
                >
                  <TextField
                    fullWidth
                    value={newUser?.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    label="User name"
                    id="username"
                    size="small"
                    sx={usernameFieldSx}
                  />
                  <Refresh
                    onClick={() =>
                      setNewUser({ ...newUser, username: randomUserName() })
                    }
                    sx={refreshNameIconSx}
                    aria-label="Generate random name"
                  />
                </Stack>
              )}

              <ColorSelector
                value={newUser.userColor}
                onColorChange={(color) =>
                  setNewUser((prev) => ({ ...prev, userColor: color }))
                }
              />

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={votingMemberRowSx}
              >
                <Switch
                  checked={votingMemberChecked}
                  onChange={(e) => setVotingMemberChecked(e.target.checked)}
                  size="small"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                >
                  Voting member
                </Typography>
                <Tooltip
                  title="Non-voting members will be able to participate in the session without needing to cast a vote"
                  placement="top"
                  arrow
                >
                  <Box component="span" sx={votingMemberHelpSx}>
                    <HelpOutline
                      sx={votingMemberHelpIconSx}
                      aria-label="About non-voting members"
                    />
                  </Box>
                </Tooltip>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1.5}
                sx={actionRowSx}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onClose()}
                  sx={cancelButtonSx}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onJoin}
                  disabled={votingMemberChecked && !newUser?.username}
                  startIcon={<GroupAdd sx={joinButtonIconSx} />}
                  sx={joinButtonSx}
                >
                  Join
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export const ColorSelector = ({ value, onColorChange }) => {
  return (
    <Select
      fullWidth
      size="small"
      id="color-selector"
      value={value}
      onChange={(e) => onColorChange(e.target.value)}
      MenuProps={{ PaperProps: { sx: colorMenuSx } }}
    >
      {USER_COLORS.map((color) => (
        <MenuItem key={color} value={color}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={colorSwatchSx(color)} />
            <Typography variant="body2" color="text.secondary">
              {color}
            </Typography>
          </Stack>
        </MenuItem>
      ))}
    </Select>
  );
};
