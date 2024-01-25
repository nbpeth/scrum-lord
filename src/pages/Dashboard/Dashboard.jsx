import {
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import useDashboard from "../../hooks/useDashboard";
import { format, differenceInDays, parseISO } from "date-fns";

import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { DashboardTitleMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";
import logoUrl from "../../scrumlord-logo-2.png";
import { Schedule } from "@mui/icons-material";
import { SearchInput } from "../../components/SearchInput/SearchInput";

export const Dashboard = () => {
  const { listCommunities, addCommunity, fetchCommunities, readyState } =
    useDashboard();
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const communityList = listCommunities();
  const [communities, setCommunities] = useState(communityList);
  const [filteredCommunities, setFilteredCommunities] = useState(communityList);
  const theme = useTheme();

  // get the list of communities on mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  // update the list of communities when the list changes
  useEffect(() => {
    setCommunities(communityList);
  }, [communityList]);

  useEffect(() => {
    setFilteredCommunities(communities);
  }, [communities]);

  const createRoomClicked = () => {
    setCreateRoomModalOpen(true);
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

  const searchValueChanged = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      setFilteredCommunities(communities);
    } else {
      setFilteredCommunities(
        communities.filter((c) => c.name.includes(e.target.value))
      );
    }
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
              xs={12}
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
      <Grid
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <img height="50%" width="50%" src={logoUrl} alt="Scrum lord" />
        </Grid>

        <Grid container item xs={10}>
          <Grid item xs={3}>
            <SearchInput onChange={searchValueChanged} />
          </Grid>
          <Grid item xs={9}>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid>
        </Grid>

        <Grid
          item
          container
          spacing={2}
          xs={10}
          direction="column"
          id="dashboard-tiles-container"
        >
          {/* {error && (
          <Grid item xs={12}>
            <Typography variant="h3">{error}</Typography>
          </Grid>
        )} */}
          <Grid item xs>
            <DashboardCommunities communities={filteredCommunities} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export const DashboardCommunities = ({ communities }) => {
  return (
    <Grid container item spacing={2} xs={12} justifyContent="center">
      {communities?.map((community) => {
        return (
          <Grid item xs={12} md={6} key={community.id}>
            <CommunityCard community={community} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export const CommunityCard = ({ community }) => {
  const theme = useTheme();

  const getSynergyBarColor = (synergy) => {
    if (synergy >= 0.75) {
      return "success";
    } else if (synergy >= 0.5) {
      return "primary";
    } else if (synergy >= 0.25) {
      return "secondary";
    } else if (synergy >= 0.15) {
      return "warning";
    } else {
      return "error";
    }
  };

  const idle = differenceInDays(new Date(), parseISO(community?.lastModified));

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: idle
          ? alpha(theme.palette.grey[900], 0.5)
          : alpha(theme.palette.secondary.dark, 0.5),

        transition: "background .5s ease-in-out",
        "&:hover": {
          backgroundColor: idle
            ? alpha(theme.palette.grey[500], 0.5)
            : alpha(theme.palette.secondary.dark, 1),
        },
      }}
    >
      <Grid container xs={12} direction="column" justifyContent="space-between">
        <Grid item>
          <CardContent>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
              direction="column"
            >
              <Grid
                container
                item
                xs={12}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  {Boolean(idle) && (
                    <Tooltip placement="top-end" arrow title="Idle">
                      <Schedule
                        sx={{ fontSize: "medium", marginRight: "10px" }}
                      />
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="h5" color={theme.palette.grey[100]}>
                    <NavLink
                      to={`/communities/${community.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {community.name}
                    </NavLink>
                  </Typography>
                </Grid>
              </Grid>
              {community?.lastModified && (
                <Grid item>
                  <Typography variant="body2" color={theme.palette.grey[300]}>
                    Last Activity{" "}
                    {format(community?.lastModified, "MM/dd/yyyy:HH:mm")}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Grid>
        <Grid item>
          <LinearProgress
            color={getSynergyBarColor(community?.synergy?.value)}
            id="synergy-bar"
            variant="determinate"
            value={community?.synergy?.value * 100}
            style={{
              height: "10px",
              // width: "100%",
              // transform: `translateY(${25}%)`,
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
