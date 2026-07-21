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
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { DashboardCommunities } from "../DashboardCommunities/DashboardCommunities";
import { SearchInput } from "../SearchInput/SearchInput";

export const StartModal = ({
  open,
  handleClose,
  setCreateRoomModalOpen,
  fullsizeScreen,
  yourPrivateRooms,
}) => {
  const theme = useTheme();
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
      <Paper
        elevation={12}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "min(78vh, 720px)",
          width: "min(92vw, 520px)",
          maxWidth: "100%",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.9),
          background: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: "blur(12px)",
          boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.45)}`,
        }}
      >
        <Stack sx={{ p: 2.5, pb: 2 }}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                Your rooms
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Jump back in or open a new space
              </Typography>
            </Box>
            <IconButton
              aria-label="Close"
              size="small"
              onClick={handleClose}
              sx={{ color: "text.secondary", mt: -0.5 }}
            >
              <Close />
            </IconButton>
          </Stack>

          <Grid container spacing={1.5} alignItems="stretch" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={8}>
              <SearchInput onChange={searchValueChanged} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                id="new-room-button"
                fullWidth
                variant="contained"
                onClick={() => setCreateRoomModalOpen(true)}
                sx={{ height: "100%", py: 1.25, fontWeight: 600 }}
              >
                New room
              </Button>
            </Grid>
          </Grid>
        </Stack>

        <Box
          id="dashboard-your-rooms"
          sx={{
            px: 2.5,
            pb: 2.5,
            overflow: "auto",
            maxHeight: "min(52vh, 440px)",
          }}
        >
          <DashboardCommunities
            communities={filteredRooms}
            fullsizeScreen={fullsizeScreen}
          />
        </Box>
      </Paper>
    </Modal>
  );
};
