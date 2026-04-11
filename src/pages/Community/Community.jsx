import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import {
  Box,
  Button,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/useCommunity";

import {
  Celebration,
  ContentCopy,
  Edit,
  Home,
  ModeComment,
  Timer,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import * as React from "react";
import { CommunityCitizens } from "../../components/CommunityCitizens/CommunityCitizens";
import { CommunityControls } from "../../components/CommunityControls/CommunityControls";
import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { ScrumLordMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";
import { DeleteCommunityModal } from "../../components/DeleteCommunityModal.jsx/DeleteCommunityModal";
import { EditPointSchemeModal } from "../../components/EditPointSchemeModal/EditPointSchemeModal";
import { JoinCommunityModal } from "../../components/JoinCommunityModal/JoinCommunityModal";
import { MessageBoard } from "../../components/MessageBoard/MessageBoard";
// import { PointChart } from "../../components/PointChart/PointChart";
import { useSettings } from "../../hooks/useSettings";
// import { ReactionMachine } from "../../components/ReactionMachine/ReactionMachine";

export const Community = ({
  handleCommunityBackgroundAnimationChange,
  handleCelebrationChange,
  version,
}) => {
  const params = useParams();
  const communityId = params.communityId;
  const navigate = useNavigate();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  const {
    // alertMessage,
    cancelTimer,
    clearAlertMessage,
    joinCommunity,
    editPointScheme,
    leaveCommunity,
    handleReveal,
    handleReset,
    community: currentCommunity,
    submitVote,
    deleteCommunity,
    roomEvents,
    readyState,
    reconnection,
    communityReaction,
    messageHistory,
    startTimer,
  } = useCommunity();

  const {
    settings,
    toggleCommunityAnimation,
    toggleMessageBoard,
    toggleReactions,
    toggleLurkerBox,
    toggleTimerVisible,
    removePrivateRoom,
    updatePrivateRooms,
  } = useSettings();

  const theme = useTheme();

  const citizens = currentCommunity?.citizens || [];
  const [iAmCitizen, setIAmCitizen] = useState(null);
  const [error, setError] = useState(null);
  const [joinCommunityModalOpen, setJoinCommunityModalOpen] = useState(false);
  const [editPointSchemeModalOpen, setEditPointSchemeModalOpen] =
    useState(false);
  const [deleteCommunityModalOpen, setDeleteCommunityModalOpen] =
    useState(false);

  useEffect(() => {
    recoverUserFromStorage();

    // set the current room to the stored rooms
    updatePrivateRooms(currentCommunity);

    if (currentCommunity?.isSynergized) {
      handleCelebrationChange(true);
      setTimeout(() => {
        // const audio = new Audio("path_to_your_sound_file.mp3");
        handleCelebrationChange(false);
      }, 5000);
    }
  }, [currentCommunity]);

  // handle external room events
  useEffect(() => {
    if (!roomEvents) {
      return;
    }
    if (
      roomEvents.communityDeleted &&
      roomEvents.communityDeleted[communityId] &&
      roomEvents.communityDeleted[communityId].deleted === true
    ) {
      // delay the redirect so the user can see the alert message
      // todo: need an alert message
      // move this to the hook to delete from storage
      setTimeout(() => {
        navigate("/?error=9000", {
          state: { alertMessage: "Community deleted" },
        });
      }, 2000);
    }
  }, [roomEvents, currentCommunity]);

  useEffect(() => {
    handleCommunityBackgroundAnimationChange(settings?.communityAnimation);
  }, [settings]);

  const handleJoin = () => {
    setJoinCommunityModalOpen(true);
  };

  const handleJoinCommunityModalClose = (newUser) => {
    if (!newUser) {
      setJoinCommunityModalOpen(false);
      return;
    }

    const { username, userId, votingMember, userColor } = newUser;
    saveUserToStorage(userId);

    try {
      joinCommunity({ communityId, userId, username, userColor, votingMember });
      setIAmCitizen({ userId, username, votingMember, userColor });
    } catch (e) {
      console.error(e);
      setError(e.message);
    }

    setJoinCommunityModalOpen(false);
  };

  // reclaim your user for a community if you've joined and returned
  const recoverUserFromStorage = () => {
    const userstate = localStorage.getItem("userstate") ?? "{}";
    const userstateObj = JSON.parse(userstate);
    const cachedUserIdForCommunity = userstateObj[communityId];
    const citizens = currentCommunity?.citizens || [];

    if (cachedUserIdForCommunity && citizens.length) {
      // todo: this could be the place where we clear an "idle" status on a user - they've logged back in and reclaimed their user
      const user = citizens.find(
        (citizen) => citizen.userId === cachedUserIdForCommunity
      );
      setIAmCitizen(user);
    }
  };

  // when a user joins, save their id to local storage for this session so they can reclaim their user if they return
  const saveUserToStorage = (userId) => {
    const userState = localStorage.getItem("userstate") || "{}";
    const userStateObj = JSON.parse(userState);
    userStateObj[communityId] = userId;

    localStorage.setItem("userstate", JSON.stringify(userStateObj));
  };

  const handleTimerClicked = ({ communityId, timerValue }) => {
    if (currentCommunity?.timer?.running) {
      cancelTimer({
        username: iAmCitizen.username,
        userId: iAmCitizen.userId,
        userColor: iAmCitizen.userColor,
      });
    } else {
      startTimer({
        timerLength: timerValue,
        username: iAmCitizen.username,
        userId: iAmCitizen.userId,
        userColor: iAmCitizen.userColor,
      });
    }
  };

  const handleDeleteUser = (citizen) => {
    handleLeave({
      communityId,
      userId: citizen.userId,
      username: citizen.username,
    });
  };

  const handleLeave = ({ communityId: id, userId, username, userColor }) => {
    try {
      leaveCommunity({
        communityId: id ?? communityId,
        userId: userId ?? iAmCitizen.userId,
        username: username ?? iAmCitizen.username,
        userColor: iAmCitizen?.userColor,
      });
      setIAmCitizen(null);
    } catch (e) {
      console.error(e);
      setError(e.message);

      return;
    }
  };

  // const handleAlertClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   clearAlertMessage();
  // };

  const handleDeleteCommunity = () => {
    setDeleteCommunityModalOpen(true);
  };

  const onDeleteCommunityModalClose = (communityId) => {
    if (communityId) {
      deleteCommunity({
        communityId,
        userId: iAmCitizen?.userId,
        username: iAmCitizen?.username,
      });
    }

    setDeleteCommunityModalOpen(false);
  };

  // console.log("currentCommunity", currentCommunity?.citizens);

  const lurkers =
    currentCommunity?.citizens?.filter((c) => !c?.votingMember) || [];

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <JoinCommunityModal
          open={joinCommunityModalOpen}
          handleClose={handleJoinCommunityModalClose}
        />

        <DeleteCommunityModal
          open={deleteCommunityModalOpen}
          handleClose={onDeleteCommunityModalClose}
          currentCommunity={currentCommunity}
        />

        <EditPointSchemeModal
          editPointScheme={editPointScheme}
          open={editPointSchemeModalOpen}
          handleClose={() => setEditPointSchemeModalOpen(false)}
          currentCommunity={currentCommunity}
          iamCitizen={iAmCitizen}
          community={currentCommunity}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            px: 2,
            py: 1,
            borderRadius: 0,
            background: (t) =>
              alpha(t.palette.background.default, 0.6),
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
                {/* Navigation */}
                <MenuItem onClick={() => navigate("/")}>
                  <ListItemIcon><Home fontSize="small" /></ListItemIcon>
                  <ListItemText>Home</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy room link</ListItemText>
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                {/* Join / Leave */}
                {!iAmCitizen ? (
                  <Box sx={{ px: 2, py: 0.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={handleJoin}
                    >
                      Join room
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ px: 2, py: 0.5, textAlign: "center" }}>
                      <Typography variant="caption" color="text.secondary">
                        Joined as "{iAmCitizen.username}"
                      </Typography>
                    </Box>
                    <Box sx={{ px: 2, py: 0.5 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={handleLeave}
                      >
                        Leave
                      </Button>
                    </Box>
                  </>
                )}

                {iAmCitizen && (
                  <>
                    <Divider sx={{ my: 1 }} />

                    {/* Room actions */}
                    <MenuItem
                      onClick={() => setEditPointSchemeModalOpen(true)}
                    >
                      <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                      <ListItemText>Edit point scheme</ListItemText>
                    </MenuItem>

                    <Divider sx={{ my: 1 }} />

                    {/* Toggles */}
                    <Typography
                      variant="overline"
                      sx={{ px: 2, color: "text.secondary", lineHeight: 2.5 }}
                    >
                      Display
                    </Typography>
                    <MenuItem>
                      <ListItemIcon><Celebration fontSize="small" /></ListItemIcon>
                      <ListItemText>Reactions</ListItemText>
                      <Switch
                        edge="end"
                        size="small"
                        checked={settings?.reactionsVisible}
                        onChange={(e) => toggleReactions(e.target.checked)}
                      />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon><ModeNightIcon fontSize="small" /></ListItemIcon>
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
                      <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
                      <ListItemText>Observers</ListItemText>
                      <Switch
                        edge="end"
                        size="small"
                        checked={settings?.lurkerBoxVisible}
                        onChange={(e) => toggleLurkerBox(e.target.checked)}
                      />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon><ModeComment fontSize="small" /></ListItemIcon>
                      <ListItemText>Activity</ListItemText>
                      <Switch
                        edge="end"
                        size="small"
                        checked={settings?.messageBoardVisible}
                        onChange={(e) => toggleMessageBoard(e.target.checked)}
                      />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon><Timer fontSize="small" /></ListItemIcon>
                      <ListItemText>Timer</ListItemText>
                      <Switch
                        edge="end"
                        size="small"
                        checked={settings?.timerVisible}
                        onChange={(e) => toggleTimerVisible(e.target.checked)}
                      />
                    </MenuItem>

                    <Divider sx={{ my: 1 }} />

                    {/* Danger zone */}
                    <Box sx={{ px: 2, py: 0.5 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleDeleteCommunity}
                      >
                        Delete room
                      </Button>
                    </Box>
                  </>
                )}

                {/* Version footer */}
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
            sx={{
              flex: 1,
              fontWeight: 600,
              color: "text.primary",
              textAlign: "center",
            }}
          >
            {currentCommunity?.name}
          </Typography>

          <ConnectionStatus readyState={readyState} size={12} />
        </Stack>
      </Box>

      <Grid container xs={12} spacing={3}>
        {/* desktop component */}
        {fullsizeScreen && (
          <>
            <Grid item xs={9} sx={{ paddingTop: 10 }}>
              {currentCommunity ? (
                <Grid container item xs={12} justifyContent="space-between">
                  {settings?.lurkerBoxVisible && fullsizeScreen && (
                    <Grid item xs={2} sx={{ paddingTop: "10px" }}>
                      <LurkerBox
                        lurkers={lurkers}
                        handleDeleteUser={handleDeleteUser}
                      />
                    </Grid>
                  )}
                  <Grid
                    item
                    justifyContent="center"
                    xs={settings?.lurkerBoxVisible ? 10 : 12}
                  >
                    <CommunityCitizens
                      citizens={citizens}
                      iAmCitizen={iAmCitizen}
                      handleDeleteUser={handleDeleteUser}
                      currentCommunity={currentCommunity}
                    />
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
            <Grid container item xs={3}>
              <Grid item xs={12}>
                <CommunityControls
                  handleTimerClicked={handleTimerClicked}
                  community={currentCommunity}
                  handleReveal={handleReveal}
                  handleReset={handleReset}
                  iAmCitizen={iAmCitizen}
                  communityId={communityId}
                  submitVote={submitVote}
                  communityReaction={communityReaction}
                  settings={settings}
                />
              </Grid>

              {settings?.messageBoardVisible && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: settings?.communityAnimationEnabled
                      ? "none"
                      : theme.palette.background.paper,
                  }}
                >
                  <MessageBoard
                    messageHistory={messageHistory}
                    communityId={communityId}
                  />
                </Grid>
              )}
            </Grid>
          </>
        )}
        {/* mobile component */}
        {!fullsizeScreen && (
          <>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <CommunityControls
                  handleTimerClicked={handleTimerClicked}
                  community={currentCommunity}
                  handleReveal={handleReveal}
                  handleReset={handleReset}
                  iAmCitizen={iAmCitizen}
                  communityId={communityId}
                  submitVote={submitVote}
                  communityReaction={communityReaction}
                  settings={settings}
                />
              </Grid>

              {settings?.messageBoardVisible && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    backgroundColor: settings?.communityAnimationEnabled
                      ? "none"
                      : theme.palette.background.paper,
                  }}
                >
                  <MessageBoard
                    messageHistory={messageHistory}
                    communityId={communityId}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 10 }}>
              {currentCommunity ? (
                <Grid container item xs={12} justifyContent="space-between">
                  {settings?.lurkerBoxVisible && (
                    <Grid item xs={2} sx={{ paddingTop: "10px" }}>
                      <LurkerBox
                        lurkers={lurkers}
                        handleDeleteUser={handleDeleteUser}
                      />
                    </Grid>
                  )}
                  <Grid
                    item
                    justifyContent="center"
                    xs={settings?.lurkerBoxVisible ? 10 : 12}
                  >
                    <CommunityCitizens
                      citizens={citizens}
                      iAmCitizen={iAmCitizen}
                      handleDeleteUser={handleDeleteUser}
                      currentCommunity={currentCommunity}
                    />
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export const LurkerBox = ({ lurkers, handleDeleteUser }) => {
  const theme = useTheme();
  // const fullsizeScreen = useMediaQuery("(min-width:800px)");

  return (
    <div>
      <Grid
        id="lurker-box"
        container
        direction="column"
        sx={{ paddingLeft: "15px" }}
        alignContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item>
          <Tooltip
            title={`Non-voting members: ${lurkers.length} present`}
            arrow
            placement="top-end"
          >
            {lurkers.length > 0 ? (
              <Visibility color="warning" />
            ) : (
              <VisibilityOff color="info" />
            )}
          </Tooltip>
        </Grid>
        <div
        // style={{ height: "50px", overflow: "hidden", overflowY: "scroll" }}
        >
          <Grid id="lurker-box-list" container item direction="column">
            {lurkers.map((lurker) => {
              return (
                <Grid container id="lurker-box-list-item" key={lurker.userId}>
                  <Grid item>
                    <DeleteTwoToneIcon
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeleteUser(lurker)}
                    />
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{ whiteSpace: "nowrap" }}
                      variant="subtitle2"
                      fontSize="small"
                      color={theme.palette.grey[500]}
                      key={lurker.userId}
                    >
                      {lurker.username}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </div>
        {/* <div style={{ }}>
          <ReactionMachine />
        </div> */}
      </Grid>
    </div>
  );
};
