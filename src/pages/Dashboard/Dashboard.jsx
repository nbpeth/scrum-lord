import { Alert, Box, Button, Stack, alpha, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import { DashboardTitleMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";
import { StartModal } from "../../components/StartModal/StartModal";
import useDashboard from "../../hooks/useDashboard";
import { useSettings } from "../../hooks/useSettings";
import logoUrl from "../../scrum-lord.png";

const ERROR_MESSAGES = {
  404: "Room not found: it either has been deleted or it never was",
  9000: "Your room was deleted while you were in it. Welcome back.",
};

const startButtonSx = (theme) => ({
  fontFamily: "monospace",
  fontSize: ".8em",
  width: "35vh",
  height: "35vh",
  borderRadius: "50%",
  position: "relative",
  zIndex: 1,
  overflow: "visible",
  willChange: "transform",
  transition: "transform 1.5s ease-in-out",
  backgroundColor: alpha(theme.palette.background.default, 0.96),
  border: "1px solid",
  borderColor: "divider",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    pointerEvents: "none",
    transition: "opacity 1.5s ease-in-out",
  },
  "&::before": {
    boxShadow: `0px 5px 25vh 15vh ${alpha("rgb(65, 105, 225)", 0.5)}`,
    opacity: 1,
  },
  "&::after": {
    boxShadow: "0px 5px 50px 10px rgb(100, 200, 255)",
    opacity: 0,
  },
  "&:hover": {
    transform: "scale(1.3)",
    backgroundColor: alpha(theme.palette.background.default, 0.98),
    "&::before": { opacity: 0 },
    "&::after": { opacity: 1 },
  },
});

export const Dashboard = ({ version }) => {
  const { addCommunity, fetchCommunities, communityCreatedComplete, readyState } =
    useDashboard();
  const { yourPrivateRooms } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const errorFromQuery = new URLSearchParams(location.search).get("error");
  const errorMessage = error ?? ERROR_MESSAGES[errorFromQuery];

  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  useEffect(() => {
    if (communityCreatedComplete?.id) {
      navigate(`/communities/${communityCreatedComplete.id}`);
    }
  }, [communityCreatedComplete, navigate]);

  const createRoomModalClosed = async (newCommunity) => {
    if (newCommunity) {
      try {
        await addCommunity(newCommunity);
      } catch (e) {
        setError(e.message);
      }
    }

    setCreateRoomModalOpen(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          px: 2,
          py: 1.5,
          pointerEvents: "none",
          "& > *": { pointerEvents: "auto" },
        }}
      >
        <DashboardTitleMenu version={version} />
        <ConnectionStatus readyState={readyState} size={12} />
      </Stack>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ position: "fixed", top: 56, left: 16, right: 16, zIndex: 10 }}
        >
          {errorMessage}
        </Alert>
      )}

      <CreateRoomModal
        open={createRoomModalOpen}
        handleClose={createRoomModalClosed}
      />
      <StartModal
        open={startModalOpen}
        handleClose={() => setStartModalOpen(false)}
        yourPrivateRooms={yourPrivateRooms}
        setCreateRoomModalOpen={setCreateRoomModalOpen}
        fullsizeScreen={fullsizeScreen}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          isolation: "isolate",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Button
          id="dashboard-start-button"
          sx={startButtonSx}
          onClick={() => setStartModalOpen(true)}
        >
          <img
            src={logoUrl}
            alt="Scrum lord"
            style={{ height: "20vh", width: "20vh" }}
          />
        </Button>
      </Box>
    </Box>
  );
};
