import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/useCommunity";
import logoUrl from "../../scrumlord-logo-1.jpg";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import { CommunityCitizens } from "../../components/CommunityCitizens/CommunityCitizens";
import { CommunityControls } from "../../components/CommunityControls/CommunityControls";
import { JoinCommunityModal } from "../../components/JoinCommunityModal/JoinCommunityModal";
import { Stars } from "../../components/Particles/Stars";
import { Delete } from "@mui/icons-material";
import { DeleteCommunityModal } from "../../components/DeleteCommunityModal.jsx/DeleteCommunityModal";
import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";

export const Community = () => {
  const params = useParams();
  const communityId = params.communityId;
  const navigate = useNavigate();

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
    readyState
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
      navigate("/?error=9000", { state: { alertMessage: "Community deleted" }});
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
    console.log("deleting user", citizen);
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

  // drawer
  const drawerWidth = 240;
  const theme = useTheme();

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // extract these things out
  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),

      ...(open && {
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    })
  );

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));
  // drawer

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* appbar component */}
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

        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>

            <Link to="/" style={{ textDecoration: "none" }}>
              <img src={logoUrl} height="50" width="50" />
            </Link>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              {currentCommunity && currentCommunity.name}
            </Typography>
            <ConnectionStatus readyState={readyState} />
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />

          <CommunityControls
            handleDeleteCommunity={handleDeleteCommunity}
            controlsList={controlsList}
            setControlsList={setControlsList}
            community={currentCommunity}
            handleReveal={handleReveal}
            handleReset={handleReset}
            handleJoin={handleJoin}
            handleLeave={handleLeave}
            iAmCitizen={iAmCitizen}
            communityId={communityId}
            submitVote={submitVote}
          />

          <Divider />
        </Drawer>
        {/* appbar component */}
      </Box>
      {currentCommunity ? (
        <Main open={open}>
          <DrawerHeader />
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
        </Main>
      ) : null}
    </>
  );
};
