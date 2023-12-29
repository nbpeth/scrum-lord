const WebSocketServer = require("ws").Server;
const server = require("http").createServer();
const app = require("./http-server");
const url = require("url");

const communityClient = require("./communityClient");

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
  console.log("new client connected");
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

const handleCreateCommunity = (payload) => {
  const { community } = payload;
  communityClient.addCommunity(community);

  const communities = communityClient.getCommunitiesAsArray();

  const message = {
    type: "community-created-reply",
    payload: { communities },
  };

  notifyClients({ message });
};

const handleDeleteCommunity = (payload) => {
  const { community, userId, username } = payload;

  const deleteResult = communityClient.deleteCommunity({
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

const handleJoinCommunity = (payload) => {
  const {
    community: { id: communityId, username, userId },
  } = payload;

  const updatedCommunity = communityClient.joinCommunity({
    communityId,
    username,
    userId,
  });

  const reply = {
    type: "community-joined-reply",
    payload: {
      joinedUser: { username, userId },
      community: updatedCommunity,
    },
  };

  notifyClients({ message: reply, communityId });
};

const handleLeaveCommunity = (payload) => {
  const {
    community: { id: communityId, username, userId },
  } = payload;

  const updatedCommunity = communityClient.leaveCommunity({
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

const handleListCommunities = () => {
  const communitiesSummary = communityClient.getCommunitiesAsArray();

  const reply = {
    type: "list-communities-reply",
    payload: {
      communities: communitiesSummary,
    },
  };

  notifyClients({ message: reply });
};

const handleGetCommunity = (payload) => {
  const { communityId } = payload;

  const result = communityClient.getCommunityBy(communityId);

  const reply = {
    type: "get-community-reply",
    payload: { community: result },
  };

  notifyClients({ message: reply, communityId });
};

const handleSubmitVote = (payload) => {
  const { community } = payload;
  const { id: communityId, userId, vote } = community;

  const result = communityClient.submitVote({ communityId, userId, vote });

  const reply = {
    type: "submit-vote-reply",
    payload: { community: result },
  };

  notifyClients({ message: reply, communityId });
};

// technically you can see points by inspecting the ws messages, but that'll be our little secret for now
const handleReveal = (payload) => {
  const { community } = payload;
  const { id: communityId } = community;

  const result = communityClient.reveal({ communityId });

  const reply = {
    type: "reveal-reply",
    payload: { community: result },
  };

  notifyClients({ message: reply, communityId });
};

const handleReset = (payload) => {
  const { community } = payload;
  const { id: communityId } = community;

  const result = communityClient.reset({ communityId });

  const reply = {
    type: "reset-reply",
    payload: { community: result },
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
