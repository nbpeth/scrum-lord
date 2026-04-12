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
  alpha,
} from "@mui/material";
import {
  Celebration,
  ContentCopy,
  Edit,
  Home,
  ModeComment,
  Timer,
  Visibility,
} from "@mui/icons-material";
import { ConnectionStatus } from "../ConnectionStatus/ConnectionStatus";
import { ScrumLordMenu } from "../DashboardTitleMenu/DashboardTitleMenu";

/**
 * Sticky room bar: hamburger menu (nav, join/leave, display toggles, danger),
 * room title, WebSocket status.
 */
export const CommunityHeader = ({
  navigate,
  communityName,
  /** When true, title shows overload styling (server hotdog alert). */
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
  /** When true, bar is not sticky (parent rail handles `position: sticky`). */
  embedded = false,
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        ...(embedded
          ? { position: "relative", zIndex: 1 }
          : { position: "sticky", top: 0, zIndex: 10 }),
        px: 2,
        py: 1,
        borderRadius: 0,
        background: (t) => alpha(t.palette.background.default, 0.6),
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
        <ScrumLordMenu>
          <Paper
            sx={{
              width: 280,
              maxWidth: "100%",
              background: (t) => alpha(t.palette.background.paper, 0.95),
              backdropFilter: "blur(10px)",
            }}
          >
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

              <Divider sx={{ my: 1 }} />

              {!iAmCitizen ? (
                <Box sx={{ px: 2, py: 0.5 }}>
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
                  <Box sx={{ px: 2, py: 0.5, textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      Joined as &quot;{iAmCitizen.username}&quot;
                    </Typography>
                  </Box>
                  <Box sx={{ px: 2, py: 0.5 }}>
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
                  <Divider sx={{ my: 1 }} />

                  <MenuItem onClick={onEditPointScheme}>
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit point scheme</ListItemText>
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <Typography
                    variant="overline"
                    sx={{ px: 2, color: "text.secondary", lineHeight: 2.5 }}
                  >
                    Display
                  </Typography>
                  <MenuItem>
                    <ListItemIcon>
                      <Celebration fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Reactions</ListItemText>
                    <Switch
                      edge="end"
                      size="small"
                      checked={settings?.reactionsVisible}
                      onChange={(e) => toggleReactions(e.target.checked)}
                    />
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ModeNightIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Stars</ListItemText>
                    <Switch
                      edge="end"
                      size="small"
                      checked={settings?.communityAnimation}
                      onChange={(e) =>
                        toggleCommunityAnimation(e.target.checked)
                      }
                    />
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <Visibility fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Observers</ListItemText>
                    <Switch
                      edge="end"
                      size="small"
                      checked={settings?.lurkerBoxVisible}
                      onChange={(e) => toggleLurkerBox(e.target.checked)}
                    />
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ModeComment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Activity</ListItemText>
                    <Switch
                      edge="end"
                      size="small"
                      checked={settings?.messageBoardVisible}
                      onChange={(e) => toggleMessageBoard(e.target.checked)}
                    />
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <Timer fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Timer</ListItemText>
                    <Switch
                      edge="end"
                      size="small"
                      checked={settings?.timerVisible}
                      onChange={(e) => toggleTimerVisible(e.target.checked)}
                    />
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ px: 2, py: 0.5 }}>
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

              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 0.5, textAlign: "center" }}>
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
          sx={(theme) => ({
            flex: 1,
            textAlign: "center",
            ...(hotdogOverload
              ? {
                  fontSize: "clamp(1.45rem, 5vw, 2.5rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: "0.06em",
                  color: theme.palette.warning.main,
                  "@keyframes hotdog-overload-attn": {
                    "0%, 100%": {
                      textShadow: `0 0 16px ${alpha(theme.palette.warning.main, 0.95)}, 0 0 36px ${alpha(theme.palette.warning.main, 0.45)}`,
                    },
                    "33%": {
                      textShadow: `0 0 22px ${alpha(theme.palette.error.main, 0.75)}, 0 0 52px ${alpha(theme.palette.warning.main, 0.55)}`,
                    },
                    "66%": {
                      textShadow: `0 0 18px ${alpha(theme.palette.warning.light, 1)}, 0 0 44px ${alpha(theme.palette.error.main, 0.35)}`,
                    },
                  },
                  animation:
                    "hotdog-overload-attn 1.05s ease-in-out infinite",
                }
              : {
                  fontWeight: 600,
                  color: "text.primary",
                }),
          })}
        >
          {communityName}
        </Typography>

        <ConnectionStatus readyState={readyState} size={12} />
    </Stack>
  );
};
