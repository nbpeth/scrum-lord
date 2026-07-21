const http = require("http");
const url = require("url");
const uuid = require("uuid");
const WebSocketServer = require("ws").Server;

const app = require("./http-server");
const communityClient = require("./communityClient");
const { validateRequest } = require("./lib/auth");
const { createHandlers } = require("./lib/handlers");
const { createHotdogAlert } = require("./lib/hotdogAlert");
const { createClientNotifier } = require("./lib/notify");

const PORT = process.env.PORT || 8080;
const PING_INTERVAL_MS = 30000;
const CONNECTION_TIMEOUT_MS = 40000;

const authConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  isProd: process.env.ENV === "production",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",")?.map((x) => x.trim()),
};

const server = http.createServer();
server.on("request", app);

const websocketServer = new WebSocketServer({ server, path: "/socket" });

const notifyClients = createClientNotifier(websocketServer);
const hotdogAlert = createHotdogAlert({ notifyClients });
const handlers = createHandlers({ communityClient, notifyClients, hotdogAlert });

const terminateWhenUnresponsive = (ws) =>
  setTimeout(() => {
    if (ws.isAlive) {
      ws.terminate();
    }
  }, CONNECTION_TIMEOUT_MS);

websocketServer.on("close", (code, reason) => {
  console.log(
    `WebSocket connection closed with code ${code} and reason ${reason}`
  );
});

websocketServer.on("connection", (ws, request) => {
  if (!validateRequest(request, authConfig)) {
    console.error("unauthorized");
    ws.close();
    return;
  }

  console.log("new client connected");

  const queryParams = url.parse(request.url, { parseQueryString: true }).query;
  ws.targetCommunityId = queryParams.communityId;
  ws.id = uuid.v4();

  ws.isAlive = true;
  ws.pingTimeout = terminateWhenUnresponsive(ws);

  ws.on("message", (message) => {
    let parsed;
    try {
      parsed = JSON.parse(message.toString());
    } catch (e) {
      console.error("unparseable message", message.toString());
      return;
    }

    const handler = handlers[parsed.type];
    if (!handler) {
      console.error("unmatched event", message.toString());
      return;
    }

    Promise.resolve(handler(parsed.payload, ws)).catch((e) =>
      console.error(`error handling "${parsed.type}"`, e)
    );
  });

  ws.on("pong", () => {
    ws.isAlive = true;
    clearTimeout(ws.pingTimeout);
    ws.pingTimeout = terminateWhenUnresponsive(ws);
  });

  ws.on("close", () => {
    ws.isAlive = false;
    clearTimeout(ws.pingTimeout);
    console.log("client disconnected", ws.id, websocketServer.clients.size);
  });

  ws.on("error", console.error);
});

setInterval(() => {
  websocketServer.clients.forEach((client) => client.ping());
}, PING_INTERVAL_MS);

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
