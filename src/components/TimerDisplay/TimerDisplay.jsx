import { TimerOutlined } from "@mui/icons-material";
import { Box, Button, LinearProgress, Tooltip } from "@mui/material";
import { useCountdown } from "../../hooks/useCountdown";
import { countdownTone, formatCountdown } from "../../util/timer";
import {
  countdownButtonSx,
  countdownIconSx,
  countdownProgressSx,
  countdownWrapSx,
} from "./TimerDisplay.styles";

const URGENT_SECONDS = 10;

export const TimerDisplay = ({ community, onCancel }) => {
  const { secondsRemaining, totalSeconds, fractionRemaining } =
    useCountdown(community);

  const tone = countdownTone(secondsRemaining, totalSeconds);
  const urgent = secondsRemaining <= URGENT_SECONDS;

  return (
    <Box sx={countdownWrapSx}>
      <Tooltip title="Cancel timer" placement="top" arrow>
        <Button
          id="timer-countdown"
          size="small"
          variant="outlined"
          color={tone}
          onClick={onCancel}
          startIcon={<TimerOutlined sx={countdownIconSx} />}
          sx={countdownButtonSx(tone, urgent)}
        >
          {formatCountdown(secondsRemaining)}
        </Button>
      </Tooltip>
      <LinearProgress
        variant="determinate"
        color={tone}
        value={fractionRemaining * 100}
        sx={countdownProgressSx}
      />
    </Box>
  );
};
