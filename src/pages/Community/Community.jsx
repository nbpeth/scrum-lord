import { Box, Grid, alpha, useMediaQuery, useTheme } from "@mui/material";
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

export const Community = ({
  handleCommunityBackgroundAnimationChange,
  handleCelebrationChange,
  version,
}) => {
  const params = useParams();
  const communityId = params.communityId;
  const navigate = useNavigate();
  const fullsizeScreen = useMediaQuery("(min-width:800px)");

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
  }, [roomEvents, currentCommunity]);

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

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
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
            communityName={currentCommunity?.name}
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

      <Grid container xs={12} spacing={3}>
        {fullsizeScreen && (
          <>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              {currentCommunity ? (
                <Grid container item xs={12} justifyContent="space-between">
                  {settings?.lurkerBoxVisible && fullsizeScreen && (
                    <Grid item xs={2} sx={{ paddingTop: "10px" }}>
                      <LurkerBox
                        lurkers={lurkers}
                        handleDeleteUser={handleDeleteUser}
                      />
                    </Grid>
                  )}
                  <Grid
                    item
                    justifyContent="center"
                    xs={settings?.lurkerBoxVisible ? 10 : 12}
                  >
                    <CommunityCitizens
                      citizens={citizens}
                      iAmCitizen={iAmCitizen}
                      handleDeleteUser={handleDeleteUser}
                      currentCommunity={currentCommunity}
                    />
                  </Grid>
                </Grid>
              ) : null}
            </Grid>

            {settings?.messageBoardVisible && (
              <Grid
                item
                xs={12}
                sx={{
                  backgroundColor: settings?.communityAnimationEnabled
                    ? "none"
                    : theme.palette.background.paper,
                }}
              >
                <MessageBoard
                  messageHistory={messageHistory}
                  communityId={communityId}
                />
              </Grid>
            )}
          </>
        )}
        {!fullsizeScreen && (
          <>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              {currentCommunity ? (
                <Grid container item xs={12} justifyContent="space-between">
                  {settings?.lurkerBoxVisible && (
                    <Grid item xs={2} sx={{ paddingTop: "10px" }}>
                      <LurkerBox
                        lurkers={lurkers}
                        handleDeleteUser={handleDeleteUser}
                      />
                    </Grid>
                  )}
                  <Grid
                    item
                    justifyContent="center"
                    xs={settings?.lurkerBoxVisible ? 10 : 12}
                  >
                    <CommunityCitizens
                      citizens={citizens}
                      iAmCitizen={iAmCitizen}
                      handleDeleteUser={handleDeleteUser}
                      currentCommunity={currentCommunity}
                    />
                  </Grid>
                </Grid>
              ) : null}
            </Grid>

            {settings?.messageBoardVisible && (
              <Grid
                item
                xs={12}
                sx={{
                  backgroundColor: settings?.communityAnimationEnabled
                    ? "none"
                    : theme.palette.background.paper,
                }}
              >
                <MessageBoard
                  messageHistory={messageHistory}
                  communityId={communityId}
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </>
  );
};
