import { Box, Button, Grid, Modal, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import { DashboardCommunities } from "../DashboardCommunities/DashboardCommunities";
import { SearchInput } from "../SearchInput/SearchInput";
import { useEffect, useState } from "react";

export const StartModal = ({ open, handleClose, communities, setCreateRoomModalOpen }) => {
  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75vw",
    height: "75vh",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
  };
  const [filteredCommunities, setFilteredCommunities] = useState(communities);

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
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      <Box sx={style}>
        <Grid container item xs={12} spacing={2} justifyContent="center">
          <Grid container item xs={12} spacing={2} alignItems="center" justifyContent="flex-end">
            <Grid item xs={8}>
              <SearchInput onChange={searchValueChanged} />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="contained" onClick={setCreateRoomModalOpen}>New</Button>
            </Grid>
          </Grid>
          <Grid item>
            <DashboardCommunities communities={filteredCommunities} />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
