import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getSocketBaseUrl } from "../util/config";

export default function useDashboard() {
  const [_communities, setCommunities] = useState([]);
  const [privateRoomCreatedComplete, setPrivateRoomCreatedComplete] =
    useState();
  const [socketUrl, setSocketUrl] = useState(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    const baseUrl = `${getSocketBaseUrl()}/socket`;

    setSocketUrl(`${baseUrl}`);
  }, []);

  useEffect(() => {
    try {
      const messageData = JSON.parse(lastMessage?.data);
      const { type, payload } = messageData;
      console.log(
        type === "private-community-created-reply",
        "messageData",
        messageData
      );

      switch (type) {
        case "list-communities-reply":
          const { communities: fetchedCommunities } = payload;

          setCommunities(
            fetchedCommunities.map((c) => ({
              ...c,
              synergy: {
                ...c.synergy,
                value: c.synergy?.hits ?? 0 / c.synergy?.total ?? 1,
              },
            }))
          );

          break;
        case "community-created-reply":
          const { communities } = payload;

          setCommunities(communities);

          break;

        case "private-community-created-reply":
          const { result } = payload;

          if (result?.length > 0) {
            setPrivateRoomCreatedComplete(result[0]);
          }
          /*
            id: 'f6f5d00b-ce4f-417d-9e2e-94677e4a6283',
            isPrivate: true,
            name: 'x',
            description: undefined,
            citizens: 0
          */

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
      throw new Error("Community limit reached");
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

  console.log("?", privateRoomCreatedComplete);

  return {
    addCommunity,
    fetchCommunities,
    listCommunities,
    readyState,
    removeCommunity,
    privateRoomCreatedComplete,
  };
}
