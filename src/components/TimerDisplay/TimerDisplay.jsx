import { Typography } from "@mui/material";
import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";
import { timerValueSx } from "./TimerDisplay.styles";

export const TimerDisplay = ({ community }) => {
  const [timerEndDate, setTimerEndDate] = useState();
  const [timeRemaining, setTimeRemaining] = useState();

  const timerRunning = Boolean(community?.timer?.running);

  useEffect(() => {
    if (timerRunning) {
      setTimerEndDate(community?.timer?.timerEnd);
    }
  }, [community, timerRunning]);

  useEffect(() => {
    setTimeRemaining(differenceInSeconds(timerEndDate, new Date()));
  }, [timerEndDate]);

  useEffect(() => {
    const timerWasStarted = timerRunning && community?.timer?.value;
    const timerWasCancelled = timerEndDate && !timerRunning;

    if (timerWasStarted) {
      const countdown = setInterval(() => {
        setTimeRemaining(differenceInSeconds(timerEndDate, new Date()));
      }, 1000);

      return () => clearInterval(countdown);
    }
    if (timerWasCancelled) {
      setTimeRemaining(undefined);
    }
  }, [community, timerEndDate, timerRunning]);

  return (
    <Typography variant="h6" component="div" sx={timerValueSx}>
      {timeRemaining > 0 ? timeRemaining : "-"}
    </Typography>
  );
};
