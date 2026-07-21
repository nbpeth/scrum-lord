import { GroupAdd, HelpOutline, Refresh } from "@mui/icons-material";
import {
  alpha,
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
  useTheme,
} from "@mui/material";
import { generate } from "random-words";
import { useState } from "react";
import * as uuid from "uuid";

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

/**
 * Join dialog surface: no backdrop-filter so tsParticles behind the panel stay
 * sharp (frosted glass would blur whatever is drawn under it).
 */
const dialogPaperSx = (theme) => ({
  position: "relative",
  zIndex: 1,
  pointerEvents: "auto",
  width: { xs: "calc(100% - 32px)", sm: 420 },
  maxWidth: "100%",
  maxHeight: "90vh",
  overflow: "auto",
  p: 3,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  background: alpha(theme.palette.background.default, 0.92),
  boxShadow: `0 16px 48px ${alpha(theme.palette.common.black, 0.45)}`,
  outline: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
});

export const JoinCommunityModal = ({ open, handleClose }) => {
  const theme = useTheme();

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
      BackdropProps={{
        sx: {
          backgroundColor: alpha(theme.palette.common.black, 0.48),
        },
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={dialogPaperSx(theme)}>
          <Stack spacing={2.5} sx={{ width: "100%", boxSizing: "border-box" }}>
            <Typography
              variant="subtitle1"
              component="h2"
              fontWeight={600}
              sx={{ width: "100%", textAlign: "left" }}
            >
              Join room
            </Typography>

            <Stack spacing={2} sx={{ width: "100%" }}>
              {votingMemberChecked && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ width: "100%" }}
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
                    sx={{ flex: 1, minWidth: 0 }}
                  />
                  <Refresh
                    onClick={() =>
                      setNewUser({ ...newUser, username: randomUserName() })
                    }
                    sx={{
                      flexShrink: 0,
                      cursor: "pointer",
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
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
                sx={{ width: "100%", flexWrap: "wrap" }}
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
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: "text.secondary",
                      cursor: "default",
                      ml: 0.25,
                    }}
                  >
                    <HelpOutline
                      sx={{ fontSize: 16 }}
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
                sx={{
                  width: "100%",
                  pt: 2.5,
                  mt: 0.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  boxSizing: "border-box",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onClose()}
                  sx={(t) => ({
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                    py: 0.875,
                    borderRadius: 1.5,
                    borderColor: alpha(t.palette.error.main, 0.65),
                    color: "error.main",
                    "&:hover": {
                      borderColor: "error.main",
                      backgroundColor: alpha(t.palette.error.main, 0.08),
                    },
                  })}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onJoin}
                  disabled={votingMemberChecked && !newUser?.username}
                  startIcon={<GroupAdd sx={{ fontSize: 18 }} />}
                  sx={(t) => ({
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.25,
                    py: 0.875,
                    borderRadius: 1.5,
                    boxShadow: "none",
                    minWidth: 120,
                    "&:hover": {
                      boxShadow: `0 4px 16px ${alpha(
                        t.palette.primary.main,
                        0.42
                      )}`,
                    },
                    "&.Mui-disabled": {
                      boxShadow: "none",
                    },
                  })}
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
  const theme = useTheme();

  return (
    <Select
      fullWidth
      size="small"
      id="color-selector"
      value={value}
      onChange={(e) => onColorChange(e.target.value)}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 360,
            background: alpha(theme.palette.background.default, 0.95),
            backdropFilter: "blur(12px)",
            border: "1px solid",
            borderColor: "divider",
          },
        },
      }}
    >
      {USER_COLORS.map((color) => (
        <MenuItem key={color} value={color}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                height: 12,
                width: 12,
                borderRadius: 0.5,
                backgroundColor: color,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {color}
            </Typography>
          </Stack>
        </MenuItem>
      ))}
    </Select>
  );
};
