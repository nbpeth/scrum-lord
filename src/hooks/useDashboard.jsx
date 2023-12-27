import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

// probably move to separate hooks for dash and session
export default function useDashboard() {
  const [_communities, setCommunities] = useState([]);
  const [socketUrl, setSocketUrl] = useState("ws://localhost:8080/socket");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  /*
  console.log("ready?", readyState);
  if it's closed, tell them to refresh or click a button or something

   0 = CONNECTING
   1 = OPEN
   2 = CLOSING
   3 = CLOSED
  */

  useEffect(() => {
    try {
      const messageData = JSON.parse(lastMessage?.data);
      const { type, payload } = messageData;

      switch (type) {
        case "list-communities":
          // console.log("list-communities response", payload);
          const { communities: fetchedCommunities } = payload;

          setCommunities(fetchedCommunities);

          break;
        case "community-created":
          // console.log("community-created response", payload);
          const { communities } = payload;

          setCommunities(communities);

          break;

        default:
          console.log("unknown message type", type);
      }
    } catch (e) {
      console.log("error parsing message", e);
    }
  }, [lastMessage]);

  const addCommunity = async (community) => {
    if (_communities.length >= 10) {
      throw new Error("Too many communities");
    }

    sendMessage(
      JSON.stringify({ type: "create-community", payload: { community } })
    );
  };

  const removeCommunity = (communityToRemove) => {};

  const fetchCommunities = () => {
    sendMessage(JSON.stringify({ type: "list-communities" }));
  };

  const listCommunities = () => {
    return _communities;
  };

  const getCommunityById = (id) => {
    return _communities.find((c) => c.id === id);
  };

  return {
    addCommunity,
    fetchCommunities,
    listCommunities,
    removeCommunity,
  };
}
