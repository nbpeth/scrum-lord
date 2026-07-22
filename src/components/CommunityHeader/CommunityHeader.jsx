import {
  Celebration,
  ContentCopy,
  Edit,
  Home,
  ModeComment,
  Timer,
  Visibility,
} from "@mui/icons-material";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { ConnectionStatus } from "../ConnectionStatus/ConnectionStatus";
import { ScrumLordMenu } from "../DashboardTitleMenu/DashboardTitleMenu";
import {
  headerBarSx,
  menuActionRowSx,
  menuCaptionRowSx,
  menuDividerSx,
  menuPaperSx,
  menuSectionLabelSx,
  roomTitleSx,
} from "./CommunityHeader.styles";

const displayToggles = [
  { label: "Reactions", icon: Celebration, settingKey: "reactionsVisible" },
  { label: "Stars", icon: ModeNightIcon, settingKey: "communityAnimation" },
  { label: "Observers", icon: Visibility, settingKey: "lurkerBoxVisible" },
  { label: "Activity", icon: ModeComment, settingKey: "messageBoardVisible" },
  { label: "Timer", icon: Timer, settingKey: "timerVisible" },
];

export const CommunityHeader = ({
  navigate,
  communityName,
  hotdogOverload = false,
  readyState,
  version,
  iAmCitizen,
  onJoin,
  onLeave,
  onEditPointScheme,
  onDeleteRoom,
  settings,
  toggleReactions,
  toggleCommunityAnimation,
  toggleLurkerBox,
  toggleMessageBoard,
  toggleTimerVisible,
  embedded = false,
}) => {
  const toggleHandlers = {
    reactionsVisible: toggleReactions,
    communityAnimation: toggleCommunityAnimation,
    lurkerBoxVisible: toggleLurkerBox,
    messageBoardVisible: toggleMessageBoard,
    timerVisible: toggleTimerVisible,
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={headerBarSx(embedded)}
    >
      <ScrumLordMenu>
        <Paper sx={menuPaperSx}>
          <MenuList dense>
            <MenuItem onClick={() => navigate("/")}>
              <ListItemIcon>
                <Home fontSize="small" />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy room link</ListItemText>
            </MenuItem>

            <Divider sx={menuDividerSx} />

            {!iAmCitizen ? (
              <Box sx={menuActionRowSx}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={onJoin}
                >
                  Join room
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={menuCaptionRowSx}>
                  <Typography variant="caption" color="text.secondary">
                    Joined as &quot;{iAmCitizen.username}&quot;
                  </Typography>
                </Box>
                <Box sx={menuActionRowSx}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={onLeave}
                  >
                    Leave
                  </Button>
                </Box>
              </>
            )}

            {iAmCitizen && (
              <>
                <Divider sx={menuDividerSx} />

                <MenuItem onClick={onEditPointScheme}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit point scheme</ListItemText>
                </MenuItem>

                <Divider sx={menuDividerSx} />

                <Typography variant="overline" sx={menuSectionLabelSx}>
                  Display
                </Typography>
                {displayToggles.map(({ label, icon: Icon, settingKey }) => (
                  <MenuItem key={settingKey}>
                    <ListItemIcon>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{label}</ListItemText>
                    <Switch
                      edge="end"
                      size="small"
                      checked={settings?.[settingKey]}
                      onChange={(e) =>
                        toggleHandlers[settingKey](e.target.checked)
                      }
                    />
                  </MenuItem>
                ))}

                <Divider sx={menuDividerSx} />

                <Box sx={menuActionRowSx}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={onDeleteRoom}
                  >
                    Delete room
                  </Button>
                </Box>
              </>
            )}

            <Divider sx={menuDividerSx} />
            <Box sx={menuCaptionRowSx}>
              <Typography variant="caption" color="text.disabled">
                {version}
              </Typography>
            </Box>
          </MenuList>
        </Paper>
      </ScrumLordMenu>

      <Typography
        variant="h6"
        component="div"
        noWrap
        sx={roomTitleSx(hotdogOverload)}
      >
        {communityName}
      </Typography>

      <ConnectionStatus readyState={readyState} size={12} />
    </Stack>
  );
};
