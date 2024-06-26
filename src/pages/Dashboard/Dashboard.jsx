import {
  Alert,
  AppBar,
  Box,
  Button,
  Grid,
  Toolbar,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import useDashboard from "../../hooks/useDashboard";

import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { DashboardTitleMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";
import { StartModal } from "../../components/StartModal/StartModal";
import logoUrl from "../../scrum-lord.png";
import { useSettings } from "../../hooks/useSettings";

export const Dashboard = ({ version }) => {
  const {
    listCommunities,
    addCommunity,
    fetchCommunities,
    communityCreatedComplete,
    // privateRoomCreatedComplete,
    readyState,
  } = useDashboard();
  const { yourPrivateRooms } = useSettings();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [errorFromQuery, setErrorFromQuery] = useState(
    queryParams.get("error")
  );
  const communityList = listCommunities();
  const [communities, setCommunities] = useState(communityList);
  /*
   */
  // const communitLimitReached = communities?.length >= 10;
  const navigate = useNavigate();

  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  // get the list of communities on mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  // update the list of communities when the list changes
  useEffect(() => {
    setCommunities(communityList);
  }, [communityList]);

  // useEffect(() => {
  //   if (communitLimitReached) {
  //     setError(communitLimitReached ? "Community limit reached" : null);
  //   } else {
  //     setError(null);
  //   }
  // }, [communitLimitReached]);

  useEffect(() => {
    if (communityCreatedComplete && communityCreatedComplete.id) {
      navigate(`/communities/${communityCreatedComplete.id}`);
    }
  }, [communityCreatedComplete]);

  const createRoomClicked = () => {
    setCreateRoomModalOpen(true);
  };

  const startModalClicked = () => {
    setStartModalOpen(true);
  };

  const createRoomModalClosed = async (newCommunity) => {
    if (newCommunity) {
      try {
        await addCommunity(newCommunity);
        // navigate when the community is created
      } catch (e) {
        setError(e.message);
        setCreateRoomModalOpen(false);
        return;
      }
    }

    setCreateRoomModalOpen(false);
  };

  const getErrorMessage = (error) => {
    return {
      404: "Room not found: it either has been deleted or it never was",
      9000: "Your room was deleted while you were in it. Welcome back.",
    }[error];
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, paddingBottom: "10px" }}>
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              direction="row"
              xs={12}
            >
              <Grid container item xs={3} spacing={3}>
                <Grid item>
                  <DashboardTitleMenu
                    version={version}
                    createRoomClicked={createRoomClicked}
                  />
                </Grid>
              </Grid>
              <Grid item>
                <ConnectionStatus readyState={readyState} />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>

      {errorFromQuery && getErrorMessage(errorFromQuery) && (
        <Alert severity="error">{getErrorMessage(errorFromQuery)}</Alert>
      )}

      <CreateRoomModal
        open={createRoomModalOpen}
        handleClose={createRoomModalClosed}
        onBlur={createRoomModalClosed}
      />
      <StartModal
        open={startModalOpen}
        handleClose={() => setStartModalOpen(false)}
        onBlur={() => setStartModalOpen(false)}
        communities={communities}
        yourPrivateRooms={yourPrivateRooms}
        setCreateRoomModalOpen={setCreateRoomModalOpen}
        fullsizeScreen={fullsizeScreen}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Button
          id="dashboard-start-button"
          sx={{
            fontFamily: "monospace",
            fontSize: ".8em",
            width: "35vh",
            height: "35vh",
            borderRadius: "50%",
            boxShadow: `0px 5px 25vh 15vh ${alpha("rgb(65, 105, 225)", 0.5)}`,
            transition:
              "box-shadow 1.5s ease-in-out, font-size 1.5s ease-in-out, width 1.5s ease-in-out, height 1.5s ease-in-out",
            "&:hover": {
              boxShadow: "0px 5px 50px 10px rgb(100, 200, 255)",
              fontSize: "1.5em",
              height: "45vh",
              width: "45vh",
            },
          }}
          onClick={startModalClicked}
          // onClick={createRoomClicked}
          variant="outline"
        >
          <img
            src={logoUrl}
            alt="Scrum lord"
            style={{
              height: "20vh",
              width: "20vh",
              transition: "width 1.5s ease-in-out, height 1.5s ease-in-out",
              "&:hover": {
                height: "35vh",
                width: "35vh",
              },
            }}
          />
        </Button>
      </Box>
    </div>
  );
};
