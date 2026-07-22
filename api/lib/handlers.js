const color = require("randomcolor");
const { eventTypes } = require("./hotdogAlert");
const { notifyCaller } = require("./notify");

const TIMER_LATENCY_PAD_MS = 150;

const createHandlers = ({
  communityClient,
  notifyClients,
  hotdogAlert,
  timers = {},
}) => {
  const getTimer = (communityId) => timers[communityId]?.timer;

  const cancelCommunityTimer = async (timer, communityId) => {
    clearTimeout(timer);
    delete timers[communityId];

    return communityClient.cancelTimer({ communityId });
  };

  const killTimerIfExists = async (communityId) => {
    const timer = getTimer(communityId);
    if (timer) {
      await cancelCommunityTimer(timer, communityId);
    }
  };

  const handleCreateCommunity = async (payload, ws) => {
    const { community } = payload;

    const result = await communityClient.addCommunity(community);
    if (community.isPrivate) {
      notifyCaller(ws, {
        type: "community-created-complete-reply",
        payload: { result },
      });
    }

    const communities = await communityClient.getCommunitiesAsArray();

    notifyClients({
      message: { type: "community-created-reply", payload: { communities } },
    });
  };

  const handleJoinCommunity = async (payload) => {
    const {
      community: { id: communityId, username, userId, userColor, votingMember },
    } = payload;

    const updatedCommunity = await communityClient.joinCommunity({
      communityId,
      username,
      userId,
      userColor: userColor ?? color.randomColor({ luminosity: "bright" }),
      votingMember,
    });

    notifyClients({
      message: {
        type: "community-joined-reply",
        payload: {
          joinedUser: { username, userId, votingMember, userColor },
          community: updatedCommunity,
        },
      },
      communityId,
    });
  };

  const handleLeaveCommunity = async (payload) => {
    const {
      community: { id: communityId, username, userId },
      userColor,
    } = payload;

    const updatedCommunity = await communityClient.leaveCommunity({
      communityId,
      username,
      userId,
    });

    notifyClients({
      message: {
        type: "community-left-reply",
        payload: {
          leftUser: { username, userId, userColor },
          community: updatedCommunity,
        },
      },
      communityId,
    });
  };

  const handleListCommunities = async () => {
    const communities = await communityClient.getCommunitiesAsArray();

    notifyClients({
      message: { type: "list-communities-reply", payload: { communities } },
    });
  };

  const handleGetCommunity = async (payload) => {
    const { communityId } = payload;

    const community = await communityClient.getCommunityBy(communityId);

    notifyClients({
      message: {
        type: "get-community-reply",
        payload: { community, communityId },
      },
      communityId,
    });
  };

  const handleSubmitVote = async (payload) => {
    const { community, userColor } = payload;
    const { id: communityId, userId, username, vote } = community;

    const result = await communityClient.submitVote({
      communityId,
      userId,
      vote,
    });

    notifyClients({
      message: {
        type: "submit-vote-reply",
        payload: {
          community: result,
          username,
          userId,
          userColor,
          doubleVote: result?.doubleVote,
        },
      },
      communityId,
    });
  };

  const handleReveal = async (payload) => {
    const { community, username, userId, userColor } = payload;
    const { id: communityId } = community;

    await killTimerIfExists(communityId);

    const result = await communityClient.reveal({ communityId });

    notifyClients({
      message: {
        type: "reveal-reply",
        payload: {
          community: { ...result },
          username,
          userId,
          userColor,
          isSynergized: result?.isSynergized,
        },
      },
      communityId,
    });
  };

  const handleReset = async (payload) => {
    const { community, username, userId, userColor } = payload;
    const { id: communityId } = community;

    await killTimerIfExists(communityId);

    const result = await communityClient.reset({ communityId });

    notifyClients({
      message: {
        type: "reset-reply",
        payload: { community: result, username, userId, userColor },
      },
      communityId,
    });
  };

  const handleDeleteCommunity = async (payload) => {
    const { community, userId, username } = payload;

    const deleteResult = await communityClient.deleteCommunity({
      community,
      userId,
      username,
    });

    notifyClients({
      message: { type: "delete-community-reply", payload: deleteResult },
      communityId: community.id,
    });
  };

  const handleCommunityReaction = async (payload) => {
    const { community, event, userId, username, userColor } = payload;
    const { id: communityId } = community;

    if (event === eventTypes.hotdog) {
      hotdogAlert.handleReaction(payload);
    }

    notifyClients({
      message: {
        type: "community-reaction-reply",
        payload: { event, userId, username, userColor },
      },
      communityId,
    });
  };

  const handleEditPointScheme = async (payload) => {
    const { community, username, userId, userColor, scheme } = payload;
    const { id: communityId } = community;

    const result = await communityClient.editPointScheme({
      communityId,
      scheme,
    });

    notifyClients({
      message: {
        type: "edit-point-scheme-reply",
        payload: { community: result, username, userId, userColor, scheme },
      },
      communityId,
    });
  };

  const handleStartTimer = async (payload, ws) => {
    const { community, username, userColor, timerLength } = payload;
    const { id: communityId } = community;

    const communityState = await communityClient.getCommunityBy(communityId);
    if (communityState?.timerRunning) {
      notifyCaller(ws, {
        type: "start-timer-reply",
        payload: {
          community: communityState,
          username,
          userColor,
          timerLength,
          error: "Timer already running",
        },
      });
      return;
    }

    const result = await communityClient.startTimer({
      communityId,
      timerLength,
    });

    notifyClients({
      message: {
        type: "start-timer-reply",
        payload: { community: result, username, userColor, timerLength },
      },
      communityId,
    });

    const onTimerFinished = async () => {
      delete timers[communityId];
      const stopped = await communityClient.stopTimer({ communityId });

      notifyClients({
        message: {
          type: "timer-finished-reply",
          payload: { community: stopped, username, userColor, timerLength },
        },
        communityId,
      });
    };

    const timer = setTimeout(
      onTimerFinished,
      timerLength * 1000 + TIMER_LATENCY_PAD_MS
    );
    timers[communityId] = { timer };
  };

  const handleCancelTimer = async (payload, ws) => {
    const { community, username, userColor } = payload;
    const { id: communityId } = community;

    const timer = getTimer(communityId);
    if (!timer) {
      console.warn("no timer to cancel", JSON.stringify(payload), ws?.id);
      return;
    }

    const result = await cancelCommunityTimer(timer, communityId);

    notifyClients({
      message: {
        type: "cancel-timer-reply",
        payload: { community: result, username, userColor },
      },
      communityId,
    });
  };

  return {
    "create-community": handleCreateCommunity,
    "join-community": handleJoinCommunity,
    "leave-community": handleLeaveCommunity,
    "list-communities": handleListCommunities,
    "get-community": handleGetCommunity,
    reveal: handleReveal,
    reset: handleReset,
    "submit-vote": handleSubmitVote,
    "delete-community": handleDeleteCommunity,
    "community-reaction": handleCommunityReaction,
    "edit-point-scheme": handleEditPointScheme,
    "start-timer": handleStartTimer,
    "cancel-timer": handleCancelTimer,
  };
};

module.exports = { createHandlers };
