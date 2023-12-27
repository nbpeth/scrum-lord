import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import useDashboard from "../../hooks/useDashboard";

export const Dashboard = () => {
  const { listCommunities, addCommunity, fetchCommunities } = useDashboard();
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const communityList = listCommunities();
  const [communities, setCommunities] = useState(communityList);

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
      <CreateRoomModal
        open={createRoomModalOpen}
        handleClose={createRoomModalClosed}
        onBlur={createRoomModalClosed}
      />

      <Grid container spacing={2} direction="column">
        <Grid item>
          <h1>Scrum Lord</h1>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography variant="h3">{error}</Typography>
          </Grid>
        )}

        <Grid item>
          <Button
            variant="contained"
            disabled={createRoomModalOpen}
            onClick={createRoomClicked}
          >
            Create Room
          </Button>
        </Grid>

        {/* communities component */}
        <Grid container item spacing={2} justifyContent="center">
          {communities.map((community) => {
            return (
              <Grid item key={community.id}>
                <NavLink to={`/communities/${community.id}`}>
                  <Card variant="outlined">
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
