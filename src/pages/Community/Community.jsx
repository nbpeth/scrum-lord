import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Toolbar,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { generate } from "random-words";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as uuidv4 from "uuid";
import { CitizenCard } from "../../components/CitizenCard/CitizenCard";
import useCommunity from "../../hooks/useCommunity";
import logoUrl from "../../scrumlord-logo-1.jpg";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MuiAppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

export const Community = () => {
  const params = useParams();
  const communityId = params.communityId;

  const {
    alertMessage,
    clearAlertMessage,
    joinCommunity,
    leaveCommunity,
    community: currentCommunity,
    submitVote,
  } = useCommunity();

  const citizens = currentCommunity?.citizens || [];
  const [iAmCitizen, setIAmCitizen] = useState(null);
  const [error, setError] = useState(null);

  const [selectOptions, setSelectOptions] = useState([
    0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
  ]);
  const [selectedVote, setSelectedVote] = useState(0);

  // cleanup
  // todo: user state is all sorts of messed up
  // delete causing some wild re-renders, cycling through users

  // go with mongo? https://cloud.mongodb.com/v2/6467e716e89e772d85c3b74c#/clusters
  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  // recover user from storage
  useEffect(() => {
    recoverUserFromStorage();
  }, [currentCommunity]);

  const handleVoteChange = (event) => {
    setSelectedVote(event.target.value);
  };

  const onVoteSubmit = () => {
    submitVote({ communityId, userId: iAmCitizen.userId, vote: selectedVote });
  };

  const handleJoin = () => {
    const username = generate({ exactly: 2, minLength: 5, join: " " });
    const userId = uuidv4.v4();
    saveUserToStorage(userId);

    try {
      joinCommunity({ communityId, userId, username });

      setIAmCitizen({ userId, username });
    } catch (e) {
      console.error(e);
      error(e.message);

      return;
    }
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
      error(e.message);

      return;
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    clearAlertMessage();
  };

  const drawerWidth = 240;

  const theme = useTheme();



  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* appbar component */}
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
            {/* {!iAmCitizen ? (
              <Button variant="contained" color="primary" onClick={handleJoin}>
                Join
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleLeave}>
                Leave
              </Button>
            )} */}
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
          <List>
            {/* join component */}
            {!iAmCitizen ? (
              <Button variant="outlined" color="success" onClick={handleJoin}>
                Join
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLeave}
              >
                Leave
              </Button>
            )}
          </List>
          {/* join component */}

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
          {/* <Grid item xs={12}>
            <h1>{currentCommunity.name}</h1>
          </Grid> */}
          <Grid container direction="column">
            <Grid container item>
              {citizens.length ? (
                citizens.map((citizen) => {
                  return (
                    <Grid item xs={3} key={citizen.userId}>
                      <CitizenCard
                        handleDeleteUser={handleDeleteUser}
                        iAmCitizen={iAmCitizen}
                        citizen={citizen}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <p>No one is here</p>
                </Grid>
              )}
            </Grid>
            <Grid container item>
              {iAmCitizen && (
                <Grid item xs={12}>
                  <Button variant="contained" onClick={onVoteSubmit}>
                    Vote
                  </Button>
                  <Select
                    labelId="vote-selector-label"
                    id="vote-selector"
                    value={selectedVote}
                    label="Vote"
                    onChange={handleVoteChange}
                  >
                    {selectOptions.map((option) => {
                      return (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Main>
      ) : null}
    </>
  );
};
