import { Alert, Box, Button, Stack, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import { DashboardTitleMenu } from "../../components/DashboardTitleMenu/DashboardTitleMenu";
import { StartModal } from "../../components/StartModal/StartModal";
import useDashboard from "../../hooks/useDashboard";
import { useSettings } from "../../hooks/useSettings";
import logoUrl from "../../scrum-lord.png";
import {
  dashboardPageSx,
  errorAlertSx,
  startButtonLogoStyle,
  startButtonSx,
  startButtonWrapperSx,
  topBarSx,
} from "./Dashboard.styles";

const ERROR_MESSAGES = {
  404: "Room not found: it either has been deleted or it never was",
  9000: "Your room was deleted while you were in it. Welcome back.",
};

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
    <Box sx={dashboardPageSx}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={topBarSx}
      >
        <DashboardTitleMenu version={version} />
        <ConnectionStatus readyState={readyState} size={12} />
      </Stack>

      {errorMessage && (
        <Alert severity="error" sx={errorAlertSx}>
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

      <Box sx={startButtonWrapperSx}>
        <Button
          id="dashboard-start-button"
          sx={startButtonSx}
          onClick={() => setStartModalOpen(true)}
        >
          <img src={logoUrl} alt="Scrum lord" style={startButtonLogoStyle} />
        </Button>
      </Box>
    </Box>
  );
};
