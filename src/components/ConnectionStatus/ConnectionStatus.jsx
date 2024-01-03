import { Alert, useMediaQuery } from "@mui/material";

export const ConnectionStatus = ({ readyState }) => {
  const fullsizeScreen = useMediaQuery("(min-width:800px)");

  /*
  console.log("ready?", readyState);
  if it's closed, tell them to refresh or click a button or something

   0 = CONNECTING
   1 = OPEN
   2 = CLOSING
   3 = CLOSED
  */

  const getSeverity = (readyState) => {
    switch (readyState) {
      case 0:
        return {
          severity: "info",
          message: "Connecting...",
        };
      case 1:
        return {
          severity: "success",
          message: "Connected",
        };

      case 2:
        return {
          severity: "warning",
          message: "Closing...",
        };
      case 3:
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

  const { severity, message } = getSeverity(readyState);

  return <Alert severity={severity}>{fullsizeScreen ? message : null}</Alert>;
};
