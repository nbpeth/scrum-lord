import {
  Gavel,
  GroupAdd,
  HelpOutline,
  HowToVote,
  Refresh,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Modal,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";
import * as uuid from "uuid";
import {
  DEFAULT_USER_TYPE,
  UserTypes,
  userTypeOptions,
  votingMemberFor,
} from "../../util/userTypes";
import {
  actionRowSx,
  backdropSx,
  cancelButtonSx,
  colorFieldSx,
  colorGridSx,
  colorSwatchSx,
  colorValueSx,
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
  userTypeButtonSx,
  userTypeDescriptionSx,
  userTypeGroupSx,
  userTypeHelpIconSx,
  userTypeHelpSx,
  userTypeIconSx,
  userTypeRowSx,
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

const USER_TYPE_ICONS = {
  [UserTypes.voter]: HowToVote,
  [UserTypes.scrumLord]: Gavel,
};

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
  const [userType, setUserType] = useState(DEFAULT_USER_TYPE);

  const onClose = (user) => {
    setNewUser(newRandomUser());
    setUserType(DEFAULT_USER_TYPE);
    handleClose(user);
  };

  const onJoin = () =>
    onClose({
      ...newUser,
      userId: uuid.v4(),
      userType,
      votingMember: votingMemberFor(userType),
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

              <ColorSelector
                value={newUser.userColor}
                onColorChange={(color) =>
                  setNewUser((prev) => ({ ...prev, userColor: color }))
                }
              />

              <Stack spacing={1} sx={userTypeRowSx}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    Join as
                  </Typography>
                  <Tooltip
                    title="Voters get a card and cast points. Scrumlords run the session and take part without voting."
                    placement="top"
                    arrow
                  >
                    <Box component="span" sx={userTypeHelpSx}>
                      <HelpOutline
                        sx={userTypeHelpIconSx}
                        aria-label="About user types"
                      />
                    </Box>
                  </Tooltip>
                </Stack>
                <UserTypeSelector
                  value={userType}
                  onUserTypeChange={setUserType}
                />
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
                  disabled={!newUser?.username}
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
    <Stack spacing={1} sx={colorFieldSx}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary" component="span">
          Tile color
        </Typography>
        <Typography variant="caption" sx={colorValueSx}>
          {value}
        </Typography>
      </Stack>

      <Box id="color-selector" sx={colorGridSx}>
        {USER_COLORS.map((color) => (
          <ButtonBase
            key={color}
            title={color}
            aria-label={color}
            aria-pressed={color === value}
            onClick={() => onColorChange(color)}
            sx={colorSwatchSx(color, color === value)}
          />
        ))}
      </Box>
    </Stack>
  );
};

export const UserTypeSelector = ({ value, onUserTypeChange }) => {
  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      id="user-type-selector"
      value={value}
      onChange={(_, selected) => selected && onUserTypeChange(selected)}
      sx={userTypeGroupSx}
    >
      {userTypeOptions.map(({ value: userType, label, description }) => {
        const Icon = USER_TYPE_ICONS[userType];

        return (
          <ToggleButton
            key={userType}
            value={userType}
            id={`user-type-${userType}`}
            aria-label={label}
            sx={userTypeButtonSx}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Icon sx={userTypeIconSx} />
              <Typography variant="body2" fontWeight={600}>
                {label}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={userTypeDescriptionSx}
            >
              {description}
            </Typography>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};
