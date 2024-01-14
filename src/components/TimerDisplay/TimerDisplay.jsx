import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { differenceInSeconds } from "date-fns";

export const TimerDisplay = ({ community }) => {
  const diff = (startDate, endDate) => {
    const diffInSeconds = differenceInSeconds(startDate, endDate);

    return diffInSeconds;
  };

  const [timerEndDate, setTimerEndDate] = useState();
  const [timeRemaining, setTimeRemaining] = useState();


  useEffect(() => {
    if (community?.timer?.running) {
      setTimerEndDate(community?.timer?.timerEnd);
    }
  }, [community]);

  useEffect(() => {
    const differenceInSeconds = diff(timerEndDate, new Date());
    setTimeRemaining(differenceInSeconds);
  }, [timerEndDate]);


  const timerWasStarted = community?.timer?.running && community?.timer?.value;
    const timerWasCancelled = timerEndDate && !community?.timer?.running;

  const getTimerDisplay = () => {
    return timeRemaining && timeRemaining > 0 ? timeRemaining : "-";
  };

  useEffect(() => {
    if (timerWasStarted) {
      const countdown = setInterval(() => {
        const now = new Date();
        
        const differenceInSeconds = diff(timerEndDate, now);

        setTimeRemaining(differenceInSeconds);
      }, 1000);
    

      return () => clearInterval(countdown);
    }
    else if (timerWasCancelled) {
      setTimeRemaining(undefined);
    }
  }, [community, timerEndDate]);

  return (
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      {getTimerDisplay()}
    </Typography>
  );
};
