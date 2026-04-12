import { Box, Grid, alpha, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCommunity from "../../hooks/useCommunity";

import { useSettings } from "../../hooks/useSettings";
import { CommunityCitizens } from "../../components/CommunityCitizens/CommunityCitizens";
import { CommunityControls } from "../../components/CommunityControls/CommunityControls";
import { CommunityHeader } from "../../components/CommunityHeader/CommunityHeader";
import { DeleteCommunityModal } from "../../components/DeleteCommunityModal.jsx/DeleteCommunityModal";
import { EditPointSchemeModal } from "../../components/EditPointSchemeModal/EditPointSchemeModal";
import { JoinCommunityModal } from "../../components/JoinCommunityModal/JoinCommunityModal";
import { LurkerBox } from "../../components/LurkerBox/LurkerBox";
import { MessageBoard } from "../../components/MessageBoard/MessageBoard";
import { ReactionMachine } from "../../components/ReactionMachine/ReactionMachine";

export const Community = ({
  handleCommunityBackgroundAnimationChange,
  handleCelebrationChange,
  /** For App-level overlays (e.g. hotdog particle alert). */
  handleGlobalEvent,
  version,
}) => {
  const params = useParams();
  const communityId = params.communityId;
  const navigate = useNavigate();

  const {
    cancelTimer,
    joinCommunity,
    editPointScheme,
    leaveCommunity,
    handleReveal,
    handleReset,
    community: currentCommunity,
    submitVote,
    deleteCommunity,
    roomEvents,
    readyState,
    communityReaction,
    messageHistory,
    startTimer,
  } = useCommunity();

  const {
    settings,
    toggleCommunityAnimation,
    toggleMessageBoard,
    toggleReactions,
    toggleLurkerBox,
    toggleTimerVisible,
    updatePrivateRooms,
  } = useSettings();

  const theme = useTheme();

  const citizens = currentCommunity?.citizens || [];
  const [iAmCitizen, setIAmCitizen] = useState(null);
  const [error, setError] = useState(null);
  const [joinCommunityModalOpen, setJoinCommunityModalOpen] = useState(false);
  const [editPointSchemeModalOpen, setEditPointSchemeModalOpen] =
    useState(false);
  const [deleteCommunityModalOpen, setDeleteCommunityModalOpen] =
    useState(false);

  const [hotdogAlert, setHotdogAlert] = useState(false);

  useEffect(() => {
    recoverUserFromStorage();

    updatePrivateRooms(currentCommunity);

    if (currentCommunity?.isSynergized) {
      handleCelebrationChange(true);
      setTimeout(() => {
        handleCelebrationChange(false);
      }, 5000);
    }
  }, [currentCommunity]);

  useEffect(() => {
    if (!roomEvents) {
      return;
    }
    if (roomEvents?.alerts?.hotdog) {
      setHotdogAlert(Boolean(roomEvents.alerts.hotdog.active));
    }
    if (
      roomEvents.communityDeleted &&
      roomEvents.communityDeleted[communityId] &&
      roomEvents.communityDeleted[communityId].deleted === true
    ) {
      setTimeout(() => {
        navigate("/?error=9000", {
          state: { alertMessage: "Community deleted" },
        });
      }, 2000);
    }
  }, [roomEvents, currentCommunity, communityId, navigate]);

  useEffect(() => {
    if (typeof handleGlobalEvent === "function") {
      handleGlobalEvent({ type: "hotdogalert", value: hotdogAlert });
    }
  }, [hotdogAlert, handleGlobalEvent]);

  useEffect(() => {
    handleCommunityBackgroundAnimationChange(settings?.communityAnimation);
  }, [settings]);

  const handleJoin = () => {
    setJoinCommunityModalOpen(true);
  };

  const handleJoinCommunityModalClose = (newUser) => {
    if (!newUser) {
      setJoinCommunityModalOpen(false);
      return;
    }

    const { username, userId, votingMember, userColor } = newUser;
    saveUserToStorage(userId);

    try {
      joinCommunity({ communityId, userId, username, userColor, votingMember });
      setIAmCitizen({ userId, username, votingMember, userColor });
    } catch (e) {
      console.error(e);
      setError(e.message);
    }

    setJoinCommunityModalOpen(false);
  };

  const recoverUserFromStorage = () => {
    const userstate = localStorage.getItem("userstate") ?? "{}";
    const userstateObj = JSON.parse(userstate);
    const cachedUserIdForCommunity = userstateObj[communityId];
    const list = currentCommunity?.citizens || [];

    if (cachedUserIdForCommunity && list.length) {
      const user = list.find(
        (citizen) => citizen.userId === cachedUserIdForCommunity
      );
      setIAmCitizen(user);
    }
  };

  const saveUserToStorage = (userId) => {
    const userState = localStorage.getItem("userstate") || "{}";
    const userStateObj = JSON.parse(userState);
    userStateObj[communityId] = userId;

    localStorage.setItem("userstate", JSON.stringify(userStateObj));
  };

  const handleTimerClicked = ({ timerValue }) => {
    if (currentCommunity?.timer?.running) {
      cancelTimer({
        username: iAmCitizen.username,
        userId: iAmCitizen.userId,
        userColor: iAmCitizen.userColor,
      });
    } else {
      startTimer({
        timerLength: timerValue,
        username: iAmCitizen.username,
        userId: iAmCitizen.userId,
        userColor: iAmCitizen.userColor,
      });
    }
  };

  const handleDeleteUser = (citizen) => {
    handleLeave({
      communityId,
      userId: citizen.userId,
      username: citizen.username,
    });
  };

  const handleLeave = ({ communityId: id, userId, username, userColor }) => {
    try {
      leaveCommunity({
        communityId: id ?? communityId,
        userId: userId ?? iAmCitizen.userId,
        username: username ?? iAmCitizen.username,
        userColor: iAmCitizen?.userColor,
      });
      setIAmCitizen(null);
    } catch (e) {
      console.error(e);
      setError(e.message);

      return;
    }
  };

  const handleDeleteCommunity = () => {
    setDeleteCommunityModalOpen(true);
  };

  const onDeleteCommunityModalClose = (deletedCommunityId) => {
    if (deletedCommunityId) {
      deleteCommunity({
        communityId: deletedCommunityId,
        userId: iAmCitizen?.userId,
        username: iAmCitizen?.username,
      });
    }

    setDeleteCommunityModalOpen(false);
  };

  const lurkers =
    currentCommunity?.citizens?.filter((c) => !c?.votingMember) || [];

  const showLurkerColumn = Boolean(settings?.lurkerBoxVisible);
  const showActivity = Boolean(settings?.messageBoardVisible);
  const lurkerMd = showLurkerColumn ? 2 : 0;
  const mainRowMd = 12 - lurkerMd;
  const activityMd = showActivity ? Math.floor(mainRowMd / 4) : 0;
  const citizensMd = showActivity ? mainRowMd - activityMd : mainRowMd;

  const activityPaperSx = {
    background: (t) =>
      alpha(
        t.palette.background.default,
        settings?.communityAnimationEnabled ? 0.38 : 0.52,
      ),
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "divider",
    borderRadius: {
      xs: 2,
      md: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
    },
    borderRight: { md: "none" },
    borderBottom: { md: "none" },
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    minHeight: { xs: 280, md: 0 },
    height: { xs: "auto", md: "100%" },
    maxHeight: { xs: "none", md: "100%" },
  };

  const citizensColumnSx = {
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflowX: "hidden",
        textAlign: "initial",
      }}
    >
      {currentCommunity ? <ReactionMachine /> : null}
      <Box>
        <JoinCommunityModal
          open={joinCommunityModalOpen}
          handleClose={handleJoinCommunityModalClose}
        />

        <DeleteCommunityModal
          open={deleteCommunityModalOpen}
          handleClose={onDeleteCommunityModalClose}
          currentCommunity={currentCommunity}
        />

        <EditPointSchemeModal
          editPointScheme={editPointScheme}
          open={editPointSchemeModalOpen}
          handleClose={() => setEditPointSchemeModalOpen(false)}
          currentCommunity={currentCommunity}
          iamCitizen={iAmCitizen}
          community={currentCommunity}
        />

        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            width: "100%",
          }}
        >
          <CommunityHeader
            embedded
            navigate={navigate}
            communityName={
              hotdogAlert ? "Hotdog Overload" : currentCommunity?.name
            }
            hotdogOverload={hotdogAlert}
            readyState={readyState}
            version={version}
            iAmCitizen={iAmCitizen}
            onJoin={handleJoin}
            onLeave={handleLeave}
            onEditPointScheme={() => setEditPointSchemeModalOpen(true)}
            onDeleteRoom={handleDeleteCommunity}
            settings={settings}
            toggleReactions={toggleReactions}
            toggleCommunityAnimation={toggleCommunityAnimation}
            toggleLurkerBox={toggleLurkerBox}
            toggleMessageBoard={toggleMessageBoard}
            toggleTimerVisible={toggleTimerVisible}
          />
          {iAmCitizen && (
            <Box
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                background: (t) => alpha(t.palette.background.default, 0.72),
                backdropFilter: "blur(12px)",
              }}
            >
              <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
                <CommunityControls
                  handleTimerClicked={handleTimerClicked}
                  community={currentCommunity}
                  handleReveal={handleReveal}
                  handleReset={handleReset}
                  iAmCitizen={iAmCitizen}
                  communityId={communityId}
                  submitVote={submitVote}
                  communityReaction={communityReaction}
                  settings={settings}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 2, md: showActivity ? 0 : 2 }}
        sx={{
          minHeight: 0,
          height: "100%",
          pt: 2,
          px: 0,
          pb: 0,
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          flexWrap: "wrap",
          alignItems: "stretch",
          alignContent: "stretch",
        }}
      >
        {currentCommunity ? (
          <>
            {showLurkerColumn && (
              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  paddingTop: { md: "10px" },
                  pr: { md: showActivity ? 2 : undefined },
                  minWidth: 0,
                  maxWidth: "100%",
                  height: { md: "100%" },
                }}
              >
                <LurkerBox
                  lurkers={lurkers}
                  handleDeleteUser={handleDeleteUser}
                />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              md={citizensMd}
              sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
                ...citizensColumnSx,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                height: { md: "100%" },
                pr: { md: showActivity ? 2 : undefined },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  minWidth: 0,
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <CommunityCitizens
                  citizens={citizens}
                  iAmCitizen={iAmCitizen}
                  handleDeleteUser={handleDeleteUser}
                  currentCommunity={currentCommunity}
                />
              </Box>
            </Grid>
            {showActivity && (
              <Grid
                item
                xs={12}
                md={activityMd}
                sx={{
                  ...activityPaperSx,
                  minWidth: 0,
                  pr: { md: 0 },
                  mr: { md: 0 },
                  alignSelf: { md: "stretch" },
                }}
              >
                <MessageBoard
                  messageHistory={messageHistory}
                  communityId={communityId}
                />
              </Grid>
            )}
          </>
        ) : null}
      </Grid>
    </Box>
  );
};
