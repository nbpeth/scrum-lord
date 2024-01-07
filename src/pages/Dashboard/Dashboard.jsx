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
import { DashboardTitleMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";
import logoUrl from "../../scrumlord-logo-2.png";

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

        {/* communities component */}
        <Grid container item spacing={2} xs={12} justifyContent="center">
          {communities?.map((community) => {
            return (
              <Grid item xs={3} key={community.id}>
                <CommunityCard community={community} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
};
// postgres://bxngeexnpbiofo:293de31644fd48e10c63023096ba7e86cb44fb51219ab0723fc6e2c072c6afff@ec2-3-217-146-37.compute-1.amazonaws.com:5432/domikjnvvpso
export const CommunityCard = ({ community }) => {
  const theme = useTheme();
  return (
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
        <Typography variant="h5" color={theme.palette.grey[100]}>
          <NavLink
            to={`/communities/${community.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {community.name}
          </NavLink>
        </Typography>
      </CardContent>
    </Card>
  );
};
