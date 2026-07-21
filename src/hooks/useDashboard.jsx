import { useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getSocketBaseUrl, socketOptions } from "../util/config";

const COMMUNITY_LIMIT = 100;

export default function useDashboard() {
  const [communities, setCommunities] = useState([]);
  const [communityCreatedComplete, setCommunityCreatedComplete] = useState();
  const [socketUrl, setSocketUrl] = useState(null);
  const [, setReconnection] = useState({
    attempts: 15,
    interval: 5,
    reconnecting: false,
  });

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    ...socketOptions({ setReconnection }),
  });

  useEffect(() => {
    setSocketUrl(`${getSocketBaseUrl()}/socket`);
  }, []);

  useEffect(() => {
    if (!lastMessage?.data) {
      return;
    }
    try {
      const { type, payload } = JSON.parse(lastMessage.data);

      switch (type) {
        case "list-communities-reply":
          setCommunities(
            payload.communities.map((c) => ({
              ...c,
              synergy: {
                ...c.synergy,
                value: (c.synergy?.hits ?? 0) / (c.synergy?.total ?? 1),
              },
            }))
          );
          break;

        case "community-created-reply":
          setCommunities(payload.communities);
          break;

        case "community-created-complete-reply":
          if (payload.result?.length > 0) {
            setCommunityCreatedComplete(payload.result[0]);
          }
          break;

        default:
          console.log("unknown message type", type);
      }
    } catch (e) {
      console.log("error parsing message", e);
    }
  }, [lastMessage]);

  const addCommunity = async (community) => {
    if (communities.length >= COMMUNITY_LIMIT) {
      throw new Error("Community limit reached");
    }

    sendMessage(
      JSON.stringify({ type: "create-community", payload: { community } })
    );
  };

  const fetchCommunities = useCallback(() => {
    sendMessage(JSON.stringify({ type: "list-communities" }));
  }, [sendMessage]);

  return {
    addCommunity,
    fetchCommunities,
    communityCreatedComplete,
    readyState,
  };
}
