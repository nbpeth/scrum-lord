const WebSocketServer = require("ws").Server;
const server = require("http").createServer();
const app = require("./http-server");
const url = require("url");
const uuid = require("uuid");
const communityClient = require("./communityClient");
const color = require("randomcolor");

const state = {
  timers: {
    // communityId: { timer, timeout, timerEndDate }
  },
};

const setTargetSessionOn = (ws, request) => {
  const queryParams = url.parse(request.url, { parseQueryString: true }).query;
  ws.targetCommunityId = queryParams.communityId;
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

websocketServer.on("listening", (x) => {});
websocketServer.on("close", (code, reason) => {
  console.log(
    `WebSocket connection closed with code ${code} and reason ${reason}`
  );
});

const close = (ws) => (reason) => {
  // looks like they might have left on their own
  ws.isAlive = false;
  console.log("client disconnected", ws.id, websocketServer.clients.size);
};

const heartbeat = (ws) => {
  if (ws.isAlive) {
    ws.terminate();
  }
};

const resetCommunityTimer = async (timer, communityId) => {
  clearTimeout(timer);

  const result = await communityClient.cancelTimer({
    communityId,
  });

  return result;
};

const getTimerForCommunityBy = (communityId) => {
  const timer = state?.timers[communityId]?.timer;

  return timer;
};

const killTimerIfExists = async (communityId) => {
  // if there is still a timer active on reveal, clear it
  const timer = getTimerForCommunityBy(communityId);
  if (timer) {
    await resetCommunityTimer(timer, communityId);
  }
};

// the boatman ferries wayward connections to the other side
const boatman = (ws) => setTimeout(() => heartbeat(ws), 40000);

websocketServer.on("connection", (ws, request) => {
  console.log("new client connected");
  setTargetSessionOn(ws, request);
  // set a unique id on the connection for science
  ws.id = uuid.v4();

  // ping-pong: handle terminiation of dead connections
  ws.isAlive = true;
  ws.pingTimeout = boatman(ws);

  const pong = () => {
    // live another day
    ws.isAlive = true;
    // console.log("pong  ", ws.id);
    clearTimeout(ws.pingTimeout);

    ws.pingTimeout = boatman(ws);
  };

  ws.on("message", (message) => {
    const messageData = message.toString();
    // console.log("messageData", messageData);

    const { type, payload } = JSON.parse(messageData);

    switch (type) {
      case "create-community":
        handleCreateCommunity(payload, ws);
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

      case "edit-point-scheme":
        handleEditPointScheme(payload);
        break;

      case "start-timer":
        handleStartTimer(payload, ws);
        break;

      case "cancel-timer":
        handleCancelTimer(payload, ws);
        break;

      default:
        console.error("unmatched event", message.toString());
        break;
    }
  });

  ws.on("error", console.error);
  ws.on("close", close(ws));
  ws.on("pong", pong);

  ws.send(JSON.stringify({ message: "I'm glad you and I could connect" }));
});

const notifyCaller = (ws, message) => {
  ws.send(JSON.stringify(message));
};

const notifyClients = ({ message, communityId }) => {
  websocketServer.clients.forEach((client) => {
    const isTargeted = communityId !== undefined;

    // only send to the target community if provided
    if (isTargeted) {
      const clientIsTargeted = communityId == client.targetCommunityId;
      if (clientIsTargeted) {
        // console.log("replying to client", client.targetCommunityId, message);
        client.send(JSON.stringify(message));
      }
    } else {
      if (!client.targetCommunityId) {
        // console.log("replying to all clients", message);
        client.send(JSON.stringify(message));
      }
    }
  });
};

const handleCommunityReaction = (payload) => {
  const { community, event, userId, username, userColor } = payload;
  const { id: communityId } = community;

  const reply = {
    type: "community-reaction-reply",
    payload: { event, userId, username, userColor },
  };

  notifyClients({ message: reply, communityId });
};

const handleCreateCommunity = async (payload, ws) => {
  const { community } = payload;
  
  const result = await communityClient.addCommunity(community);
  if (community.isPrivate) {
    notifyCaller(ws, {
      type: "community-created-complete-reply",
      payload: { result },
    });
  }

  const communities = await communityClient.getCommunitiesAsArray();

  const message = {
    type: "community-created-reply",
    payload: { communities },
  };

  notifyClients({ message });
};

const handleDeleteCommunity = async (payload) => {
  const { community, userId, username, userColor } = payload;

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
    community: { id: communityId, username, userId, userColor, votingMember },
  } = payload;

  const updatedCommunity = await communityClient.joinCommunity({
    communityId,
    username,
    userId,
    userColor:
      userColor ??
      color.randomColor({
        luminosity: "bright",
      }),
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
    userColor,
  } = payload;

  const updatedCommunity = await communityClient.leaveCommunity({
    communityId,
    username,
    userId,
  });

  const reply = {
    type: "community-left-reply",
    payload: {
      leftUser: { username, userId, userColor },
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
    payload: { community: result, communityId },
  };

  notifyClients({ message: reply, communityId });
};

const handleSubmitVote = async (payload) => {
  const { community, userColor } = payload;
  const { id: communityId, userId, username, vote } = community;

  const result = await communityClient.submitVote({
    communityId,
    userId,
    vote,
  });

  const reply = {
    type: "submit-vote-reply",
    payload: {
      community: result,
      username,
      userId,
      userColor,
      doubleVote: result?.doubleVote,
    },
  };

  notifyClients({ message: reply, communityId });
};

// technically you can see points by inspecting the ws messages, but that'll be our little secret for now
const handleReveal = async (payload) => {
  const { community, username, userId, userColor } = payload;
  const { id: communityId } = community;

  await killTimerIfExists(communityId);

  const result = await communityClient.reveal({ communityId });
  // const isSynergized = verifySynergy(result);
  console.log("reveal", result);

  const reply = {
    type: "reveal-reply",
    payload: {
      community: { ...result },
      username,
      userId,
      userColor,
      isSynergized: result?.isSynergized,
    },
  };

  notifyClients({ message: reply, communityId });
};

const handleReset = async (payload) => {
  const { community, username, userId, userColor } = payload;
  const { id: communityId } = community;

  await killTimerIfExists(communityId);

  const result = await communityClient.reset({ communityId });

  const reply = {
    type: "reset-reply",
    payload: { community: result, username, userId, userColor },
  };

  notifyClients({ message: reply, communityId });
};

const handleEditPointScheme = async (payload) => {
  const { community, username, userId, userColor, scheme } = payload;
  const { id: communityId } = community;

  const result = await communityClient.editPointScheme({ communityId, scheme });

  const reply = {
    type: "edit-point-scheme-reply",
    payload: { community: result, username, userId, userColor, scheme },
  };

  notifyClients({ message: reply, communityId });
};

// set the timer to running for the community, notify everyone it has started then wait the duration of the timer to notify them it's over and set the timer to not running
// timer ending naturally causes a reveal
// timer being cancelled does not reveal and should have its own message
const handleStartTimer = async (payload, ws) => {
  const { community, username, userId, userColor, timerLength } = payload;
  const { id: communityId } = community;
  const communityState = await communityClient.getCommunityBy(communityId);
  const { timerRunning } = communityState;

  if (timerRunning) {
    ws.send(
      JSON.stringify({
        type: "start-timer-reply",
        payload: {
          community: communityState,
          username,
          userColor,
          timerLength,
          error: "Timer already running",
        },
      })
    );
    return;
  }

  const result = await communityClient.startTimer({
    communityId,
    timerLength,
  });

  const reply = {
    type: "start-timer-reply",
    payload: { community: result, username, userColor, timerLength },
  };

  notifyClients({ message: reply, communityId });

  // we've started the timer, wait the timer length and then send a message to all clients - hopefully it all lines up
  const timerFunction = async () => {
    const result = await communityClient.stopTimer({ communityId });

    const timerFinishedReply = {
      type: "timer-finished-reply",
      payload: { community: result, username, userColor, timerLength },
    };

    notifyClients({ message: timerFinishedReply, communityId });
    // adding a little time for latency
  };

  // assign it so we can cancel it
  const timer = setTimeout(timerFunction, timerLength * 1000 + 150);
  state.timers[communityId] = { timer };
};

const handleCancelTimer = async (payload, ws) => {
  const { community, username, userId, userColor, timerLength } = payload;
  const { id: communityId } = community;
  const timer = getTimerForCommunityBy(communityId);

  if (!timer) {
    console.warn("no timer to cancel", JSON.stringify(payload), ws.id);
    return;
  }

  const result = await resetCommunityTimer(timer, communityId);

  const timerFinishedReply = {
    type: "cancel-timer-reply",
    payload: { community: result, username, userColor },
  };

  notifyClients({ message: timerFinishedReply, communityId });
};

// ping-pong: send a ping to all clients every 30 seconds
setInterval(() => {
  websocketServer.clients.forEach((client) => {
    client.ping();
  });
}, 30000);

// check for orphaned timers once daily
// setInterval(() => {

// }, 86400000);

server.listen(process.env.PORT || 8080, () => {
  console.log(`listening on ${process.env.PORT || 8080}`);
});
