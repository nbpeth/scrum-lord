import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CommunityCitizens } from "../../components/CommunityCitizens/CommunityCitizens";
import { CommunityControls } from "../../components/CommunityControls/CommunityControls";
import { CommunityHeader } from "../../components/CommunityHeader/CommunityHeader";
import { DeleteCommunityModal } from "../../components/DeleteCommunityModal/DeleteCommunityModal";
import { EditPointSchemeModal } from "../../components/EditPointSchemeModal/EditPointSchemeModal";
import { JoinCommunityModal } from "../../components/JoinCommunityModal/JoinCommunityModal";
import { LurkerBox } from "../../components/LurkerBox/LurkerBox";
import { MessageBoard } from "../../components/MessageBoard/MessageBoard";
import { ReactionMachine } from "../../components/ReactionMachine/ReactionMachine";
import { communityTutorialPages } from "../../components/TutorialModal/communityTutorialPages";
import { TutorialModal } from "../../components/TutorialModal/TutorialModal";
import useCommunity from "../../hooks/useCommunity";
import { useSettings } from "../../hooks/useSettings";
import {
  activityPanelSx,
  citizensColumnSx,
  communityPageSx,
  controlsBarInnerSx,
  controlsBarSx,
  lurkerColumnSx,
  mainGridSx,
  stickyHeaderSx,
} from "./Community.styles";

const USER_STATE_STORAGE_KEY = "userstate";

const readUserState = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_STATE_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

export const Community = ({
  handleCommunityBackgroundAnimationChange,
  handleCelebrationChange,
  handleGlobalEvent,
  version,
}) => {
  const { communityId } = useParams();
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

  const citizens = currentCommunity?.citizens || [];
  const [iAmCitizen, setIAmCitizen] = useState(null);
  const [joinCommunityModalOpen, setJoinCommunityModalOpen] = useState(false);
  const [editPointSchemeModalOpen, setEditPointSchemeModalOpen] =
    useState(false);
  const [deleteCommunityModalOpen, setDeleteCommunityModalOpen] =
    useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [hotdogAlert, setHotdogAlert] = useState(false);

  useEffect(() => {
    const cachedUserId = readUserState()[communityId];
    const citizenList = currentCommunity?.citizens || [];
    if (cachedUserId && citizenList.length) {
      setIAmCitizen(
        citizenList.find((citizen) => citizen.userId === cachedUserId)
      );
    }

    updatePrivateRooms(currentCommunity);

    if (currentCommunity?.isSynergized) {
      handleCelebrationChange(true);
      const id = setTimeout(() => handleCelebrationChange(false), 5000);
      return () => clearTimeout(id);
    }
  }, [currentCommunity, communityId, updatePrivateRooms, handleCelebrationChange]);

  useEffect(() => {
    if (!roomEvents) {
      return;
    }
    if (roomEvents?.alerts?.hotdog) {
      setHotdogAlert(Boolean(roomEvents.alerts.hotdog.active));
    }
    if (roomEvents.communityDeleted?.[communityId]?.deleted === true) {
      setTimeout(() => {
        navigate("/?error=9000", {
          state: { alertMessage: "Community deleted" },
        });
      }, 2000);
    }
  }, [roomEvents, communityId, navigate]);

  useEffect(() => {
    if (typeof handleGlobalEvent === "function") {
      handleGlobalEvent({ type: "hotdogalert", value: hotdogAlert });
    }
  }, [hotdogAlert, handleGlobalEvent]);

  useEffect(() => {
    handleCommunityBackgroundAnimationChange(settings?.communityAnimation);
  }, [settings, handleCommunityBackgroundAnimationChange]);

  const saveUserToStorage = (userId) => {
    const userState = readUserState();
    userState[communityId] = userId;
    localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(userState));
  };

  const handleJoinCommunityModalClose = (newUser) => {
    setJoinCommunityModalOpen(false);
    if (!newUser) {
      return;
    }

    const { username, userId, userType, votingMember, userColor } = newUser;
    saveUserToStorage(userId);

    joinCommunity({
      communityId,
      userId,
      username,
      userColor,
      userType,
      votingMember,
    });
    setIAmCitizen({ userId, username, userType, votingMember, userColor });
  };

  const handleTimerClicked = ({ timerValue }) => {
    if (currentCommunity?.timer?.running) {
      cancelTimer({ ...iAmCitizen });
    } else {
      startTimer({ timerLength: timerValue, ...iAmCitizen });
    }
  };

  const handleLeave = ({ communityId: id, userId, username } = {}) => {
    leaveCommunity({
      communityId: id ?? communityId,
      userId: userId ?? iAmCitizen.userId,
      username: username ?? iAmCitizen.username,
      userColor: iAmCitizen?.userColor,
    });
    setIAmCitizen(null);
  };

  const handleDeleteUser = (citizen) => {
    handleLeave({
      communityId,
      userId: citizen.userId,
      username: citizen.username,
    });
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

  const lurkers = citizens.filter((c) => !c?.votingMember);

  const showLurkerColumn = Boolean(settings?.lurkerBoxVisible);
  const showActivity = Boolean(settings?.messageBoardVisible);
  const lurkerMd = showLurkerColumn ? 2 : 0;
  const mainRowMd = 12 - lurkerMd;
  const activityMd = showActivity ? Math.floor(mainRowMd / 4) : 0;
  const citizensMd = showActivity ? mainRowMd - activityMd : mainRowMd;

  return (
    <Box sx={communityPageSx}>
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
          iamCitizen={iAmCitizen}
          community={currentCommunity}
        />

        <TutorialModal
          open={tutorialModalOpen}
          handleClose={() => setTutorialModalOpen(false)}
          pages={communityTutorialPages}
        />

        <Box sx={stickyHeaderSx}>
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
            onJoin={() => setJoinCommunityModalOpen(true)}
            onLeave={handleLeave}
            onEditPointScheme={() => setEditPointSchemeModalOpen(true)}
            onDeleteRoom={() => setDeleteCommunityModalOpen(true)}
            onShowTutorial={() => setTutorialModalOpen(true)}
            settings={settings}
            toggleReactions={toggleReactions}
            toggleCommunityAnimation={toggleCommunityAnimation}
            toggleLurkerBox={toggleLurkerBox}
            toggleMessageBoard={toggleMessageBoard}
            toggleTimerVisible={toggleTimerVisible}
          />
          {iAmCitizen && (
            <Box sx={controlsBarSx}>
              <Box sx={controlsBarInnerSx}>
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
        sx={mainGridSx}
      >
        {currentCommunity ? (
          <>
            {showLurkerColumn && (
              <Grid item xs={12} md={2} sx={lurkerColumnSx(showActivity)}>
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
              sx={citizensColumnSx(showActivity)}
            >
              <CommunityCitizens
                citizens={citizens}
                iAmCitizen={iAmCitizen}
                handleDeleteUser={handleDeleteUser}
                currentCommunity={currentCommunity}
              />
            </Grid>
            {showActivity && (
              <Grid
                item
                xs={12}
                md={activityMd}
                sx={activityPanelSx(settings?.communityAnimationEnabled)}
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
