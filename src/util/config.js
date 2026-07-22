import { WebSocketReadyState } from "./websocketUtils";

const apiKey = import.meta.env.VITE_API_KEY;

export const getSocketBaseUrl = () => {
  const host = window.location.host;
  const hostname = window.location.hostname;
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const serverPort = import.meta.env.VITE_SERVER_PORT;

  if (serverPort) {
    return `${wsProtocol}://${hostname}:${serverPort}`;
  }

  return `${wsProtocol}://${host}`;
};

export const socketOptions = ({ setReconnection }) => ({
  queryParams: { token: apiKey },
  onOpen: () => {
    setReconnection({ reconnecting: false });
  },
  shouldReconnect: (closeEvent) => {
    const isGracefulExit =
      closeEvent.code === WebSocketReadyState.CLOSED ||
      closeEvent.code === WebSocketReadyState.ABNORMAL_CLOSURE;

    if (isGracefulExit) {
      setReconnection({ reconnecting: false });
      return false;
    }

    return true;
  },
  heartBeat: true,
  share: true,
  reconnectInterval: 5000,
  reconnectAttempts: 15,
});
