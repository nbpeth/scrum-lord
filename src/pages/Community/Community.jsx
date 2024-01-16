import ModeNightIcon from "@mui/icons-material/ModeNight";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Snackbar,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/useCommunity";

import { Celebration, Home, ModeComment } from "@mui/icons-material";
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

export const Community = ({
  handleCommunityBackgroundAnimationChange,
  handleCelebrationChange,
}) => {
  const params = useParams();
  const communityId = params.communityId;
  const navigate = useNavigate();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  const {
    alertMessage,
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
    communityReaction,
    messageHistory,
    startTimer,
  } = useCommunity();

  const {
    settings,
    toggleCommunityAnimation,
    toggleMessageBoard,
    toggleReactions,
  } = useSettings();

  const theme = useTheme();
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
      setTimeout(() => {
        navigate("/?error=9000", {
          state: { alertMessage: "Community deleted" },
        });
      }, 2000);
    }
  }, [roomEvents, currentCommunity]);

  const citizens = currentCommunity?.citizens || [];
  const [iAmCitizen, setIAmCitizen] = useState(null);
  const [error, setError] = useState(null);
  const [joinCommunityModalOpen, setJoinCommunityModalOpen] = useState(false);
  const [editPointSchemeModalOpen, setEditPointSchemeModalOpen] =
    useState(false);
  const [deleteCommunityModalOpen, setDeleteCommunityModalOpen] =
    useState(false);

  console.log(settings);
  useEffect(() => {
    handleCommunityBackgroundAnimationChange(settings?.communityAnimation);
  }, [settings]);

  useEffect(() => {
    recoverUserFromStorage();

    if (currentCommunity?.isSynergized) {
      handleCelebrationChange(true);
      setTimeout(() => {
        // const audio = new Audio("path_to_your_sound_file.mp3");
        handleCelebrationChange(false);
      }, 5000);
    }
  }, [currentCommunity]);

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

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    clearAlertMessage();
  };

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

        <AppBar position="static">
          <Toolbar>
            <ScrumLordMenu>
              <Paper sx={{ width: 250, maxWidth: "100%" }}>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    <ListItemIcon>
                      <Home />
                    </ListItemIcon>
                    <ListItemText secondary="Home" />
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ flexGrow: 1 }}
                    ></Typography>
                  </MenuItem>

                  <Divider />
                  <MenuItem>
                    {!iAmCitizen ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        onClick={handleJoin}
                      >
                        Join
                      </Button>
                    ) : (
                      <Grid container xs={12}>
                        <Grid
                          item
                          xs={12}
                          sx={{ textAlign: "center", paddingBottom: "10px" }}
                        >
                          <Typography variant="body2" color={"gray"}>
                            Joined as: "{iAmCitizen.username}"
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            onClick={handleLeave}
                          >
                            Leave
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </MenuItem>
                  <Divider />
                  {iAmCitizen && (
                    <>
                      <MenuItem>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="success"
                          onClick={() => setEditPointSchemeModalOpen(true)}
                        >
                          Edit Point Scheme
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <ListItemIcon>
                          <ModeNightIcon />
                        </ListItemIcon>
                        <ListItemText secondary="Stars" />

                        <Switch
                          checked={settings?.communityAnimation}
                          onChange={(e) => {
                            toggleCommunityAnimation(e.target.checked);
                          }}
                        />
                      </MenuItem>
                      <MenuItem>
                        <ListItemIcon>
                          <ModeComment />
                        </ListItemIcon>
                        <ListItemText secondary="Activity" />

                        <Switch
                          checked={settings?.messageBoardVisible}
                          onChange={(e) => {
                            toggleMessageBoard(e.target.checked);
                          }}
                        />
                      </MenuItem>
                      <MenuItem>
                        <ListItemIcon>
                          <Celebration />
                        </ListItemIcon>
                        <ListItemText secondary="Reaction Panel" />

                        <Switch
                          checked={settings?.reactionsVisible}
                          onChange={(e) => {
                            toggleReactions(e.target.checked);
                          }}
                        />
                      </MenuItem>
                      <Divider />
                      <MenuItem>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          onClick={handleDeleteCommunity}
                        >
                          Delete Room
                        </Button>
                      </MenuItem>{" "}
                    </>
                  )}
                </MenuList>
              </Paper>
            </ScrumLordMenu>

            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              {currentCommunity && currentCommunity.name}
            </Typography>
            <ConnectionStatus readyState={readyState} />
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container xs={12} spacing={3}>
        <Grid
          container
          item
          xs={fullsizeScreen ? 3 : 12}
          xl={fullsizeScreen ? 2 : 12}
        >
          {/* <Grid item>
            <PointChart community={currentCommunity} />
          </Grid> */}
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
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: settings?.communityAnimationEnabled
                ? "none"
                : theme.palette.background.paper,
            }}
          >
            {settings?.messageBoardVisible && (
              <MessageBoard
                messageHistory={messageHistory}
                communityId={communityId}
              />
            )}
          </Grid>
        </Grid>

        <Grid item xs={fullsizeScreen ? 9 : 12} sx={{ paddingTop: 10 }}>
          {currentCommunity ? (
            <>
              <Snackbar
                open={Boolean(alertMessage)}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  // onClose={handleAlertClose}
                  severity={alertMessage?.severity ?? "info"}
                  sx={{ width: "100%" }}
                >
                  {alertMessage?.message}
                </Alert>
              </Snackbar>

              <CommunityCitizens
                citizens={citizens}
                iAmCitizen={iAmCitizen}
                handleDeleteUser={handleDeleteUser}
                currentCommunity={currentCommunity}
              />
            </>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};
