import { Box, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { WebSocketReadyState } from "../../util/websocketUtils";
import {
  statusContainerSx,
  statusDotSx,
  statusRippleSx,
} from "./ConnectionStatus.styles";

const stateConfig = {
  [WebSocketReadyState.CONNECTING]: {
    color: "warning.main",
    label: "Connecting…",
    pulse: true,
  },
  [WebSocketReadyState.OPEN]: {
    color: "success.main",
    label: "Connected",
    pulse: false,
  },
  [WebSocketReadyState.CLOSING]: {
    color: "warning.main",
    label: "Closing…",
    pulse: true,
  },
  [WebSocketReadyState.CLOSED]: {
    color: "error.main",
    label: "Disconnected",
    pulse: true,
  },
};

const fallback = { color: "info.main", label: "Unknown", pulse: false };

export const ConnectionStatus = ({ readyState, size = 10 }) => {
  const { color, label, pulse } = stateConfig[readyState] ?? fallback;
  const prevState = useRef(null);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    if (prevState.current !== readyState) {
      prevState.current = readyState;
      setRipple(true);
      const id = setTimeout(() => setRipple(false), 600);
      return () => clearTimeout(id);
    }
  }, [readyState]);

  const ringSize = size * 3;

  return (
    <Tooltip title={label} placement="bottom" arrow>
      <Box
        id="connection-status-alert"
        role="status"
        aria-label={label}
        sx={statusContainerSx(size)}
      >
        {ripple && <Box sx={statusRippleSx({ ringSize, color })} />}
        <Box sx={statusDotSx({ size, color, pulse })} />
      </Box>
    </Tooltip>
  );
};
