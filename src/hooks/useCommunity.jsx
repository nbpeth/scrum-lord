import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import * as uuid from "uuid";
import { getSocketBaseUrl, socketOptions } from "../util/config";
import { reactionEmojiFor } from "../util/reactions";
import { VoteOptionsLabels } from "../util/voteOptions";
import { useSettings } from "./useSettings";

export default function useCommunity() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const { removePrivateRoom } = useSettings();

  const [socketUrl, setSocketUrl] = useState(null);
  const [reconnection, setReconnection] = useState({
    attempts: 15,
    interval: 5,
    reconnecting: false,
  });
  const [community, setCommunity] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [lastReaction, setLastReaction] = useState();
  const [roomEvents, setRoomEvents] = useState({});

  const processMessageRef = useRef(() => {});

  const { sendMessage, readyState } = useWebSocket(socketUrl, {
    ...socketOptions({ setReconnection }),
    onMessage: (event) => processMessageRef.current(event.data),
  });

  useEffect(() => {
    setSocketUrl(`${getSocketBaseUrl()}/socket?communityId=${communityId}`);
  }, [communityId]);

  const send = useCallback(
    (type, payload) => sendMessage(JSON.stringify({ type, payload })),
    [sendMessage]
  );

  useEffect(() => {
    send("get-community", { communityId });
  }, [communityId, send]);

  const appendMessage = (message) => {
    setMessageHistory((prev) => [
      ...prev,
      { id: uuid.v4(), communityId, ...message },
    ]);
  };

  const setHotdogAlert = (active) => (payload) => {
    setRoomEvents((prev) => ({
      ...prev,
      alerts: {
        ...prev?.alerts,
        hotdog: { active, userId: payload.userId, username: payload.username },
      },
    }));
  };

  const replyHandlers = {
    "get-community-reply": (payload) => {
      if (!payload.community) {
        removePrivateRoom(communityId);
        navigate("/?error=404");
        return;
      }
      setCommunity(payload.community);
    },

    "community-joined-reply": ({ joinedUser, community: updated }) => {
      setCommunity(updated);
      const spectator = joinedUser.votingMember ? "" : " as a spectator";
      appendMessage({
        text: `"${joinedUser.username}" has joined${spectator}!`,
        userColor: joinedUser.userColor,
      });
    },

    "community-left-reply": ({ leftUser, community: updated }) => {
      setCommunity(updated);
      appendMessage({
        text: `"${leftUser.username}" left the community`,
        userColor: leftUser.userColor,
      });
    },

    "submit-vote-reply": ({ community: updated, username, userColor, doubleVote }) => {
      setCommunity(updated);
      appendMessage({
        text: doubleVote
          ? `"${username}" changed their vote after the reveal!`
          : `"${username}" has voted`,
        userColor,
      });
    },

    "reveal-reply": ({ community: updated, username, userColor }) => {
      setCommunity(updated);
      appendMessage({ text: `"${username}" revealed the votes`, userColor });
    },

    "reset-reply": ({ community: updated, username, userColor }) => {
      setCommunity(updated);
      appendMessage({ text: `"${username}" reset the vote`, userColor });
    },

    "community-reaction-reply": ({ event, username, userColor }) => {
      const emoji = reactionEmojiFor(event);
      setLastReaction({ id: uuid.v4(), message: emoji });
      appendMessage({
        text: `"${username}" - ${emoji}`,
        rawText: emoji,
        type: "reaction",
        userColor,
      });
    },

    "edit-point-scheme-reply": ({ community: updated, username, userColor, scheme }) => {
      setCommunity(updated);
      appendMessage({
        text: `"${username}" has changed the point scheme to "${VoteOptionsLabels[scheme]}"`,
        userColor,
      });
    },

    "start-timer-reply": ({ community: updated, username, userColor, timerLength }) => {
      setCommunity(updated);
      appendMessage({
        text: `⏰ "${username}" started the voting timer! ${timerLength} seconds ⏰`,
        userColor,
      });
    },

    "timer-finished-reply": ({ community: updated, userColor }) => {
      setCommunity(updated);
      appendMessage({ text: "⏰ Time's up! ⏰", userColor });
    },

    "cancel-timer-reply": ({ community: updated, username, userColor }) => {
      setCommunity(updated);
      appendMessage({ text: `⏰ "${username}" cancelled the timer ⏰`, userColor });
    },

    "delete-community-reply": (payload) => {
      setRoomEvents((prev) => ({
        ...prev,
        communityDeleted: { [payload.id]: { deleted: payload.deleted } },
      }));
    },

    "community-alerts.hotdog.active": setHotdogAlert(true),
    "community-alerts.hotdog.inactive": setHotdogAlert(false),
  };

  processMessageRef.current = (rawData) => {
    if (rawData == null) {
      return;
    }
    try {
      const { type, payload } = JSON.parse(rawData);
      const handler = replyHandlers[type];
      if (handler) {
        handler(payload);
      } else {
        console.log("unknown message type", type);
      }
    } catch (e) {
      console.log("error parsing message", e);
    }
  };

  const userFields = ({ username, userId, userColor } = {}) => ({
    username,
    userId,
    userColor,
  });

  const handleReveal = (user) =>
    send("reveal", { community: { id: communityId }, ...userFields(user) });

  const handleReset = (user) =>
    send("reset", { community: { id: communityId }, ...userFields(user) });

  const startTimer = ({ timerLength, ...user }) =>
    send("start-timer", {
      community: { id: communityId },
      timerLength: timerLength ?? 5,
      ...userFields(user),
    });

  const cancelTimer = (user) =>
    send("cancel-timer", { community: { id: communityId }, ...userFields(user) });

  const joinCommunity = ({ communityId: id, username, userId, userColor, votingMember }) =>
    send("join-community", {
      community: { id, username, userId, userColor, votingMember },
    });

  const leaveCommunity = ({ communityId: id, userId, username, userColor }) => {
    removePrivateRoom(id);
    send("leave-community", {
      community: { id, userId, username },
      userColor,
      userId,
      username,
    });
  };

  const submitVote = ({ communityId: id, username, userId, userColor, vote }) =>
    send("submit-vote", {
      community: { id, username, userId, vote },
      userColor,
      username,
      userId,
      vote,
    });

  const deleteCommunity = ({ communityId: id, userId, username, userColor }) =>
    send("delete-community", {
      community: { id },
      userId,
      username,
      userColor,
    });

  const communityReaction = ({ event, ...user }) =>
    send("community-reaction", {
      community: { id: communityId },
      ...userFields(user),
      event,
    });

  const editPointScheme = ({ scheme, ...user }) =>
    send("edit-point-scheme", {
      community: { id: communityId },
      ...userFields(user),
      scheme,
    });

  const clearAlertMessage = () => setAlertMessage(null);

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
