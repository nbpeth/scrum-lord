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

      case "submit-vote":
        handleSubmitVote(payload);
        break;

      default:
        console.error("unmatched event", message.toString());
        break;
    }

    console.log("message", messageData);
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
        client.send(JSON.stringify(message));
      }
    } else {
      if (!client.targetCommunityId) {
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
    type: "community-created",
    payload: { communities },
  };

  notifyClients({ message });
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
    type: "community-joined",
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
    type: "community-left",
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
    type: "list-communities",
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
    type: "get-community",
    payload: { community: result },
  };

  notifyClients({ message: reply, communityId });
};

const handleSubmitVote = (payload) => {
  const { community } = payload;
  const { id: communityId, userId, vote } = community;

  const result = communityClient.submitVote({ communityId, userId, vote });

  const reply = {
    type: "submit-vote",
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
