import { Box, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { WebSocketReadyState } from "../../util/websocketUtils";

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
        sx={{
          position: "relative",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ripple && (
          <Box
            sx={{
              position: "absolute",
              width: ringSize,
              height: ringSize,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: color,
              animation: "status-ring 0.6s ease-out forwards",
              "@keyframes status-ring": {
                "0%": { transform: "scale(0.3)", opacity: 0.9 },
                "100%": { transform: "scale(1)", opacity: 0 },
              },
            }}
          />
        )}
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            bgcolor: color,
            transition: "background-color 0.3s ease",
            boxShadow: (t) =>
              `0 0 6px 2px ${t.palette.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
            ...(pulse && {
              animation: "status-pulse 2s ease-in-out infinite",
            }),
            "@keyframes status-pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.35 },
            },
          }}
        />
      </Box>
    </Tooltip>
  );
};
