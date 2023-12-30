import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

export default function useCommunity() {
  const params = useParams();
  const communityId = params.communityId;
  const websocketUrlRoot = "ws://localhost:8080/socket";
  const [socketUrl, setSocketUrl] = useState(null);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [community, setCommunity] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  // const [messageHistory, setMessageHistory] = useState([]);

  const [roomEvents, setRoomEvents] = useState({});

  const navigate = useNavigate();
  // configure the socket url to target the community id
  useEffect(() => {
    setSocketUrl(`${websocketUrlRoot}?communityId=${communityId}`);
  }, [communityId]);

  // get community data on mount
  useEffect(() => {
    sendMessage(
      JSON.stringify({ type: "get-community", payload: { communityId } })
    );
  }, [communityId]);

  const handleCommunityJoined = (payload) => {
    try {
      console.log("community-joined response", payload);
      const { joinedUser, community } = payload;

      const { citizens: updatedCitizens, id } = community;

      setCommunity(community);
      setAlertMessage(`"${joinedUser.username}" joined!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCommunityLeft = (payload) => {
    console.log("community-left response", payload);
    const { leftUser, community } = payload;
    const { citizens: updatedCitizens, id } = community;

    setCommunity(community);
    setAlertMessage(`${leftUser.username} left the community`);
  };

  // blanket holistic updates for now, duplicated but unsure where to go in the future
  const handleSubmittedVote = (payload) => {
    const { community } = payload;

    setCommunity(community);
  };

  const handleResetReply = (payload) => {
    const { community } = payload;

    setCommunity(community);
  };

  const handleRevealReply = (payload) => {
    const { community } = payload;

    setCommunity(community);
  };

  useEffect(() => {
    try {
      const messageData = JSON.parse(lastMessage?.data);
      const { type, payload } = messageData;

      // console.log("messageData", messageData);

      switch (type) {
        case "get-community-reply":
          if (!payload.community) {
            navigate("/?error=404");
          } else {
            setCommunity(payload.community);
          }

          break;
        case "community-joined-reply":
          handleCommunityJoined(payload);

          break;
        case "community-left-reply":
          handleCommunityLeft(payload);

          break;
        case "submit-vote-reply":
          handleSubmittedVote(payload);

          break;

        case "reveal-reply":
          handleRevealReply(payload);

          break;
        case "reset-reply":
          handleResetReply(payload);

          break;

        case "delete-community-reply":
          handleCommunityDeletedReply(payload);

          break;

        default:
          console.log("unknown message type", type);
      }
    } catch (e) {
      console.log("error parsing message", e);
    }
  }, [lastMessage]);

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

  const handleReveal = () => {
    sendMessage(
      JSON.stringify({
        type: "reveal",
        payload: { community: { id: communityId } },
      })
    );
  };

  const handleReset = () => {
    sendMessage(
      JSON.stringify({
        type: "reset",
        payload: { community: { id: communityId } },
      })
    );
  };

  const joinCommunity = ({ communityId, username, userId }) => {
    sendMessage(
      JSON.stringify({
        type: "join-community",
        payload: {
          community: {
            id: communityId,
            username,
            userId,
          },
        },
      })
    );
  };

  const leaveCommunity = ({ communityId, userId, username }) => {
    sendMessage(
      JSON.stringify({
        type: "leave-community",
        payload: { community: { id: communityId, userId, username } },
      })
    );
  };

  const submitVote = ({ communityId, userId, vote }) => {
    sendMessage(
      JSON.stringify({
        type: "submit-vote",
        payload: { community: { id: communityId, userId, vote } },
      })
    );
  };

  const deleteCommunity = ({ communityId, userId, username }) => {
    sendMessage(
      JSON.stringify({
        type: "delete-community",
        payload: { community: { id: communityId }, userId, username },
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
    deleteCommunity,
    joinCommunity,
    handleReveal,
    handleReset,
    leaveCommunity,
    readyState,
    roomEvents,
    submitVote,
  };
}
