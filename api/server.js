const WebSocketServer = require("ws").Server;
const server = require("http").createServer();
const app = require("./http-server");
const url = require("url");

const communityClient = require("./communityClient");
const color = require("randomcolor");

const setTargetSessionOn = (ws, request) => {
  const queryParams = url.parse(request.url, { parseQueryString: true }).query;
  ws["targetCommunityId"] = queryParams.communityId;
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const websocketServer = new WebSocketServer({
  server: server,
  path: "/socket",
});

server.on("request", app);

websocketServer.on("connection", (ws, request) => {
  console.log("## new client connected");
  setTargetSessionOn(ws, request);

  ws.on("error", console.error);

  ws.on("message", (message) => {
    const messageData = message.toString();
    console.log("messageData", messageData);

    const { type, payload } = JSON.parse(messageData);

    switch (type) {
      case "create-community":
        handleCreateCommunity(payload);
        break;

      case "join-community":
        handleJoinCommunity(payload);
        break;

      case "leave-community":
        handleLeaveCommunity(payload);
        break;

      case "list-communities":
        handleListCommunities(payload);
        break;

      case "get-community":
        handleGetCommunity(payload);
        break;

      case "reveal":
        handleReveal(payload);
        break;

      case "reset":
        handleReset(payload);
        break;

      case "submit-vote":
        handleSubmitVote(payload);
        break;

      case "delete-community":
        handleDeleteCommunity(payload);
        break;

      case "community-reaction":
        handleCommunityReaction(payload);
        break;

      default:
        console.error("unmatched event", message.toString());
        break;
    }
  });

  ws.send(JSON.stringify({ message: "I'm glad you and I could connect" }));
});

const notifyClients = ({ message, communityId }) => {
  websocketServer.clients.forEach((client) => {
    const isTargeted = communityId !== undefined;

    // only send to the target community if provided
    if (isTargeted) {
      const clientIsTargeted = communityId == client.targetCommunityId;
      if (clientIsTargeted) {
        console.log("replying to client", client.targetCommunityId, message);
        client.send(JSON.stringify(message));
      }
    } else {
      if (!client.targetCommunityId) {
        console.log("replying to all clients", message);
        client.send(JSON.stringify(message));
      }
    }
  });
};

const handleCommunityReaction = (payload) => {
  const { community, event, userId, username } = payload;
  const { id: communityId } = community;

  const reply = {
    type: "community-reaction-reply",
    payload: { event, userId, username },
  };

  notifyClients({ message: reply, communityId });
};

const handleCreateCommunity = async (payload) => {
  const { community } = payload;
  const result = await communityClient.addCommunity(community);
  // result is the created item

  const communities = await communityClient.getCommunitiesAsArray();

  const message = {
    type: "community-created-reply",
    payload: { communities },
  };

  notifyClients({ message });
};

const handleDeleteCommunity = async (payload) => {
  const { community, userId, username } = payload;

  const deleteResult = await communityClient.deleteCommunity({
    community,
    userId,
    username,
  });

  const message = {
    type: "delete-community-reply",
    payload: deleteResult,
  };

  notifyClients({ message, communityId: community.id });
};

const handleJoinCommunity = async (payload) => {
  const {
    community: { id: communityId, username, userId, votingMember },
  } = payload;

  const userColor = color.randomColor({
    luminosity: "bright",
    format: "rgb",
  });

  const updatedCommunity = await communityClient.joinCommunity({
    communityId,
    username,
    userId,
    userColor,
    votingMember,
  });

  const reply = {
    type: "community-joined-reply",
    payload: {
      joinedUser: { username, userId, votingMember, userColor },
      community: updatedCommunity,
    },
  };

  notifyClients({ message: reply, communityId });
};

const handleLeaveCommunity = async (payload) => {
  const {
    community: { id: communityId, username, userId },
  } = payload;

  const updatedCommunity = await communityClient.leaveCommunity({
    communityId,
    username,
    userId,
  });

  const reply = {
    type: "community-left-reply",
    payload: {
      leftUser: { username, userId },
      community: updatedCommunity,
    },
  };

  notifyClients({ message: reply, communityId });
};

const handleListCommunities = async () => {
  const communitiesSummary = await communityClient.getCommunitiesAsArray();

  const reply = {
    type: "list-communities-reply",
    payload: {
      communities: communitiesSummary,
    },
  };

  notifyClients({ message: reply });
};

const handleGetCommunity = async (payload) => {
  const { communityId } = payload;

  const result = await communityClient.getCommunityBy(communityId);

  const reply = {
    type: "get-community-reply",
    payload: { community: result },
  };

  notifyClients({ message: reply, communityId });
};

const handleSubmitVote = async (payload) => {
  const { community } = payload;
  const { id: communityId, userId, username, vote } = community;

  const result = await communityClient.submitVote({
    communityId,
    userId,
    vote,
  });

  const reply = {
    type: "submit-vote-reply",
    payload: { community: result, username, userId },
  };

  notifyClients({ message: reply, communityId });
};

// technically you can see points by inspecting the ws messages, but that'll be our little secret for now
const handleReveal = async (payload) => {
  const { community, username, userId } = payload;
  const { id: communityId } = community;

  const result = await communityClient.reveal({ communityId });

  const reply = {
    type: "reveal-reply",
    payload: { community: result, username, userId },
  };

  notifyClients({ message: reply, communityId });
};

const handleReset = async (payload) => {
  const { community, username, userId } = payload;
  const { id: communityId } = community;

  const result = await communityClient.reset({ communityId });

  const reply = {
    type: "reset-reply",
    payload: { community: result, username, userId },
  };

  notifyClients({ message: reply, communityId });
};

setInterval(() => {
  websocketServer.clients.forEach((client) => {
    client.send(JSON.stringify({ hey: "friend" }));
  });
}, 30000);

server.listen(process.env.PORT || 8080, () => {
  console.log(`listening on ${process.env.PORT || 8080}`);
});
