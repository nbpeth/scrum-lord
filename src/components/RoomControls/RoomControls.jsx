import { DeleteOutline, Edit, Login, Logout } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { isScrumLord } from "../../util/userTypes";
import {
  identityDotSx,
  identityLabelSx,
  identityNameSx,
  dangerSlotSx,
  identityRowSx,
  roomActionButtonSx,
  roomControlsSx,
  roomIconButtonSx,
  secondaryGroupSx,
} from "./RoomControls.styles";

const membershipAction = ({ iAmCitizen, onJoin, onLeave }) =>
  iAmCitizen
    ? {
        key: "leave",
        id: "room-leave-button",
        label: "Leave",
        icon: Logout,
        onClick: onLeave,
        color: "secondary",
        variant: "outlined",
      }
    : {
        key: "join",
        id: "room-join-button",
        label: "Join room",
        icon: Login,
        onClick: onJoin,
        color: "success",
        variant: "contained",
      };

const roomAction = ({ onEditPointScheme }) => ({
  key: "scheme",
  id: "room-point-scheme-button",
  label: "Point scheme",
  icon: Edit,
  onClick: onEditPointScheme,
  color: "primary",
  variant: "outlined",
});

const dangerAction = ({ onDeleteRoom }) => ({
  key: "delete",
  id: "room-delete-button",
  label: "Delete room",
  icon: DeleteOutline,
  onClick: onDeleteRoom,
  color: "error",
  variant: "outlined",
});

export const RoomControls = ({
  compact = false,
  iAmCitizen,
  onJoin,
  onLeave,
  onEditPointScheme,
  onDeleteRoom,
}) => {
  const membership = membershipAction({ iAmCitizen, onJoin, onLeave });
  const runsTheRoom = isScrumLord(iAmCitizen);
  const secondary = runsTheRoom ? [roomAction({ onEditPointScheme })] : [];
  const danger = runsTheRoom ? dangerAction({ onDeleteRoom }) : null;

  const renderAction = ({ key, id, label, icon: Icon, onClick, color, variant }) =>
    compact ? (
      <Tooltip key={key} title={label} placement="right" arrow>
        <IconButton
          id={id}
          size="small"
          color={color}
          aria-label={label}
          onClick={onClick}
          sx={roomIconButtonSx}
        >
          <Icon fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : (
      <Button
        key={key}
        id={id}
        fullWidth
        size="small"
        color={color}
        variant={variant}
        onClick={onClick}
        startIcon={<Icon fontSize="small" />}
        sx={roomActionButtonSx}
      >
        {label}
      </Button>
    );

  return (
    <Box id="room-controls" sx={roomControlsSx(compact)}>
      {iAmCitizen && (
        <CitizenIdentity iAmCitizen={iAmCitizen} compact={compact} />
      )}

      {renderAction(membership)}

      {secondary.length > 0 && (
        <Box sx={secondaryGroupSx(compact)}>{secondary.map(renderAction)}</Box>
      )}

      {danger && <Box sx={dangerSlotSx(compact)}>{renderAction(danger)}</Box>}
    </Box>
  );
};

const CitizenIdentity = ({ iAmCitizen, compact }) => {
  const { username, userColor } = iAmCitizen;

  if (compact) {
    return (
      <Tooltip title={`Joined as "${username}"`} placement="right" arrow>
        <Box sx={identityDotSx(userColor)} />
      </Tooltip>
    );
  }

  return (
    <Box>
      <Typography variant="caption" sx={identityLabelSx}>
        Joined as
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.75} sx={identityRowSx}>
        <Box sx={identityDotSx(userColor)} />
        <Typography variant="body2" sx={identityNameSx}>
          {username}
        </Typography>
      </Stack>
    </Box>
  );
};
