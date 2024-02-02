import { Alert, useMediaQuery } from "@mui/material";
import { WebSocketReadyState } from "../../util/websocketUtils";

export const ConnectionStatus = ({ readyState, reconnection }) => {
  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  const getSeverity = (readyState) => {
    switch (readyState) {
      case WebSocketReadyState.CONNECTING:
        return {
          severity: "info",
          message: "Connecting...",
        };
      case WebSocketReadyState.OPEN:
        return {
          severity: "success",
          message: "Connected",
        };

      case WebSocketReadyState.CLOSING:
        return {
          severity: "warning",
          message: "Closing...",
        };
      case WebSocketReadyState.CLOSED:
        return {
          severity: "error",
          message: "Disconnected",
        };
      default:
        return {
          severity: "info",
          message: "Unknown Status",
        };
    }
  };

  // show a reconnecting in...
  // if disconnected, show a button to reconnect

  const { severity, message } = getSeverity(readyState);

  return (
    <Alert severity={severity}>
      {/* {JSON.stringify(reconnection)} */}
      {fullsizeScreen ? message : null}
    </Alert>
  );
};
