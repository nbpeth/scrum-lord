import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

// probably move to separate hooks for dash and session
export default function useDashboard() {
  const [_communities, setCommunities] = useState([]);
  const [socketUrl, setSocketUrl] = useState(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    const host = document.location.host;
    const wsProtocol = document.location.protocol === "https:" ? "wss" : "ws";
    let baseUrl = `${wsProtocol}://${host}/socket`;

    // console.log("baseUrl", baseUrl);

    setSocketUrl(`${baseUrl}`);
    // setSocketUrl(`ws://localhost:8080/socket`);

  }, []);

  useEffect(() => {
    try {
      const messageData = JSON.parse(lastMessage?.data);
      const { type, payload } = messageData;

      switch (type) {
        case "list-communities-reply":
          const { communities: fetchedCommunities } = payload;

          setCommunities(fetchedCommunities);

          break;
        case "community-created-reply":
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
    readyState,
    removeCommunity,
  };
}
