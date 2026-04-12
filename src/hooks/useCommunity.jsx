import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { VoteOptionsLabels } from "../components/EditPointSchemeModal/EditPointSchemeModal";
import { getSocketBaseUrl, socketOptions } from "../util/config";
// import { Web } from "@mui/icons-material";
import * as uuid from "uuid";
import { useSettings } from "./useSettings";

export default function useCommunity() {
  const params = useParams();
  const communityId = params.communityId;
  const [socketUrl, setSocketUrl] = useState(null);
  const [reconnection, setReconnection] = useState({
    attempts: 15,
    interval: 5,
    reconnecting: false,
  });

  const { removePrivateRoom } = useSettings();

  const processMessageRef = useRef(() => {});

  const { sendMessage, readyState } = useWebSocket(socketUrl, {
    ...socketOptions({ setReconnection }),
    onMessage: (event) => processMessageRef.current(event.data),
  });
  const [community, setCommunity] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [lastReaction, setLastReaction] = useState();
  const [roomEvents, setRoomEvents] = useState({});

  const navigate = useNavigate();

  // configure the socket url to target the community id
  useEffect(() => {
    const baseUrl = `${getSocketBaseUrl()}/socket`;

    setSocketUrl(`${baseUrl}?communityId=${communityId}`);
  }, [communityId]);

  // get community data on mount
  useEffect(() => {
    sendMessage(
      JSON.stringify({ type: "get-community", payload: { communityId } })
    );
  }, [communityId]);

  const handleCommunityJoinedReply = (payload) => {
    try {
      const { joinedUser, community } = payload;

      // const { citizens: updatedCitizens, id } = community;

      const messageText = [`"${joinedUser.username}" has joined`];
      if (!joinedUser.votingMember) {
        messageText.push("as a spectator");
      }
      messageText.push("!");

      setCommunity(community);
      // pretty sure shouldn't use two sets on state in the same function
      // setAlertMessage({ message: `"${joinedUser.username}" joined!` });
      setMessageHistory([
        ...messageHistory,
        {
          communityId,
          text: messageText.join(" "),
          userColor: joinedUser.userColor,
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommunityLeftReply = (payload) => {
    const { leftUser, community } = payload;
    // const { citizens: updatedCitizens, id } = community;

    setCommunity(community);
    // setAlertMessage({ message: `${leftUser.username} left the community` });
    setMessageHistory([
      ...messageHistory,
      {
        communityId,
        text: `"${leftUser.username}" left the community`,
        userColor: leftUser.userColor,
      },
    ]);
  };

  // blanket holistic updates for now, duplicated but unsure where to go in the future
  const handleSubmittedVoteReply = (payload) => {
    const { community, username, userColor, doubleVote } = payload;

    setCommunity(community);

    const message = () => {
      if (doubleVote) {
        return `"${username}" changed their vote after the reveal!`;
      }

      return `"${username}" has voted`;
    };

    setMessageHistory([
      ...messageHistory,
      { communityId, text: message(), userColor },
    ]);
  };

  const handleCommunityReactionReply = (payload) => {
    const { event, username, userColor } = payload;

    let message;
    switch (event) {
      case "lightning":
        message = "⚡";
        break;
      case "party":
        message = "🎉";
        break;
      case "thinking":
        message = "🤔";
        break;
      case "upvote":
        message = "👍";
        break;
      case "downvote":
        message = "👎";
        break;
      case "love":
        message = "❤️‍🔥";
        break;
      case "heartbreak":
        message = "💔";
        break;
      case "hotdog":
        message = "🌭";
        break;
      case "shrug":
        message = "🤷";
        break;
      default:
        message = "🤷";
    }

    // Used by ReactionMachine, probably overkill
    setLastReaction({ id: uuid.v4(), message });

    // setAlertMessage({ message: `"${username}" - ${message}` });
    setMessageHistory([
      ...messageHistory,
      {
        communityId,
        text: `"${username}" - ${message}`,
        userColor,
        rawText: message,
        type: "reaction",
      },
    ]);
  };

  const handleResetReply = (payload) => {
    const { community, username, userColor } = payload;

    setCommunity(community);

    setMessageHistory([
      ...messageHistory,
      { communityId, text: `"${username}" reset the vote`, userColor },
    ]);
  };

  const handleRevealReply = (payload) => {
    const { community, username, userColor } = payload;

    setCommunity(community);

    setMessageHistory([
      ...messageHistory,
      { communityId, text: `"${username}" revealed the votes`, userColor },
    ]);
  };

  const handleEditPointSchemeReply = (payload) => {
    const { community, username, userColor, scheme } = payload;

    setCommunity(community);

    setMessageHistory([
      ...messageHistory,
      {
        communityId,
        text: `"${username}" has changed the point scheme to "${VoteOptionsLabels[scheme]}"`,
        userColor,
      },
    ]);
  };

  const handleStartTimerReply = (payload) => {
    const { community, username, userColor, timerLength } = payload;
    setCommunity(community);

    setMessageHistory([
      ...messageHistory,
      {
        communityId,
        text: `⏰ "${username}" started the voting timer! ${timerLength} seconds ⏰`,
        userColor,
      },
    ]);
  };

  const handleTimerFinishedReply = (payload) => {
    const { community, userColor } = payload;
    setCommunity(community);

    setMessageHistory([
      ...messageHistory,
      {
        communityId,
        text: "⏰ Time's up! ⏰",
        userColor,
      },
    ]);
  };

  const handleCancelTimerReply = (payload) => {
    const { community, username, userColor } = payload;
    setCommunity(community);

    setMessageHistory([
      ...messageHistory,
      {
        communityId,
        text: `⏰ "${username}" cancelled the timer ⏰`,
        userColor,
      },
    ]);
  };

  const handleHotDogAlertReply = (payload) => {
    setRoomEvents((prev) => ({
      ...prev,
      alerts: {
        ...prev?.alerts,
        hotdog: {
          active: true,
          userId: payload.userId,
          username: payload.username,
        },
      },
    }));
  };

  const handleHotDogAlertInactiveReply = (payload) => {
    setRoomEvents((prev) => ({
      ...prev,
      alerts: {
        ...prev?.alerts,
        hotdog: {
          active: false,
          userId: payload.userId,
          username: payload.username,
        },
      },
    }));
  };

  const handleCommunityDeletedReply = (payload) => {
    setRoomEvents({
      ...roomEvents,
      communityDeleted: {
        [payload.id]: {
          deleted: payload.deleted,
        },
      },
    });
  };

  processMessageRef.current = (rawData) => {
    if (rawData == null) {
      return;
    }
    try {
      const messageData = JSON.parse(rawData);
      const { type, payload } = messageData;

      switch (type) {
        case "get-community-reply":
          if (!payload.community) {
            removePrivateRoom(communityId);
            navigate("/?error=404");
          } else {
            setCommunity(payload.community);
          }
          break;
        case "community-joined-reply":
          handleCommunityJoinedReply(payload);
          break;
        case "community-left-reply":
          handleCommunityLeftReply(payload);
          break;
        case "submit-vote-reply":
          handleSubmittedVoteReply(payload);
          break;
        case "reveal-reply":
          handleRevealReply(payload);
          break;
        case "reset-reply":
          handleResetReply(payload);
          break;
        case "community-reaction-reply":
          handleCommunityReactionReply(payload);
          break;
        case "delete-community-reply":
          handleCommunityDeletedReply(payload);
          break;
        case "edit-point-scheme-reply":
          handleEditPointSchemeReply(payload);
          break;
        case "start-timer-reply":
          handleStartTimerReply(payload);
          break;
        case "timer-finished-reply":
          handleTimerFinishedReply(payload);
          break;
        case "cancel-timer-reply":
          handleCancelTimerReply(payload);
          break;
        case "community-alerts.hotdog.active":
          handleHotDogAlertReply(payload);
          break;
        case "community-alerts.hotdog.inactive":
          handleHotDogAlertInactiveReply(payload);
          break;
        default:
          console.log("unknown message type", type);
      }
    } catch (e) {
      console.log("error parsing message", e);
    }
  };

  const handleReveal = ({ username, userId, userColor }) => {
    sendMessage(
      JSON.stringify({
        type: "reveal",
        payload: {
          community: { id: communityId },
          username,
          userId,
          userColor,
        },
      })
    );
  };

  const handleReset = ({ username, userId, userColor }) => {
    sendMessage(
      JSON.stringify({
        type: "reset",
        payload: {
          community: { id: communityId },
          username,
          userId,
          userColor,
        },
      })
    );
  };

  const startTimer = ({ timerLength, username, userId, userColor }) => {
    sendMessage(
      JSON.stringify({
        type: "start-timer",
        payload: {
          community: { id: communityId },
          timerLength: timerLength ?? 5,
          username,
          userId,
          userColor,
        },
      })
    );
  };

  const cancelTimer = ({ username, userId, userColor }) => {
    sendMessage(
      JSON.stringify({
        type: "cancel-timer",
        payload: {
          community: { id: communityId },
          username,
          userId,
          userColor,
        },
      })
    );
  };

  const joinCommunity = ({
    communityId,
    username,
    userId,
    userColor,
    votingMember,
  }) => {
    sendMessage(
      JSON.stringify({
        type: "join-community",
        payload: {
          community: {
            id: communityId,
            username,
            userId,
            userColor,
            votingMember,
          },
        },
      })
    );
  };

  const leaveCommunity = ({ communityId, userId, username, userColor }) => {
    removePrivateRoom(communityId);
    sendMessage(
      JSON.stringify({
        type: "leave-community",
        payload: {
          community: { id: communityId, userId, username },
          userColor,
          userId,
          username,
        },
      })
    );
  };

  const submitVote = ({ communityId, username, userId, userColor, vote }) => {
    // debugger;
    sendMessage(
      JSON.stringify({
        type: "submit-vote",
        payload: {
          community: { id: communityId, username, userId, vote },
          userColor,
          username,
          userId,
          vote,
        },
      })
    );
  };

  const deleteCommunity = ({ communityId, userId, username, userColor }) => {
    sendMessage(
      JSON.stringify({
        type: "delete-community",
        payload: {
          community: { id: communityId },
          userId,
          username,
          userColor,
        },
      })
    );
  };

  const communityReaction = ({ event, userId, username, userColor }) => {
    sendMessage(
      JSON.stringify({
        type: "community-reaction",
        payload: {
          community: { id: communityId },
          userId,
          username,
          userColor,
          event,
        },
      })
    );
  };

  const editPointScheme = ({ scheme, userId, username, userColor }) => {
    sendMessage(
      JSON.stringify({
        type: "edit-point-scheme",
        payload: {
          community: { id: communityId },
          userId,
          username,
          userColor,
          scheme,
        },
      })
    );
  };

  const clearAlertMessage = () => {
    setAlertMessage(null);
  };

  return {
    alertMessage,
    cancelTimer,
    clearAlertMessage,
    community,
    communityReaction,
    lastReaction,
    deleteCommunity,
    editPointScheme,
    joinCommunity,
    handleReveal,
    handleReset,
    leaveCommunity,
    readyState,
    reconnection,
    roomEvents,
    startTimer,
    submitVote,
    messageHistory,
  };
}
