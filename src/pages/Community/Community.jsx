import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { generate } from "random-words";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as uuidv4 from "uuid";
import { CitizenCard } from "../../components/CitizenCard/CitizenCard";
import useCommunity from "../../hooks/useCommunity";

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

  // useEffect(() => {

  // }, [iAmCitizen]);

  const [error, setError] = useState(null);

  const [selectOptions, setSelectOptions] = useState([
    0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
  ]);
  const [selectedVote, setSelectedVote] = useState(0);

  // cleanup
  // todo: user state is all sorts of messed up
  // still need something in storage
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

  const recoverUserFromStorage = () => {
    const userstate = localStorage.getItem("userstate") ?? "{}";
    const userstateObj = JSON.parse(userstate);
    const cachedUserIdForCommunity = userstateObj[communityId];
    const citizens = currentCommunity?.citizens || [];

    if (cachedUserIdForCommunity && citizens.length) {
      const user = citizens.find((citizen) => citizen.userId === cachedUserIdForCommunity);
      setIAmCitizen(user);
    }
  };

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

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                Scrum Lord
              </Link>
            </Typography>
            {!iAmCitizen ? (
              <Button variant="contained" color="primary" onClick={handleJoin}>
                Join
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleLeave}>
                Leave
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      {currentCommunity ? (
        <Grid container direction="column">
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
            <Grid item xs={12}>
              <Typography variant="h3">{error}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <h1>{currentCommunity.name}</h1>
            <p>{currentCommunity.id}</p>
          </Grid>
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
                <p>This community has no citizens!</p>
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
      ) : null}
    </>
  );
};
