import { HelpOutline } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ConnectionStatus } from "../../components/ConnectionStatus/ConnectionStatus";
import { CreateRoomModal } from "../../components/CreateRoomModal/CreateRoomModal";
import { DashboardFooter } from "../../components/DashboardFooter/DashboardFooter";
import { StartModal } from "../../components/StartModal/StartModal";
import { dashboardTutorialPages } from "../../components/TutorialModal/dashboardTutorialPages";
import { TutorialModal } from "../../components/TutorialModal/TutorialModal";
import useDashboard from "../../hooks/useDashboard";
import { useSettings } from "../../hooks/useSettings";
import logoUrl from "../../scrum-lord.png";
import {
  dashboardPageSx,
  errorAlertSx,
  startButtonLogoStyle,
  startButtonSx,
  startButtonWrapperSx,
  tutorialButtonSx,
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
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
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
        justifyContent="flex-end"
        spacing={1.5}
        sx={topBarSx}
      >
        <Tooltip title="Help me" placement="bottom" arrow>
          <IconButton
            id="dashboard-tutorial-button"
            aria-label="Help me"
            size="small"
            onClick={() => setTutorialModalOpen(true)}
            sx={tutorialButtonSx}
          >
            <HelpOutline fontSize="small" />
          </IconButton>
        </Tooltip>
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
      <TutorialModal
        open={tutorialModalOpen}
        handleClose={() => setTutorialModalOpen(false)}
        pages={dashboardTutorialPages}
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

      <DashboardFooter version={version} />
    </Box>
  );
};
