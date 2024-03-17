import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";

import { Link } from "react-router-dom";
import {
  CommunityCard,
  DashboardCommunities,
} from "../DashboardCommunities/DashboardCommunities";
import { SearchInput } from "../SearchInput/SearchInput";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";

export const StartModal = ({
  open,
  handleClose,
  communities,
  setCreateRoomModalOpen,
  yourPrivateRooms,
}) => {
  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "75vh",
    maxWidth: "85vw",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
  };
  const [filteredCommunities, setFilteredCommunities] = useState(communities);
  const privateRooms = Object.values(yourPrivateRooms);
  const theme = useTheme();

  useEffect(() => {
    setFilteredCommunities(communities);
  }, [communities]);

  const searchValueChanged = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      setFilteredCommunities(communities);
    } else {
      setFilteredCommunities(
        communities?.filter((c) =>
          c.name?.toLowerCase().includes(e.target.value.toLowerCase())
        ) || []
      );
    }
  };

  return (
    <Modal
      id="modal"
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      <Box sx={style} id="box">
        <Grid container xs={12} spacing={2} justifyContent="center" id="top">
          <Grid item xs={12} textAlign="right">
            <Close
              sx={{ cursor: "pointer", position: "relative" }}
              onClick={handleClose}
            />
          </Grid>

          <Grid
            id="search-and-new"
            container
            item
            xs={12}
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid item xs={8}>
              <SearchInput onChange={searchValueChanged} />
            </Grid>

            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={setCreateRoomModalOpen}
              >
                New
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            id="rooms"
            spacing={2}
            justifyContent="space-between"
            sx={{ paddingBottom: "10px" }}
          >
            <Grid item>
              <Typography variant="h5" color={theme.palette.primary.dark}>
                Public Rooms
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" color={theme.palette.secondary.light}>
                Your Rooms
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={6} sx={{ overflow: "auto", height: "50vh" }}>
            <DashboardCommunities communities={filteredCommunities} />
          </Grid>

          <Grid item xs={6} sx={{ overflow: "auto" }}>
            <DashboardCommunities
              context="private"
              communities={privateRooms}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
