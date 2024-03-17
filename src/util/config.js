const { WebSocketReadyState } = require("./websocketUtils");
const apiKey = process.env.REACT_APP_API_KEY;

const getSocketBaseUrl = () => {
  const host = window.location.host;
  const hostname = window.location.hostname;
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const serverPort = process.env.REACT_APP_SERVER_PORT;

  if (serverPort) {
    return `${wsProtocol}://${hostname}:${serverPort}`;
  }

  return `${wsProtocol}://${host}`;
};

const socketOptions = ({ setReconnection }) => ({
  queryParams: { token: apiKey },
  onOpen: () => {
    setReconnection({ reconnecting: false });
  },
  shouldReconnect: (closeEvent) => {
    // these should be graceful exits like an unmount
    if (
      closeEvent.code === WebSocketReadyState.CLOSED ||
      closeEvent.code === WebSocketReadyState.ABNORMAL_CLOSURE
    ) {
      setReconnection({ reconnecting: false });
      return false;
    }

    // setInterval(() => {
    //   const attempts = reconnection.attempts;
    //   setReconnection({ reconnecting: true, attempts: attempts - 1, interval: 5 });
    // }, 1000)
    return true;
  },
  heartBeat: true,
  share: true,
  reconnectInterval: 5000,
  reconnectAttempts: 15,
});

module.exports = {
  getSocketBaseUrl,
  socketOptions,
};
