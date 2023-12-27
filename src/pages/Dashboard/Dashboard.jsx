import { AppBar, Box, Button, Card, CardContent, Grid, Toolbar, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import useDashboard from "../../hooks/useDashboard";
import { alpha } from "@mui/material";


import logoUrl from "../../scrumlord-logo-2.png";
import { Stars } from "../../components/Particles/Stars";
import { HyperSpace } from "../../components/Particles/Hyperspace";

export const Dashboard = () => {
  const { listCommunities, addCommunity, fetchCommunities } = useDashboard();
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
      } catch (e) {
        setError(e.message);
        setCreateRoomModalOpen(false);

        return;
      }
    }

    setCreateRoomModalOpen(false);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, paddingBottom: "10px" }}>
        <AppBar position="static">
          <Toolbar>
          <Button
            variant="contained"
            disabled={createRoomModalOpen}
            onClick={createRoomClicked}
          >
            Create Room
          </Button>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
          </Toolbar>
        </AppBar>
      </Box>
      <CreateRoomModal
        open={createRoomModalOpen}
        handleClose={createRoomModalClosed}
        onBlur={createRoomModalClosed}
      />
      <img height="50%" width="50%" src={logoUrl} alt="Scrum lord" />
      <HyperSpace />
      <Grid container spacing={2} direction="column">
        <Grid item></Grid>
        {error && (
          <Grid item xs={12}>
            <Typography variant="h3">{error}</Typography>
          </Grid>
        )}

        <Grid item>
         
        </Grid>

        {/* communities component */}
        <Grid container item spacing={2} justifyContent="center">
          {communities.map((community) => {
            return (
              <Grid item key={community.id}>
                <NavLink to={`/communities/${community.id}`} style={{textDecoration: "none"}}>
                  <Card variant="outlined" sx={{backgroundColor: alpha(theme.palette.secondary.dark, 0.5)}}>
                    <CardContent >
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
