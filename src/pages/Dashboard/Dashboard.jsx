import {
  AppBar,
  Box,
  Card,
  CardContent,
  Grid,
  Toolbar,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import useDashboard from "../../hooks/useDashboard";

import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { HyperSpace } from "../../components/Particles/Hyperspace";
import logoUrl from "../../scrumlord-logo-2.png";
import { DashboardTitleMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";

export const Dashboard = () => {
  const { listCommunities, addCommunity, fetchCommunities, readyState } =
    useDashboard();
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const communityList = listCommunities();
  const [communities, setCommunities] = useState(communityList);
  const theme = useTheme();

  // get the list of communities on mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  // update the list of communities when the list changes
  useEffect(() => {
    setCommunities(communityList);
  }, [communityList]);

  const createRoomClicked = () => {
    setCreateRoomModalOpen(true);
  };

  const createRoomModalClosed = (newCommunity) => {
    if (newCommunity) {
      try {
        addCommunity(newCommunity);
        // navigate when the community is created
      } catch (e) {
        setError(e.message);
        setCreateRoomModalOpen(false);
        return;
      }
    }

    setCreateRoomModalOpen(false);
  };

  // todo: idle time counter and self delete

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
            >
              <Grid item>
                <DashboardTitleMenu createRoomClicked={createRoomClicked} />
              </Grid>
              <Grid item>
                <ConnectionStatus readyState={readyState} />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
      <CreateRoomModal
        open={createRoomModalOpen}
        handleClose={createRoomModalClosed}
        onBlur={createRoomModalClosed}
      />
      <img height="50%" width="50%" src={logoUrl} alt="Scrum lord" />

      <Grid container spacing={2} direction="column">
        <Grid item></Grid>
        {error && (
          <Grid item xs={12}>
            <Typography variant="h3">{error}</Typography>
          </Grid>
        )}

        <Grid item></Grid>

        {/* communities component */}
        <Grid container item spacing={2} justifyContent="center">
          {communities.map((community) => {
            return (
              <Grid item key={community.id}>
                <NavLink
                  to={`/communities/${community.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      backgroundColor: alpha(theme.palette.secondary.dark, 0.5),
                      cursor: "pointer",
                      transition: "background .5s ease-in-out",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.secondary.dark, 1),
                      },
                    }}
                  >
                    <CardContent>
                      <h3>{community.name}</h3>
                    </CardContent>
                  </Card>
                </NavLink>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
};
