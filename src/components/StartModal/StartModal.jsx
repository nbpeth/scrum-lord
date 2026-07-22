import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DashboardCommunities } from "../DashboardCommunities/DashboardCommunities";
import { SearchInput } from "../SearchInput/SearchInput";
import {
  closeButtonSx,
  headerStackSx,
  newRoomButtonSx,
  roomListSx,
  searchRowSx,
  startModalPaperSx,
  subtitleSx,
  titleRowSx,
} from "./StartModal.styles";

export const StartModal = ({
  open,
  handleClose,
  setCreateRoomModalOpen,
  fullsizeScreen,
  yourPrivateRooms,
}) => {
  const [query, setQuery] = useState("");

  const privateRooms = Object.values(yourPrivateRooms ?? {});
  const filteredRooms = query
    ? privateRooms.filter((c) => c.name?.toLowerCase().includes(query))
    : privateRooms;

  const searchValueChanged = (e) => {
    e.preventDefault();
    setQuery(e.target.value?.trim().toLowerCase() ?? "");
  };

  return (
    <Modal id="modal" open={open} onClose={handleClose}>
      <Paper elevation={12} sx={startModalPaperSx}>
        <Stack sx={headerStackSx}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={1}
            sx={titleRowSx}
          >
            <Box>
              <Typography variant="h5" component="h2" fontWeight={700}>
                Your rooms
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={subtitleSx}>
                Jump back in or open a new space
              </Typography>
            </Box>
            <IconButton
              aria-label="Close"
              size="small"
              onClick={handleClose}
              sx={closeButtonSx}
            >
              <Close />
            </IconButton>
          </Stack>

          <Grid container spacing={1.5} alignItems="stretch" sx={searchRowSx}>
            <Grid item xs={12} sm={8}>
              <SearchInput onChange={searchValueChanged} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                id="new-room-button"
                fullWidth
                variant="contained"
                onClick={() => setCreateRoomModalOpen(true)}
                sx={newRoomButtonSx}
              >
                New room
              </Button>
            </Grid>
          </Grid>
        </Stack>

        <Box id="dashboard-your-rooms" sx={roomListSx}>
          <DashboardCommunities
            communities={filteredRooms}
            fullsizeScreen={fullsizeScreen}
          />
        </Box>
      </Paper>
    </Modal>
  );
};
