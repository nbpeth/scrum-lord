import ModeNightIcon from "@mui/icons-material/ModeNight";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Snackbar,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/useCommunity";

import { Home } from "@mui/icons-material";
import * as React from "react";
import { CommunityCitizens } from "../../components/CommunityCitizens/CommunityCitizens";
import { CommunityControls } from "../../components/CommunityControls/CommunityControls";
import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { ScrumLordMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";
import { DeleteCommunityModal } from "../../components/DeleteCommunityModal.jsx/DeleteCommunityModal";
import { JoinCommunityModal } from "../../components/JoinCommunityModal/JoinCommunityModal";
import { Stars } from "../../components/Particles/Stars";

export const Community = () => {
  const params = useParams();
  const communityId = params.communityId;
  const navigate = useNavigate();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  const {
    alertMessage,
    clearAlertMessage,
    joinCommunity,
    leaveCommunity,
    handleReveal,
    handleReset,
    community: currentCommunity,
    submitVote,
    deleteCommunity,
    roomEvents,
    readyState,
  } = useCommunity();

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
      navigate("/?error=9000", {
        state: { alertMessage: "Community deleted" },
      });
    }
  }, [roomEvents, currentCommunity]);

  const citizens = currentCommunity?.citizens || [];
  const [iAmCitizen, setIAmCitizen] = useState(null);
  const [error, setError] = useState(null);
  const [joinCommunityModalOpen, setJoinCommunityModalOpen] = useState(false);
  const [deleteCommunityModalOpen, setDeleteCommunityModalOpen] =
    useState(false);

  const [controlsList, setControlsList] = useState({
    partyModeEngaged: false,
  });

  // cleanup
  // todo: user state is all sorts of messed up
  // delete causing some wild re-renders, cycling through users

  // go with mongo?
  // recover user from storage
  useEffect(() => {
    recoverUserFromStorage();
  }, [currentCommunity]);

  const handleJoin = () => {
    setJoinCommunityModalOpen(true);
  };

  const handleJoinCommunityModalClose = (newUser) => {
    if (!newUser) {
      setJoinCommunityModalOpen(false);
      return;
    }
    const { username, userId } = newUser;
    saveUserToStorage(userId);

    try {
      joinCommunity({ communityId, userId, username });
      setIAmCitizen({ userId, username });
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

  const handleDeleteUser = (citizen) => {
    // console.log("deleting user", citizen);
    handleLeave({
      communityId,
      userId: citizen.userId,
      username: citizen.username,
    });
  };

  const handleLeave = ({ communityId: id, userId, username }) => {

    try {
      leaveCommunity({
        communityId: id ?? communityId,
        userId: userId ?? iAmCitizen.userId,
        username: username ?? iAmCitizen.username,
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
      // redirect everyone with a message to the dashboard
    }

    setDeleteCommunityModalOpen(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {controlsList?.partyModeEngaged && <Stars />}
        <JoinCommunityModal
          open={joinCommunityModalOpen}
          handleClose={handleJoinCommunityModalClose}
        />

        <DeleteCommunityModal
          open={deleteCommunityModalOpen}
          handleClose={onDeleteCommunityModalClose}
          currentCommunity={currentCommunity}
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
                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={handleLeave}
                      >
                        Leave
                      </Button>
                    )}
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <ModeNightIcon />
                    </ListItemIcon>
                    <Switch
                      checked={!!controlsList?.partyModeEngaged}
                      onChange={() => {
                        setControlsList({
                          ...controlsList,
                          partyModeEngaged: !controlsList.partyModeEngaged,
                        });
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
                  </MenuItem>
                </MenuList>
              </Paper>
            </ScrumLordMenu>

            {/* <Link to="/" style={{ textDecoration: "none" }}>
            <img src={logoUrl} height="50" width="50" />
          </Link> */}
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              {currentCommunity && currentCommunity.name}
            </Typography>
            <ConnectionStatus readyState={readyState} />
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container xs={12} spacing={3}>
        <Grid item xs={fullsizeScreen ? 3 : 12} xl={fullsizeScreen ? 2 : 12}>
          {/* <Grid item>
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src={logoUrl} height="250" width="250" />
            </Link>
          </Grid> */}
          <CommunityControls
            controlsList={controlsList}
            setControlsList={setControlsList}
            community={currentCommunity}
            handleReveal={handleReveal}
            handleReset={handleReset}
            iAmCitizen={iAmCitizen}
            communityId={communityId}
            submitVote={submitVote}
          />
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
                  onClose={handleAlertClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
              {error && (
                // <Grid item xs={12}>
                <Typography variant="h3">{error}</Typography>
                //  </Grid>
              )}

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
