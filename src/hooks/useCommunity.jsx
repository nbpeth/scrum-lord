import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { VoteOptionsLabels } from "../components/EditPointSchemeModal/EditPointSchemeModal";

export default function useCommunity() {
  const params = useParams();
  const communityId = params.communityId;
  const [socketUrl, setSocketUrl] = useState(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [community, setCommunity] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);

  const [roomEvents, setRoomEvents] = useState({});

  const navigate = useNavigate();

  // configure the socket url to target the community id
  useEffect(() => {
    const host = document.location.host;
    const wsProtocol = document.location.protocol === "https:" ? "wss" : "ws";
    let baseUrl = `${wsProtocol}://${host}/socket`;
    const env = process.env.ENVIRONMENT;

    // const socketUrl =
    //   env === "prod"
    //     ? `${baseUrl}?communityId=${communityId}`
    //     : `ws://localhost:8080/socket?communityId=${communityId}`;
    setSocketUrl(`${baseUrl}?communityId=${communityId}`);
    // setSocketUrl(socketUrl);
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
    const { citizens: updatedCitizens, id } = community;

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
    const { community, username, userColor, userId } = payload;

    setCommunity(community);

    setMessageHistory([
      ...messageHistory,
      { communityId, text: `"${username}" has voted`, userColor },
    ]);
  };

  const handleCommunityReactionReply = (payload) => {
    const { event, userId, username, userColor } = payload;

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
      default:
        message = "🤷";
    }

    // setAlertMessage({ message: `"${username}" - ${message}` });
    setMessageHistory([
      ...messageHistory,
      { communityId, text: `"${username}" - ${message}`, userColor },
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
    const { community, username, userColor, isSynergized } = payload;

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

  useEffect(() => {
    try {
      const messageData = JSON.parse(lastMessage?.data);
      const { type, payload } = messageData;

      switch (type) {
        case "get-community-reply":
          if (!payload.community) {
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

        default:
          console.log("unknown message type", type);
      }
    } catch (e) {
      console.log("error parsing message", e);
    }
  }, [lastMessage]);

  useEffect(() => {}, [lastMessage]);

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

  const joinCommunity = ({ communityId, username, userId, votingMember }) => {
    sendMessage(
      JSON.stringify({
        type: "join-community",
        payload: {
          community: {
            id: communityId,
            username,
            userId,
            votingMember,
          },
        },
      })
    );
  };

  const leaveCommunity = ({ communityId, userId, username, userColor }) => {
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
          vote
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
    clearAlertMessage,
    community,
    communityReaction,
    deleteCommunity,
    editPointScheme,
    joinCommunity,
    handleReveal,
    handleReset,
    leaveCommunity,
    readyState,
    roomEvents,
    submitVote,
    messageHistory,
  };
}
